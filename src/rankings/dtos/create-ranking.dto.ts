import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRankingDTO {
  @ApiProperty({
    description: 'The name of the ranking.',
    example: 'Physical Education Q4',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The start date of the ranking in ISO 8601 format.',
    example: '2025-10-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the ranking in ISO 8601 format.',
    example: '2025-12-15T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
