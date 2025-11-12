import { ApiProperty } from '@nestjs/swagger';

class AveragePhysicalActivityByGenderData {
  @ApiProperty({ example: 'Male' })
  gender: string;

  @ApiProperty({ example: 150.5 })
  averageDailyActivity: number;
}

export class AveragePhysicalActivityByGenderResponseDto {
  @ApiProperty({ type: [AveragePhysicalActivityByGenderData] })
  data: AveragePhysicalActivityByGenderData[];
}
