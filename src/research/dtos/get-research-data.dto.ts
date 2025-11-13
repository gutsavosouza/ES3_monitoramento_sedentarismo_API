import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum ResearchType {
  BMI = 'bmi',
  SCREEN_TIME = 'screen-time',
  PHYSICAL_ACTIVITY = 'physical-activity',
}

export class GetResearchDataDto {
  @IsOptional()
  @IsNumber()
  sexo?: number;

  @IsOptional()
  @IsNumber()
  idade?: number;

  @IsOptional()
  @IsNumber()
  gre?: number;

  @IsOptional()
  @IsNumber()
  serie?: number;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsEnum(ResearchType)
  researchType: ResearchType;
}
