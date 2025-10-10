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

    if (students.length < 2) {
      this.logger.warn(
        'Skipping activities seed: At least 2 students are required for this seed script.',
      );
      return [];
    }

    try {
      const today = new Date();
      const activitiesData: CreateActivityDTO[] = [
        {
          description: 'Corrida leve de 30 minutos.',
          timeSpentInSeconds: 1800,
          type: ActivityType.RUNNING,
          intesity: ActivityItensity.LOW,
          ocurredAt: new Date(new Date().setDate(today.getDate() - 5)),
        },
        {
          description: 'Treino de peito e tríceps.',
          timeSpentInSeconds: 3600,
          type: ActivityType.GENERAL,
          intesity: ActivityItensity.MODERATE,
          ocurredAt: new Date(new Date().setDate(today.getDate() - 3)),
        },
        {
          description: 'Futebol intenso de 90 minutos.',
          timeSpentInSeconds: 5400,
          type: ActivityType.SPORT,
          intesity: ActivityItensity.HIGH,
          ocurredAt: new Date(new Date().setDate(today.getDate() - 1)),
        },
      ];

      const ranking = rankings[0];

      const student1 = students[0];
      const student2 = students[1];

      const activitiesForStudent1 = activitiesData.slice(0, 2);
      const activitiesForStudent2 = activitiesData.slice(2);

      const [createdActivities1, createdActivities2] = await Promise.all([
        this._createActivitiesForStudent(
          activitiesForStudent1,
          student1._id,
          ranking._id,
        ),
        this._createActivitiesForStudent(
          activitiesForStudent2,
          student2._id,
          ranking._id,
        ),
      ]);

      this.logger.log('Successfully seeded Activities.');

      return [...createdActivities1, ...createdActivities2];
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

  private _createActivitiesForStudent(
    activitiesDTO: CreateActivityDTO[],
    studentId: any,
    rankingId: any,
  ): Promise<Activity[]> {
    const creationPromises = activitiesDTO.map((dto) =>
      this.activitiesService.createStudentActivity(studentId, rankingId, dto),
    );

    return Promise.all(creationPromises);
  }
}
