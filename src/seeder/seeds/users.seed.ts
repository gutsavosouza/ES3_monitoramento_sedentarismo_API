import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UsersSeed {
  private readonly logger = new Logger(UsersSeed.name);

  constructor(private readonly usersService: UsersService) {}

  async seed(): Promise<User[]> {
    this.logger.log('Starting seeding process for: Users....');

    try {
      const [createdStudents, createdTeachers] = await Promise.all([
        this._createStudents(),
        this._createTeachers(),
      ]);

      this.logger.log('Successfully seeded users.');

      return [...createdStudents, ...createdTeachers];
    } catch (error) {
      this.logger.error('Failed to seed Users.', error);

      return [];
    }
  }

  async cleanup(users: User[]): Promise<void> {
    if (!users.length) return;
    this.logger.log('Cleaning up seeded Users...');
    try {
      const deletePromises = users.map((user) =>
        this.usersService.deleteById(user._id),
      );

      await Promise.all(deletePromises);
      this.logger.log('Finished cleaning up Users.');
    } catch (error) {
      this.logger.error('Failed to cleanup Users.', error);
    }
  }

  private _createStudents(): Promise<User[]> {
    const studentsData: CreateUserDTO[] = [
      {
        name: 'Luis Fabiano',
        email: 'luisfab@spfc.com.br',
        password: 'senhaforte123',
      },
      {
        name: 'Dagoberto',
        email: 'dagol@spfc.com.br',
        password: 'senhaforte123',
      },
    ];

    const studentCreationsPromises = studentsData.map(async (studentDTO) => {
      return await this.usersService.createStudent(studentDTO);
    });

    return Promise.all(studentCreationsPromises);
  }

  private _createTeachers(): Promise<User[]> {
    const teachersData: CreateUserDTO[] = [
      {
        name: 'Professor Girafalles',
        email: 'profgira@email.com',
        password: 'senhaforte123',
      },
    ];

    const teacherCreationsPromises = teachersData.map(async (teacherData) => {
      return await this.usersService.createTeacher(teacherData);
    });

    return Promise.all(teacherCreationsPromises);
  }
}
