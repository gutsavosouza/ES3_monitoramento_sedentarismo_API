import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRankingDTO {
  @ApiProperty({
    description: 'The unique six-character code to join the ranking.',
    example: 'A1B2C3',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "The student's user ID.",
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  studentId: any;
}
