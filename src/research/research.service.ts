import { Injectable } from '@nestjs/common';
import { ResearchRepository } from './research.repository';

@Injectable()
export class ResearchService {
  constructor(private readonly researchRepository: ResearchRepository) {}

  async findAll() {
    return this.researchRepository.findAll();
  }
}

