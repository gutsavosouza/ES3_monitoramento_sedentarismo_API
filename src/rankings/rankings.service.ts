import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RankingsRepository } from './rankings.repository';
import { CreateRankingDTO } from './dtos/create-ranking.dto';
import { ActivitiesService } from 'src/activities/activities.service';
import { UsersRepository } from 'src/users/users.repository';
import generate from 'random-string';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Ranking } from './schemas/rankings.schema';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class RankingsService {
  constructor(
    private readonly rankingRepository: RankingsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async create(createData: CreateRankingDTO, teacherId: any) {
    const joinCode = generate({
      length: 8,
      charset: 'alphanumeric',
      capitalization: 'uppercase',
    });

    const teacher = await this.usersRepository.findById(teacherId);

    if (!teacher) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (teacher?.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Usuário não é um professor.');
    }

    return this.rankingRepository.create(
      createData,
      teacher._id as mongoose.Types.ObjectId,
      joinCode,
    );
  }

  async join(code: string, studentId: any) {
    const ranking = await this.rankingRepository.findByCode(code);
    const student = await this.usersRepository.findById(studentId);

    if (!ranking) {
      throw new NotFoundException('Ranking com este código não encontrado.');
    }

    if (!student) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (student.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Usuário não é um estudante.');
    }

    return this.rankingRepository.addParticipant(ranking._id, studentId);
  }

  async getLeaderboard(rankingId: any) {
    const ranking = await this.rankingRepository.findById(rankingId);
    if (!ranking) {
      throw new NotFoundException('Ranking não encontrado.');
    }

    const leaderboard = await Promise.all(
      ranking.participants.map(async (participantId) => {
        const user = await this.usersRepository.findById(participantId._id);

        if (!user) {
          // throw new NotFoundException('O usuário não existe.');
          return null;
        }

        const totalPoints =
          await this.activitiesService.getUserTotalPointsForRanking(
            participantId,
            ranking._id,
          );

        return {
          userId: user._id,
          userName: user.name,
          points: totalPoints,
        };
      }),
    );

    return leaderboard
      .filter((participant) => {
        return participant !== null;
      })
      .sort((a, b) => b.points - a.points);
  }

  async getAllRankings(teacherId: any): Promise<Ranking[]> {
    const teacher = await this.usersRepository.findById(teacherId);

    if (!teacher) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (teacher?.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Usuário não é um professor.');
    }

    return this.rankingRepository.findAllByCreatorId(teacherId);
  }

  async deleteById(rankingId: any): Promise<void> {
    const ranking = await this.rankingRepository.findById(rankingId);
    if (!ranking) {
      throw new NotFoundException('Ranking não encontrado.');
    }
    await this.rankingRepository.deleteById(rankingId);
  }

  async getAllRankingsByParticipant(studentId: any): Promise<Ranking[]> {
    const user = await this.usersRepository.findById(studentId);

    if (!user) {
      throw new NotFoundException('O usuário não existe.');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Usuário não é um estudante.');
    }

    return this.rankingRepository.findAllByParticipantId(studentId);
  }
}
