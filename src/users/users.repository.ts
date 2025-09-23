import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateResult } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserRole } from './enums/user-role.enum';
import { UpdateUserPersonalInfoDTO } from './dtos/update-user-personal-info.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createData: CreateUserDTO, role: UserRole): Promise<User> {
    const createdUser = await this.userModel.create({
      ...createData,
      role,
    });

    return createdUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: any): Promise<User | null> {
    return this.userModel.findById({ id }).exec();
  }

  async updatePersonalInfo(
    email: string,
    updateData: UpdateUserPersonalInfoDTO,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ email }, { $set: updateData }, { new: true })
      .exec();
  }
}
