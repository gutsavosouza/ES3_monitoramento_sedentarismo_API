import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDTO } from './dtos/create-activity.dto';
@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(
    userId: any,
    createData: CreateActivityDTO,
    rankingId: any,
    isConfirmed: boolean,
  ): Promise<Activity> {
    const createdActivity = await this.activityModel.create({
      ...createData,
      userId,
      rankingId,
      isConfirmed,
    });

    return createdActivity;
  }

  async createMany(
    activitiesData: {
      activityDetails: CreateActivityDTO;
      userId: any;
      rankingId: any;
      createdBy: any;
      isConfirmed: boolean;
    }[],
  ): Promise<Activity[]> {
    return this.activityModel.insertMany(activitiesData);
  }

  async findById(activityId: string): Promise<Activity | null> {
    return this.activityModel.findById(activityId);
  }

  async findByUserId(
    userId: any,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Activity[]> {
    const filter: FilterQuery<ActivityDocument> = { userId };

    if (startDate || endDate) {
      filter.ocurredAt = {};
      if (startDate) {
        filter.ocurredAt.$gte = startDate;
      }
      if (endDate) {
        filter.ocurredAt.$lte = endDate;
      }
    }

    return this.activityModel.find(filter).sort({ ocurredAt: -1 }).exec();
  }

  async findByUserIdAndRanking(
    userId: any,
    rankingId: any,
  ): Promise<Activity[]> {
    const filter: FilterQuery<ActivityDocument> = { userId, rankingId };

    return await this.activityModel.find(filter).sort({ ocurredAt: -1 }).exec();
  }

  async update(
    activityId: any,
    updateData: Partial<Activity>,
  ): Promise<Activity | null> {
    return this.activityModel.findByIdAndUpdate(activityId, updateData, {
      new: true,
    });
  }

  async deleteById(activityId: any): Promise<void> {
    await this.activityModel.findByIdAndDelete(activityId).exec();
  }
}
