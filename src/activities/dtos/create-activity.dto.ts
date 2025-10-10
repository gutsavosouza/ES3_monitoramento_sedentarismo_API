import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ActivityType } from '../enums/activity-type.enum';
import { ActivityItensity } from '../enums/activity-intensity.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDTO {
  @ApiProperty({
    description: 'The date and time when the activity occurred',
    example: '2025-10-08T13:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  ocurredAt: Date;

  @ApiProperty({
    description: 'The type of the activity',
    enum: ActivityType,
    example: ActivityType.RUNNING,
  })
  @IsNotEmpty()
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({
    description: 'A short description of the activity',
    example: 'Morning run in the park',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Total time spent on the activity in seconds',
    example: 3600,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  timeSpentInSeconds: number;

  @ApiProperty({
    description: 'The intensity level of the activity',
    enum: ActivityItensity,
    example: ActivityItensity.MODERATE,
  })
  @IsNotEmpty()
  @IsEnum(ActivityItensity)
  intesity: ActivityItensity;
}
