import { Injectable, Logger } from '@nestjs/common';
import { CreateRankingDTO } from 'src/rankings/dtos/create-ranking.dto';
import { RankingsService } from 'src/rankings/rankings.service';
import { Ranking } from 'src/rankings/schemas/rankings.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class RankingsSeed {
  private readonly logger = new Logger(RankingsSeed.name);

  constructor(private readonly rankingService: RankingsService) {}

  async seed(teachers: User[], students: User[]): Promise<Ranking[]> {
    this.logger.log('Starting seeding process for: Rankings....');

    if (!teachers.length || !students.length) {
      this.logger.warn('Skipping ranking seed: No teachers or students found.');
      return [];
    }

    try {
      const teacher = teachers[0];
      const createdRankings: Ranking[] = [];
      let joinPromises;

      const rankingsDTO: CreateRankingDTO[] = [
        {
          name: 'Terceiro Ano C',
          startDate: new Date(),
          endDate: new Date(new Date().getDate() + 60),
        },
        {
          name: 'Segundo Ano A',
          startDate: new Date(),
          endDate: new Date(new Date().getDate() + 60),
        },
      ];

      for (let ranking of rankingsDTO) {
        const createdRanking = await this.rankingService.create(
          ranking,
          teacher._id,
        );

        createdRankings.push(createdRanking);

        this.logger.log(`Ranking "${createdRanking.name}" created.`);

        joinPromises = students.map((student) =>
          this.rankingService.join(createdRanking.joinCode, student._id),
        );
      }

      await Promise.all(joinPromises);

      this.logger.log('Successfully seeded Rankings.');
      return createdRankings;
    } catch (error) {
      this.logger.error('Failed to seed Rankings.', error);
      return [];
    }
  }

  async cleanup(rankings: Ranking[]): Promise<void> {
    if (!rankings.length) return;
    this.logger.log('Cleaning up seeded Rankings...');
    try {
      const deletePromises = rankings.map((ranking) =>
        this.rankingService.deleteById(ranking._id),
      );

      await Promise.all(deletePromises);
      this.logger.log('Finished cleaning up Rankings.');
    } catch (error) {
      this.logger.error('Failed to cleanup Rankings.', error);
    }
  }
}
