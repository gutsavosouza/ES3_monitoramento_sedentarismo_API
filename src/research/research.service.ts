import { Injectable } from '@nestjs/common';
import { ResearchRepository } from './research.repository';
import { GetResearchDataDto, ResearchType } from './dtos/get-research-data.dto';

@Injectable()
export class ResearchService {
  constructor(private readonly researchRepository: ResearchRepository) {}

  async findAll() {
    return this.researchRepository.findAll();
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
