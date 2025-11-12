import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResearchDataDto } from './dtos/research-data.dto';
import {
  ResearchData,
  ResearchDataDocument,
} from './schemas/research-data.schema';
import { GetResearchDataDto } from './dtos/get-research-data.dto';

interface Match {
  sexo?: number;
  idade?: number;
  gre?: number;
  serie?: number;
  year?: number;
}

@Injectable()
export class ResearchRepository {
  constructor(
    @InjectModel(ResearchData.name)
    private readonly researchModel: Model<ResearchDataDocument>,
  ) {}

  private buildMatchStage(filters: GetResearchDataDto): { $match: Match } {
    const match: Match = {};
    if (filters.sexo) match.sexo = filters.sexo;
    if (filters.idade) match.idade = filters.idade;
    if (filters.gre) match.gre = filters.gre;
    if (filters.serie) match.serie = filters.serie;
    if (filters.year) match.year = filters.year;
    return { $match: match };
  }

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

  async getBmiByAgeAndGender(filters: GetResearchDataDto): Promise<any[]> {
    const matchStage = this.buildMatchStage(filters);

    return this.researchModel
      .aggregate<any>([
        matchStage,
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

  async getAverageScreenTimeByGender(
    filters: GetResearchDataDto,
  ): Promise<any[]> {
    const matchStage = this.buildMatchStage(filters);
    return this.researchModel
      .aggregate<any>([
        matchStage,
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ['$sexo', 1] },
                then: 'Masculino',
                else: 'Feminino',
              },
            },
            averageTvTime: { $avg: '$dailyTvTime' },
            averagePcTime: { $avg: '$dailyPcTime' },
            averageVgTime: { $avg: '$dailyVgTime' },
            averageSptTime: { $avg: '$dailySptTime' },
          },
        },
        {
          $project: {
            _id: 0,
            gender: '$_id',
            averageTvTime: 1,
            averagePcTime: 1,
            averageVgTime: 1,
            averageSptTime: 1,
          },
        },
      ])
      .exec();
  }

  async getAveragePhysicalActivityByGender(
    filters: GetResearchDataDto,
  ): Promise<any[]> {
    const matchStage = this.buildMatchStage(filters);
    return this.researchModel
      .aggregate<any>([
        matchStage,
        {
          $match: {
            diasAFMV: { $ne: null, $exists: true },
            afmvH: { $ne: null, $exists: true },
            afmvMin: { $ne: null, $exists: true },
          },
        },
        {
          $project: {
            sexo: 1,
            dailyActivityMinutes: {
              $divide: [
                {
                  $multiply: [
                    { $add: [{ $multiply: ['$afmvH', 60] }, '$afmvMin'] },
                    '$diasAFMV',
                  ],
                },
                7,
              ],
            },
          },
        },
        {
          //filtro de outliers !!
          $match: {
            dailyActivityMinutes: { $lte: 1440 },
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ['$sexo', 1] },
                then: 'Masculino',
                else: 'Feminino',
              },
            },
            averageDailyActivity: { $avg: '$dailyActivityMinutes' },
          },
        },
        {
          $project: {
            _id: 0,
            gender: '$_id',
            averageDailyActivity: 1,
          },
        },
        {
          $sort: {
            gender: 1,
          },
        },
      ])
      .exec();
  }
}
