import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'example@email.com',
    required: true,
    description: 'User email',
  })
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    required: true,
    description: 'User password, must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(8, {
    message: 'A senha deve ter no mínimo 8 caracters.',
  })
  password: string;
}
