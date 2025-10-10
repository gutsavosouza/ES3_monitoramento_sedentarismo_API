import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type RankingDocument = Ranking & Document;

@Schema({ timestamps: true })
export class Ranking extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  creatorId: User;

  @Prop({ required: true, unique: true })
  joinCode: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  participants: User[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
