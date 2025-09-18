import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentData,
  StudentDataDocument,
} from './schemas/student-data.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class StudentDataRepository {
  constructor(
    @InjectModel(StudentData.name)
    private studentDataModel: Model<StudentDataDocument>,
  ) {}

  async create(userId: any): Promise<StudentData> {
    const createdStudentData = await this.studentDataModel.create({ userId });

    return createdStudentData;
  }
}
