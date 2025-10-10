import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentData,
  StudentDataDocument,
} from './schemas/student-data.schema';
import { Model } from 'mongoose';
import { UpdateStudentInfoDTO } from './dtos/update-student-info.dto';

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

  async findById(userId: any): Promise<StudentData | null> {
    return this.studentDataModel.findOne({ userId: userId }).exec();
  }

  async updateStudentData(
    userId: any,
    updateData: UpdateStudentInfoDTO,
  ): Promise<StudentData | null> {
    return this.studentDataModel
      .findOneAndUpdate({ userId: userId }, { $set: updateData }, { new: true })
      .exec();
  }

  async deleteByUserId(userId: any): Promise<void> {
    await this.studentDataModel.findOneAndDelete({ userId }).exec();
  }
}
