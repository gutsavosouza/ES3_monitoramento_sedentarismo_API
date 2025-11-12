import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResearchType } from './dtos/get-research-data.dto';
import { GetResearchDataQueryDto } from './dtos/get-research-data-query.dto';
import { ResearchService } from './research.service';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all research records',
    description: 'Retrieves all available research records without any filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'All research records returned successfully.',
  })
  findAll() {
    return this.researchService.findAll();
  }

  @Get('query/:researchType')
  @ApiOperation({
    summary: 'Advanced search for research data',
    description:
      'Performs an aggregate search on research data based on a research type and optional filters.',
  })
  @ApiParam({
    name: 'researchType',
    required: true,
    description: 'The type of research to be performed.',
    enum: ResearchType,
  })
  @ApiQuery({
    name: 'sexo',
    required: false,
    type: Number,
    description: 'Filter by gender (1 for Male, 2 for Female).',
  })
  @ApiQuery({
    name: 'idade',
    required: false,
    type: Number,
    description: 'Filter by age.',
  })
  @ApiQuery({
    name: 'gre',
    required: false,
    type: Number,
    description: 'Filter by GRE (Regional Education Management).',
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  })
  @ApiQuery({
    name: 'serie',
    required: false,
    type: Number,
    description: 'Filter by school grade.',
    enum: [1, 2, 3],
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filter by research year.',
    enum: [2016, 2022],
  })
  @ApiResponse({
    status: 200,
    description: 'Research data returned successfully.',
  })
  async getResearchData(
    @Param('researchType') researchType: ResearchType,
    @Query() filters: GetResearchDataQueryDto,
  ) {
    return this.researchService.getResearchData({ ...filters, researchType });
  }
}
