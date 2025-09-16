import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createStudent(createData: CreateUserDTO): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        createData.email,
      );

      if (existingUser) {
        throw new ConflictException('Usuário com esse email já existe.');
      }

      const hashedPassword = await bcrypt.hash(createData.password, 10);

      return this.userRepository.createUser(
        {
          ...createData,
          password: hashedPassword,
        },
        UserRole.STUDENT,
      );
    } catch (error) {
      return error;
    }
  }
}
