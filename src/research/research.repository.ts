import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResearchDataDto } from './dtos/research-data.dto';
import {
  ResearchData,
  ResearchDataDocument,
} from './schemas/research-data.schema';

@Injectable()
export class ResearchRepository {
  constructor(
    @InjectModel(ResearchData.name)
    private readonly researchModel: Model<ResearchDataDocument>,
  ) {}

  /**
   * Encontra todos os registos na coleção.
   */
  async findAll(): Promise<ResearchData[]> {
    return this.researchModel.find().exec();
  }

  async upsertMany(data: CreateResearchDataDto[]): Promise<void> {
    if (data.length === 0) {
      return;
    }

    const operations = data.map((dto) => ({
      updateOne: {
        filter: { studentId: dto.studentId, year: dto.year },
        update: { $set: dto },
        upsert: true,
      },
    }));

    await this.researchModel.bulkWrite(operations);
  }


  async cleanup(): Promise<void> {
    await this.researchModel.deleteMany({});
  }
}

