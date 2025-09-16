import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @IsString({})
  @IsNotEmpty({ message: 'O campo de nome não pode estar vazio.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não deve estar vazia.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracters.' })
  password: string;
}
