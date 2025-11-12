import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AveragePhysicalActivityByGenderResponseDto } from './dtos/average-physical-activity-by-gender-response.dto';
import { BmiByAgeGenderResponseDto } from './dtos/bmi-by-age-gender-response.dto';
import { ScreenTimeByGenderResponseDto } from './dtos/screen-time-by-gender-response.dto';
import { ResearchService } from './research.service';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  findAll() {
    return this.researchService.findAll();
  }

  @Get('bmi-by-age-gender')
  @ApiOperation({ summary: 'Obtém a média do IMC por faixa etária e gênero' })
  @ApiOkResponse({
    description: 'Dados retornados com sucesso.',
    type: [BmiByAgeGenderResponseDto],
  })
  async getBmiByAgeAndGender() {
    return this.researchService.getBmiByAgeAndGender();
  }

  @Get('screen-time-by-gender')
  @ApiOperation({
    summary: 'Obtém o tempo de tela médio por gênero e dispositivo',
  })
  @ApiOkResponse({
    description: 'Dados retornados com sucesso.',
    type: [ScreenTimeByGenderResponseDto],
  })
  async getAverageScreenTimeByGender() {
    return this.researchService.getAverageScreenTimeByGender();
  }

  @Get('average-physical-activity-by-gender')
  @ApiOperation({
    summary: 'Obtém a média de atividade física diária por gênero',
  })
  @ApiOkResponse({
    description: 'Dados retornados com sucesso.',
    type: AveragePhysicalActivityByGenderResponseDto,
  })
  async getAveragePhysicalActivityByGender() {
    return this.researchService.getAveragePhysicalActivityByGender();
  }

  @Get('average-physical-activity-by-gender/:year')
  @ApiOperation({
    summary: 'Obtém a média de atividade física diária por gênero e ano',
  })
  @ApiOkResponse({
    description: 'Dados retornados com sucesso.',
    type: AveragePhysicalActivityByGenderResponseDto,
  })
  async getAveragePhysicalActivityByGenderByYear(
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.researchService.getAveragePhysicalActivityByGenderByYear(year);
  }
}
