import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';

describe('RankingService', () => {
  let service: RankingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankingsService],
    }).compile();

    service = module.get<RankingsService>(RankingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
