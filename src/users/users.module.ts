import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { StudentDataRepository } from './student-data.repository';
import { StudentData, StudentDataSchema } from './schemas/student-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: StudentData.name, schema: StudentDataSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, StudentDataRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
