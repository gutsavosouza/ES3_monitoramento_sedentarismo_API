import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentInfoDTO {
  @ApiProperty({
    example: 70000,
    required: false,
    description: "Student's weight in grams",
  })
  @IsNumber()
  @IsOptional()
  weightInGrams?: number;

  @ApiProperty({
    example: 175,
    required: false,
    description: "Student's height in centimeters",
  })
  @IsNumber()
  @IsOptional()
  heightInCm?: number;

  @ApiProperty({
    example: 'Male',
    required: false,
    description: "Student's gender",
  })
  @IsString()
  @IsOptional()
  gender?: string;
}
