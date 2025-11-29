import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivitiesRepository } from './activities.repository';
import { CreateActivityDTO } from './dtos/create-activity.dto';
import { Activity } from './schemas/activity.schema';
import { ActivityItensity } from './enums/activity-intensity.enum';
import { UsersRepository } from 'src/users/users.repository';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RankingsRepository } from 'src/rankings/rankings.repository';
import { CreateGroupActivityDTO } from './dtos/create-group-activity.dto';
import { Types } from 'mongoose';

export type ActivityWithScore = Activity & { points: number };

const ActivityPoints = {
  LOW: 10,
  NORMAL: 20,
  HIGH: 35,
};

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly rankingRepository: RankingsRepository,
  ) {}

  async createStudentActivity(
    userId: Types.ObjectId,
    rankingId: Types.ObjectId | null,
    createData: CreateActivityDTO,
  ): Promise<Activity> {
    const user = await this.usersRepository.findById(userId);
    const ranking = await this.rankingRepository.findById(rankingId);

    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Usuário não é um estudante.');
    }

    if (ranking) {
      if (
        !ranking.participants.some((participantId) =>
          participantId.equals(user._id as any),
        )
      ) {
        throw new ForbiddenException(
          'O usuário não está no ranking informado.',
        );
      }
    }

    return this.activitiesRepository.create(
      userId,
      createData,
      rankingId,
      true,
      userId,
    );
  }

  async createGroupActivity(
    teacherId: Types.ObjectId,
    rankingId: Types.ObjectId,
    createData: CreateGroupActivityDTO,
  ): Promise<Activity[]> {
    const { participantIds, ...activityDetails } = createData;
    const teacher = await this.usersRepository.findById(teacherId);
    const ranking = await this.rankingRepository.findById(rankingId);

    if (!teacher) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (teacher?.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Usuário não é um professor.');
    }

    if (!ranking) {
      throw new NotFoundException('O ranking não existe.');
    }

    const activities = participantIds.map((studentId) => ({
      ...activityDetails,
      userId: new Types.ObjectId(studentId),
      rankingId: new Types.ObjectId(rankingId),
      createdBy: new Types.ObjectId(teacherId),
      isConfirmed: false,
    }));

    // console.log('activities', activities);

    return this.activitiesRepository.createMany(activities);
  }

  async confirmParticipation(
    activityId: string,
    teacherId: string,
  ): Promise<Activity | null> {
    const activity = await this.activitiesRepository.findById(activityId);
    const teacher = await this.usersRepository.findById(teacherId);

    if (!teacher) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (teacher?.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Usuário não é um professor.');
    }

    if (!activity) {
      throw new NotFoundException('Ativida não encontrada.');
    }
    if (!activity.createdBy.equals(teacher._id as any)) {
      throw new ForbiddenException(
        'Apenas o criador da atividade pode confirmá-la.',
      );
    }

    return this.activitiesRepository.update(activityId, { isConfirmed: true });
  }

  async getActivitiesForUser(
    userId: any,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ActivityWithScore[]> {
    const activities = await this.activitiesRepository.findByUserId(
      userId,
      startDate,
      endDate,
    );

    return activities.map((activity) => {
      const score = this._calculateActivityScore(activity);
      return {
        ...activity.toObject(),
        points: score,
      };
    });
  }

  async getUserTotalPointsForRanking(
    userId: any,
    rankingId: any,
  ): Promise<number> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    const ranking = await this.rankingRepository.findById(rankingId);
    if (!ranking) {
      throw new NotFoundException('O ranking não existe.');
    }

    const activities = await this.activitiesRepository.findByUserIdAndRanking(
      user._id as Types.ObjectId,
      ranking._id as Types.ObjectId,
    );

    const confirmedActivities = activities.filter((act) => act.isConfirmed);

    if (!confirmedActivities.length) {
      return 0;
    }

    const totalPoints = confirmedActivities.reduce((sum, currentActivity) => {
      return sum + this._calculateActivityScore(currentActivity);
    }, 0);

    return totalPoints;
  }

  async getUserTotalPoints(
    userId: any,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const activities = await this.activitiesRepository.findByUserId(
      userId,
      startDate,
      endDate,
    );

    if (!activities.length) {
      return 0;
    }

    const totalPoints = activities.reduce((sum, currentActivity) => {
      return sum + this._calculateActivityScore(currentActivity);
    }, 0);

    return totalPoints;
  }

  async deleteById(activityId: any): Promise<void> {
    const activity = await this.activitiesRepository.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Atividade não encontrada.');
    }
    await this.activitiesRepository.deleteById(activityId);
  }

  async getAllActivitiesByCreator(
    creatorId: Types.ObjectId,
  ): Promise<Activity[]> {
    const creator = await this.usersRepository.findById(creatorId);

    if (!creator) {
      throw new NotFoundException('O usuário não existe.');
    }

    return this.activitiesRepository.getAllActivitiesByCreator(creatorId);
  }

  async getAllActivitiesByRanking(
    rankingId: Types.ObjectId,
  ): Promise<Activity[]> {
    const ranking = await this.rankingRepository.findById(rankingId);

    if (!ranking) {
      throw new NotFoundException('O ranking não existe.');
    }

    return this.activitiesRepository.getAllActivitiesByRanking(rankingId);
  }

  async getAllActivitiesWithNoRanking(
    userId: Types.ObjectId,
  ): Promise<Activity[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    return await this.activitiesRepository.getAllActivitesWithNoRanking(userId);
  }

  private _calculateActivityScore(activity: Activity): number {
    const sixtyMinutesInSeconds = 3600;

    const isLongDuration = activity.timeSpentInSeconds >= sixtyMinutesInSeconds;
    const isHighIntensity =
      activity.intesity === ActivityItensity.MODERATE ||
      activity.intesity === ActivityItensity.HIGH;

    if (isLongDuration && isHighIntensity) {
      return ActivityPoints.HIGH;
    }

    if (activity.intesity === ActivityItensity.HIGH) {
      return ActivityPoints.NORMAL;
    }

    if (activity.intesity === ActivityItensity.MODERATE) {
      return ActivityPoints.NORMAL;
    }

    return ActivityPoints.LOW;
  }
}
