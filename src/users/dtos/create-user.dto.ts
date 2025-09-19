import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'example@email.com',
    required: true,
    description: 'User email',
  })
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    required: true,
    description: 'User name',
  })
  @IsString({})
  @IsNotEmpty({ message: 'O campo de nome não pode estar vazio.' })
  name: string;

  @ApiProperty({
    example: 'strongpassword',
    required: true,
    description: 'User password, must be at least 8 characters long',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha não deve estar vazia.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracters.' })
  password: string;
}
