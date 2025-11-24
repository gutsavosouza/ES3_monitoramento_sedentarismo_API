import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDTO } from './dtos/create-activity.dto';
import { ActivityType } from './enums/activity-type.enum';
import { ActivityItensity } from './enums/activity-intensity.enum';
@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createData: CreateActivityDTO,
    rankingId: Types.ObjectId | null,
    isConfirmed: boolean,
  ): Promise<Activity> {
    const createdActivity = await this.activityModel.create({
      ...createData,
      userId: new Types.ObjectId(userId),
      rankingId: rankingId ? new Types.ObjectId(rankingId) : null,
      isConfirmed,
    });

    return createdActivity;
  }

  async createMany(
    activitiesData: {
      ocurredAt: Date;
      type: ActivityType;
      description: string;
      timeSpentInSeconds: number;
      intesity: ActivityItensity;
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
    userId: Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Activity[]> {
    const filter: FilterQuery<ActivityDocument> = {
      userId: new Types.ObjectId(userId),
    };

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
    userId: Types.ObjectId,
    rankingId: Types.ObjectId,
  ): Promise<Activity[]> {
    const filter: FilterQuery<ActivityDocument> = {
      userId: new Types.ObjectId(userId),
      rankingId: new Types.ObjectId(rankingId),
    };

    // console.log('filter', filter);

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
