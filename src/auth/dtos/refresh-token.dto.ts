import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    example: 'fc3ffa88-27d8-4e57-9a85-bfca775a526d',
    required: true,
    description: 'The refresh token that was provided in the login request',
  })
  @IsString()
  token: string;
}
