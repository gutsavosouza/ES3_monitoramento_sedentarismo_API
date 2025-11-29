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
    summary: 'Get all research records with pagination',
    description:
      'Retrieves available research records with optional pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Research records returned successfully.',
  })
  findAll(@Query() query: GetResearchDataQueryDto) {
    return this.researchService.findAll(query);
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
    name: 'gender',
    required: false,
    type: Number,
    description: 'Filter by gender.\n\nAvailable values: (1 for Male, 2 for Female)',
  })
  @ApiQuery({
    name: 'age',
    required: false,
    type: Number,
    description: 'Filter by age.\n\nAvailable values: 14-19',
  })
  @ApiQuery({
    name: 'gre',
    required: false,
    type: Number,
    description: `Filter by GRE (Gerência Regional de Educação).\n
    Available values: a number from 1 to 16.

    01 - Recife Norte
    02 - Recife Sul
    03 - Metropolitana Norte
    04 - Metropolitana Sul
    05 - Mata Norte
    06 - Mata Centro
    07 - Mata Sul
    08 - Vale do Capibaribe
    09 - Agreste Centro Norte
    10 - Agreste Meridional
    11 - Sertão do Moxotó-Ipanema
    12 - Sertão do Alto Pajeú
    13 - Deputado Antonio Novaes
    14 - Sertão do Médio São Francisco
    15 - Sertão Central
    16 - Sertão do Araripe`,
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
