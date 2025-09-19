import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'Student user created successfully',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict error, theres already an user with the received email',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('register-student')
  async registerStudent(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createStudent(createUserDTO);
  }
}
