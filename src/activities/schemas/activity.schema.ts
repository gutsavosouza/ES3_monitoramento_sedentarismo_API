import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { ActivityType } from '../enums/activity-type.enum';
import { ActivityItensity } from '../enums/activity-intensity.enum';
import { Ranking } from 'src/rankings/schemas/rankings.schema';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Ranking', required: false })
  rankingId?: Ranking;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  createdBy?: User;

  // if the student created the actiity this will be set to true
  // if the teacher created the activity, they will need to confirm it
  @Prop({ required: true, default: true })
  isConfirmed: boolean;

  @Prop({ required: true })
  ocurredAt: Date;

  @Prop({ required: true, enum: ActivityType, type: String })
  type: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  timeSpentInSeconds: number;

  @Prop({ required: true, enum: ActivityItensity, type: Number })
  intesity: ActivityItensity;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
