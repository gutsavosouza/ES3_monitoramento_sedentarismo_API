import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register-student')
  async registerStudent(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createStudent(createUserDTO);
  }
}
