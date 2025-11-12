
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetResearchDataQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sexo?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idade?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gre?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  serie?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;
}
