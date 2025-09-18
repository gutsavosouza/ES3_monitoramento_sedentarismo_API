import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/user-role.enum';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Number, enum: UserRole })
  role: UserRole;

  @Prop({ required: false, default: null })
  school: string;

  @Prop({ required: false, default: null })
  birthdate: Date;

  @Prop({ required: false, default: null })
  city: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
