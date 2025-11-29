import { faker } from '@faker-js/faker/locale/pt_BR';
import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { CreateActivityDTO } from 'src/activities/dtos/create-activity.dto';
import { ActivityItensity } from 'src/activities/enums/activity-intensity.enum';
import { ActivityType } from 'src/activities/enums/activity-type.enum';
import { Activity } from 'src/activities/schemas/activity.schema';
import { Ranking } from 'src/rankings/schemas/rankings.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ActivitiesSeed {
  private readonly logger = new Logger(ActivitiesSeed.name);

  constructor(private readonly activitiesService: ActivitiesService) {}

  async seed(students: User[], rankings: Ranking[]): Promise<Activity[]> {
    this.logger.log('Starting seeding process for: Activities....');

    if (!students.length || !rankings.length) {
      this.logger.warn(
        'Skipping activities seed: No students or rankings found.',
      );
      return [];
    }
    try {
      for (let ranking of rankings) {
        const allActivitiesPromises = students.map(async (student) => {
          const numberOfActivities = faker.number.int({ min: 5, max: 6 });
          const activitiesDTO =
            this._generateFakeActivities(numberOfActivities);

          return this._createActivitiesForStudent(
            activitiesDTO,
            student._id,
            ranking._id,
          );
        });

        const results = await Promise.all(allActivitiesPromises);

        const allCreatedActivities = results.flat();

        this.logger.log(
          `Successfully seeded ${allCreatedActivities.length} Activities across ${students.length} students.`,
        );

        return allCreatedActivities;
      }

      return [];
    } catch (error) {
      this.logger.error('Failed to seed Activities.', error);
      return [];
    }
  }

  async cleanup(activities: Activity[]): Promise<void> {
    if (!activities.length) return;
    this.logger.log('Cleaning up seeded Activities...');
    try {
      const deletePromises = activities.map((activity) =>
        this.activitiesService.deleteById(activity._id),
      );

      await Promise.all(deletePromises);
      this.logger.log('Finished cleaning up Activities.');
    } catch (error) {
      this.logger.error('Failed to cleanup Activities.', error);
    }
  }

  private _generateFakeActivities(count: number): CreateActivityDTO[] {
    return Array.from({ length: count }).map(() => {
      const type = faker.helpers.enumValue(ActivityType);

      let description = '';
      switch (type) {
        case ActivityType.RUNNING:
          description = faker.helpers.arrayElement([
            'Corrida no parque',
            'Trote leve',
            'Treino de tiros',
            'Maratona 5km',
          ]);
          break;
        case ActivityType.SPORT:
          description = faker.helpers.arrayElement([
            'Futebol com amigos',
            'Vôlei de praia',
            'Basquete',
            'Natação',
          ]);
          break;
        default:
          description = faker.helpers.arrayElement([
            'Treino de força',
            'Crossfit',
            'Yoga',
            'Pilates',
            'Funcional',
          ]);
      }

      return {
        description: description,
        timeSpentInSeconds: faker.number.int({ min: 800, max: 7200 }),
        type: type,
        intesity: faker.helpers.enumValue(ActivityItensity),
        ocurredAt: faker.date.recent({ days: 14 }),
      };
    });
  }

  private async _createActivitiesForStudent(
    activitiesDTO: CreateActivityDTO[],
    studentId: any,
    rankingId: any,
  ): Promise<Activity[]> {
    const createdActivities: Activity[] = [];

    for (const dto of activitiesDTO) {
      try {
        const activity = await this.activitiesService.createStudentActivity(
          studentId,
          rankingId,
          dto,
        );
        createdActivities.push(activity);
      } catch (e) {
        this.logger.warn(
          `Failed to create activity for student ${studentId}: ${e.message}`,
        );
      }
    }

    return createdActivities;
  }
}
