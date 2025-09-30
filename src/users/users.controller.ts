import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateUserPersonalInfoDTO } from './dtos/update-user-personal-info.dto';
import { UpdateStudentInfoDTO } from './dtos/update-student-info.dto';

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
  @Post('students/register')
  async registerStudent(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createStudent(createUserDTO);
  }

  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'Teacher user created successfully',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict error, theres already an user with the received email',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('teachers/register')
  async registerTeacher(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createTeacher(createUserDTO);
  }

  @ApiBody({ type: UpdateUserPersonalInfoDTO })
  @ApiResponse({
    status: 200,
    description: 'User personal info updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch('personal-info/:email')
  async updateUserPersonalInfo(
    @Param('email') email: string,
    @Body() updateData: UpdateUserPersonalInfoDTO,
  ) {
    return this.userService.updateUserPersonalData(email, updateData);
  }

  @ApiResponse({
    status: 200,
    description: 'Student data retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: User is not a student.',
  })
  @Get('students/data/:email')
  async getStudentData(@Param('email') email: string) {
    return this.userService.getStudentInfo(email);
  }

  @ApiBody({ type: UpdateStudentInfoDTO })
  @ApiResponse({
    status: 200,
    description: 'Student info updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: User is not a student.',
  })
  @Patch('students/data/:email')
  async updateStudentInfo(
    @Param('email') email: string,
    @Body() updateData: UpdateStudentInfoDTO,
  ) {
    return this.userService.updateStudentData(email, updateData);
  }
}
