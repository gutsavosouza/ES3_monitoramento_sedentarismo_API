import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserPersonalInfoDTO {
  @ApiProperty({
    example: 'John Doe',
    required: false,
    description: "User's full name",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Colégio Estadual Rui Barbosa',
    required: false,
    description: "User's school",
  })
  @IsString()
  @IsOptional()
  school?: string;

  @ApiProperty({
    example: '2005-08-24T14:15:22Z',
    required: false,
    description: "User's birthdate in ISO 8601 format",
  })
  @IsDateString()
  @IsOptional()
  birthdate?: Date;

  @ApiProperty({
    example: 'Juazeiro',
    required: false,
    description: "User's city",
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Mata Norte',
    required: false,
    description: "User's GRE name",
  })
  @IsString()
  @IsOptional()
  gre: string;
}
