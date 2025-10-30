import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { UsersSeed } from './users.seed';
import { RankingsSeed } from './ranking.seed';
import { ActivitiesSeed } from './activities.seed';
import { UserRole } from 'src/users/enums/user-role.enum';
import { User } from 'src/users/schemas/user.schema';
import { Ranking } from 'src/rankings/schemas/rankings.schema';
import { ResearchSeed } from './research.seed';
import { Activity } from 'src/activities/schemas/activity.schema';
@Injectable()
export class MainSeed implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(MainSeed.name);

  private seededUsers: User[] = [];
  private seededRankings: Ranking[] = [];
  private seededActivities: Activity[] = [];

  constructor(
    private readonly usersSeed: UsersSeed,
    private readonly rankingsSeed: RankingsSeed,
    private readonly activitiesSeed: ActivitiesSeed,
    private readonly researchSeed: ResearchSeed,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'DEV') {
      this.logger.log('DEV environment detected. Starting Seeder Module...');
      await this.run();
    }
  }

  async onApplicationShutdown(signal?: string) {
    if (process.env.NODE_ENV === 'DEV') {
      this.logger.log(
        `Shutdown signal received: ${signal}. Cleaning up seeded data...`,
      );
      await this.cleanup();
    }
  }

  async run(): Promise<void> {
    this.logger.log('--- Starting process of seeding database ---');

    const seededUsers = await this.usersSeed.seed();
    if (!seededUsers.length) {
      this.logger.error(
        'User seeding failed. Aborting the rest of the seeding process.',
      );
      return;
    }

    const students = seededUsers.filter((user) => user.role === UserRole.STUDENT);
    const teachers = seededUsers.filter((user) => user.role === UserRole.TEACHER);

    const seededRankings = await this.rankingsSeed.seed(teachers, students);
    if (!seededRankings.length) {
      this.logger.warn(
        'Ranking seeding did not create any rankings. Check logs for details.',
      );
    }

    const seededActivities = await this.activitiesSeed.seed(students, seededRankings);
    if (!seededActivities.length) {
      this.logger.warn(
        'Activities seeding did not create any activities. Check logs for details.',
      );
    }
    
    await this.researchSeed.seed();

    this.logger.log('--- Database seeding process finished successfully. ---');
  }

  async cleanup(): Promise<void> {
    this.logger.log('--- Starting process of cleaning the database ----');

    await this.activitiesSeed.cleanup(this.seededActivities);
    await this.rankingsSeed.cleanup(this.seededRankings);
    await this.usersSeed.cleanup(this.seededUsers);
    await this.researchSeed.cleanup();

    this.logger.log('--- Database cleaning process finished successfully. ---');
  }
}

