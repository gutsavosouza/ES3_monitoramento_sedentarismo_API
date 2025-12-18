import { Injectable } from '@nestjs/common';
import { ResearchRepository } from './research.repository';
import { GetResearchDataDto, ResearchType } from './dtos/get-research-data.dto';
import { GetResearchDataQueryDto } from './dtos/get-research-data-query.dto';

@Injectable()
export class ResearchService {
  constructor(private readonly researchRepository: ResearchRepository) {}

  async findAll(query: GetResearchDataQueryDto) {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.researchRepository.findAll({
      ...query,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getResearchData(filters: GetResearchDataDto) {
    switch (filters.researchType) {
      case ResearchType.BMI:
        return this.researchRepository.getBmiByAgeAndGender(filters);
      case ResearchType.SCREEN_TIME:
        return this.researchRepository.getAverageScreenTimeByGender(filters);
      case ResearchType.PHYSICAL_ACTIVITY:
        return this.researchRepository.getAveragePhysicalActivityByGender(
          filters,
        );
      default:
        return [];
    }
  }
}
