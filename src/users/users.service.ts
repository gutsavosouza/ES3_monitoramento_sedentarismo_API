import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/user-role.enum';
import { StudentDataRepository } from './student-data.repository';
import { UpdateUserPersonalInfoDTO } from './dtos/update-user-personal-info.dto';
import { StudentData } from './schemas/student-data.schema';
import { UpdateStudentInfoDTO } from './dtos/update-student-info.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly studentDataRepository: StudentDataRepository,
  ) {}

  private async _createNewUser(
    createData: CreateUserDTO,
    role: UserRole,
  ): Promise<User> {
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
      role,
    );
  }

  async createStudent(createData: CreateUserDTO): Promise<User> {
    const student = await this._createNewUser(createData, UserRole.STUDENT);

    await this.studentDataRepository.create(student._id);

    return student;
  }

  async updateUserPersonalData(
    email: string,
    updateData: UpdateUserPersonalInfoDTO,
  ): Promise<User | null> {
    const updatedUser = await this.userRepository.updatePersonalInfo(
      email,
      updateData,
    );

    if (!updatedUser) {
      throw new NotFoundException('O usuário não existe.');
    }

    return updatedUser;
  }

  async getStudentInfo(email: string): Promise<StudentData | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Usuário não é um estudante.');
    }

    return this.studentDataRepository.findById(user._id);
  }

  async updateStudentData(
    email: string,
    updateData: UpdateStudentInfoDTO,
  ): Promise<StudentData | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Usuário não é um estudante.');
    }

    return this.studentDataRepository.updateStudentData(user._id, updateData);
  }
}
