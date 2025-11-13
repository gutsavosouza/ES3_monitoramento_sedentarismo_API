import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Ranking, RankingDocument } from './schemas/rankings.schema';
import { CreateRankingDTO } from './dtos/create-ranking.dto';

@Injectable()
export class RankingsRepository {
  constructor(
    @InjectModel(Ranking.name) private rankingModel: Model<RankingDocument>,
  ) {}

  async create(
    createData: CreateRankingDTO,
    teacherId: mongoose.Types.ObjectId,
    joinCode: string,
  ): Promise<Ranking> {
    const createdRanking = await this.rankingModel.create({
      ...createData,
      creatorId: teacherId,
      joinCode,
      participants: [],
    });

    return createdRanking;
  }

  async findById(id: any): Promise<Ranking | null> {
    return this.rankingModel.findById(id).exec();
  }

  async findByCode(joinCode: string): Promise<Ranking | null> {
    return this.rankingModel.findOne({ joinCode }).exec();
  }

  async findAllByCreatorId(
    creatorId: mongoose.Types.ObjectId,
  ): Promise<Ranking[]> {
    return this.rankingModel
      .find({ creatorId: new Types.ObjectId(creatorId) })
      .exec();
  }

  async addParticipant(rankingId: any, studentId): Promise<Ranking | null> {
    return this.rankingModel.findByIdAndUpdate(
      rankingId,
      { $addToSet: { participants: studentId } },
      { new: true },
    );
  }

  async deleteById(rankingId: any): Promise<void> {
    await this.rankingModel.findByIdAndDelete(rankingId).exec();
  }

  async findAllByParticipantId(
    participantId: mongoose.Types.ObjectId,
  ): Promise<Ranking[]> {
    return this.rankingModel
      .find({ participants: new Types.ObjectId(participantId) })
      .exec();
  }
}
