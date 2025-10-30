import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchRepository } from './research.repository';
import {
  ResearchData,
  ResearchDataSchema,
} from './schemas/research-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchData.name, schema: ResearchDataSchema },
    ]),
  ],
  controllers: [ResearchController],
  providers: [ResearchService, ResearchRepository],
  exports: [ResearchRepository],
})
export class ResearchModule {}

