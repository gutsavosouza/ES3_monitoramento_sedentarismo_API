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
      const createdStudents = await this._findOrCreateStudents();
      const createdTeachers = await this._findOrCreateTeachers();

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

  private async _findOrCreateStudents(): Promise<User[]> {
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

    const studentPromises = studentsData.map(async (studentDTO) => {
      const existingUser = await this.usersService.findByEmail(studentDTO.email);
      if (existingUser) {
        this.logger.log(`Student with email ${studentDTO.email} already exists. Skipping.`);
        return existingUser;
      }
      return this.usersService.createStudent(studentDTO);
    });

    return Promise.all(studentPromises);
  }

  private async _findOrCreateTeachers(): Promise<User[]> {
    const teachersData: CreateUserDTO[] = [
      {
        name: 'Professor Girafalles',
        email: 'profgira@email.com',
        password: 'senhaforte123',
      },
    ];

    const teacherPromises = teachersData.map(async (teacherDTO) => {
      const existingUser = await this.usersService.findByEmail(teacherDTO.email);
      if (existingUser) {
        this.logger.log(`Teacher with email ${teacherDTO.email} already exists. Skipping.`);
        return existingUser;
      }
      return this.usersService.createTeacher(teacherDTO);
    });

    return Promise.all(teacherPromises);
  }
}