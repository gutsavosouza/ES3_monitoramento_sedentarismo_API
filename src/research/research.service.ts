import { Injectable } from '@nestjs/common';
import { ResearchRepository } from './research.repository';

@Injectable()
export class ResearchService {
  constructor(private readonly researchRepository: ResearchRepository) {}

  async findAll() {
    return this.researchRepository.findAll();
  }

  async getBmiByAgeAndGender() {
    return this.researchRepository.getBmiByAgeAndGender();
  }

  async getAverageScreenTimeByGender() {
    return this.researchRepository.getAverageScreenTimeByGender();
  }
}
