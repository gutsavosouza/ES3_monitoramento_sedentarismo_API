import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Document } from 'mongoose';

export type StudentDataDocument = StudentData & Document;

@Schema({ timestamps: true })
export class StudentData extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  // in grams
  @Prop({ required: false, default: null })
  weightInGrams: number;

  // in centimeters
  @Prop({ required: false, default: null })
  heightInCm: number;

  @Prop({ required: false, default: null })
  gender: string;
}

export const StudentDataSchema = SchemaFactory.createForClass(StudentData);
