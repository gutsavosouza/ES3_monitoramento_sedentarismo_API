import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginReturnDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    required: true,
    description:
      'User access token, signed with their id and email. Lasts for 30 minutes.',
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({
    example: 'ae3e1953-61c1-4e6e-a656-7595c386b2d9',
    required: true,
    description:
      'User refresh token, used to refresh access token. Lasts for 3 days.',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
