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

  async getBmiByAgeAndGender(): Promise<any[]> {
    return this.researchModel
      .aggregate([
        {
          $match: {
            idade: { $gte: 14, $lte: 19 },
          },
        },
        {
          $addFields: {
            ageGroup: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gte: ['$idade', 14] },
                        { $lte: ['$idade', 15] },
                      ],
                    },
                    then: '14-15',
                  },
                  {
                    case: {
                      $and: [
                        { $gte: ['$idade', 16] },
                        { $lte: ['$idade', 17] },
                      ],
                    },
                    then: '16-17',
                  },
                  {
                    case: {
                      $and: [
                        { $gte: ['$idade', 18] },
                        { $lte: ['$idade', 19] },
                      ],
                    },
                    then: '18-19',
                  },
                ],
                default: 'other',
              },
            },
          },
        },
        {
          $group: {
            _id: {
              ageGroup: '$ageGroup',
              sexo: {
                $cond: {
                  if: { $eq: ['$sexo', 1] },
                  then: 'Masculino',
                  else: 'Feminino',
                },
              },
            },
            averageBmi: { $avg: '$bmi' },
          },
        },
        {
          $group: {
            _id: '$_id.ageGroup',
            results: {
              $push: {
                gender: '$_id.sexo',
                averageBmi: '$averageBmi',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            ageGroup: '$_id',
            results: 1,
          },
        },
        {
          $sort: {
            ageGroup: 1,
          },
        },
      ])
      .exec();
  }
}
