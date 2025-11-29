import { faker } from '@faker-js/faker/locale/pt_BR';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { UsersRepository } from 'src/users/users.repository'; // 1. IMPORTAR O REPOSITÓRIO
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UsersSeed {
  private readonly logger = new Logger(UsersSeed.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository, // 2. INJETAR O REPOSITÓRIO
  ) {}

  async seed(): Promise<User[]> {
    this.logger.log('A iniciar o processo de seeding para: Utilizadores....');

    try {
      const [createdStudents, createdTeachers] = await Promise.all([
        this._createStudents(30),
        this._createTeachers(30),
      ]);

      this.logger.log('Seeding de Utilizadores concluído com sucesso.');

      return [...createdStudents, ...createdTeachers];
    } catch (error) {
      this.logger.error('Falha ao semear Utilizadores.', error);

      return [];
    }
  }

  async cleanup(users: User[]): Promise<void> {
    if (!users.length) return;
    this.logger.log('A limpar os utilizadores semeados...');
    try {
      const deletePromises = users.map((user) =>
        this.usersService.deleteById(user._id),
      );

      await Promise.all(deletePromises);
      this.logger.log('Limpeza dos Utilizadores concluída.');
    } catch (error) {
      this.logger.error('Falha ao limpar os Utilizadores.', error);
    }
  }

  private async _createStudents(count: number): Promise<User[]> {
    const studentTestUser: CreateUserDTO = {
      name: 'Aluno Teste',
      email: 'aluno@teste.com',
      password: 'senhaforte123',
    };

    const fakeStudentsData: CreateUserDTO[] = Array.from({ length: count }).map(
      () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'senhaforte123',
      }),
    );

    const studentsData = [studentTestUser, ...fakeStudentsData];

    const studentCreationsPromises = studentsData.map(async (studentDTO) => {
      // 3. VERIFICAR SE O UTILIZADOR JÁ EXISTE
      const existingUser = await this.usersRepository.findByEmail(
        studentDTO.email,
      );
      if (existingUser) {
        return existingUser; // Se existir, retorna o utilizador existente
      }
      // Se não existir, cria um novo
      return this.usersService.createStudent(studentDTO);
    });

    return Promise.all(studentCreationsPromises);
  }

  private async _createTeachers(count: number): Promise<User[]> {
    const teachersData: CreateUserDTO[] = [
      {
        name: 'Professor Um',
        email: 'prof1@teste.com',
        password: 'senhaforte123',
      },
      {
        name: 'Professor Dois',
        email: 'prof2@teste.com',
        password: 'senhaforte123',
      },
    ];

    const teacherCreationsPromises = teachersData.map(async (teacherData) => {
      // 3. VERIFICAR SE O UTILIZADOR JÁ EXISTE
      const existingUser = await this.usersRepository.findByEmail(
        teacherData.email,
      );
      if (existingUser) {
        return existingUser; // Se existir, retorna o utilizador existente
      }
      // Se não existir, cria um novo
      return this.usersService.createTeacher(teacherData);
    });

    return Promise.all(teacherCreationsPromises);
  }
}
