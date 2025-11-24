import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDTO } from './dtos/create-activity.dto';
import { CreateGroupActivityDTO } from './dtos/create-group-activity.dto';
import { Types } from 'mongoose';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('student/ranking/:rankingId/student/:studentId')
  @ApiParam({
    name: 'rankingId',
    description: 'The ID of the ranking this activity belongs to',
  })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of the student performing the activity',
  })
  @ApiBody({ type: CreateActivityDTO })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is not a student or not in the ranking.',
  })
  @ApiResponse({ status: 404, description: 'User or ranking not found.' })
  createStudentActivity(
    @Param('studentId') studentId: string,
    @Param('rankingId') rankingId: string,
    @Body() createActivityDto: CreateActivityDTO,
  ) {
    return this.activitiesService.createStudentActivity(
      studentId,
      rankingId,
      createActivityDto,
    );
  }

  @Post('group/ranking/:rankingId/teacher/:teacherId')
  @ApiParam({
    name: 'rankingId',
    description: 'The ID of the ranking this activity belongs to',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'The ID of the teacher creating the activity',
  })
  @ApiBody({ type: CreateGroupActivityDTO })
  @ApiResponse({
    status: 201,
    description: 'Group activity created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is not a teacher.',
  })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  createGroupActivity(
    @Param('teacherId') teacherId: string,
    @Param('rankingId') rankingId: string,
    @Body() createGroupActivityDto: CreateGroupActivityDTO,
  ) {
    return this.activitiesService.createGroupActivity(
      new Types.ObjectId(teacherId),
      new Types.ObjectId(rankingId),
      createGroupActivityDto,
    );
  }

  @Patch(':activityId/confirm')
  @ApiParam({
    name: 'activityId',
    description: 'The ID of the activity to confirm',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity confirmed successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only the activity creator can confirm.',
  })
  @ApiResponse({ status: 404, description: 'Activity or teacher not found.' })
  confirmParticipation(@Req() req, @Param('activityId') activityId: string) {
    const teacherId = req.user.userId;
    return this.activitiesService.confirmParticipation(activityId, teacherId);
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Optional start date filter (ISO 8601 format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Optional end date filter (ISO 8601 format)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of the user’s activities with calculated points.',
  })
  getActivitiesForUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.activitiesService.getActivitiesForUser(
      userId,
      startDate,
      endDate,
    );
  }

  @Get('user/:userId/ranking/:rankingId/points')
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'rankingId', description: 'The ID of the ranking' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the total points for the user in the specified ranking.',
  })
  getUserTotalPointsForRanking(
    @Param('userId') userId: string,
    @Param('rankingId') rankingId: string,
  ) {
    return this.activitiesService.getUserTotalPointsForRanking(
      userId,
      rankingId,
    );
  }

  @Get('user/:userId/points')
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Optional start date filter (ISO 8601 format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Optional end date filter (ISO 8601 format)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the total points for the user across all activities.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUserTotalPoints(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.activitiesService.getUserTotalPoints(
      userId,
      startDate,
      endDate,
    );
  }

  @Get('/all/ranking/:rankingId')
  @ApiParam({ name: 'rankingId', description: 'The ID of the ranking' })
  @ApiResponse({
    status: 200,
    description: 'Returns all activities from the desired ranking.',
  })
  @ApiResponse({ status: 404, description: 'Ranking not found.' })
  getAllActivitiesByRanking(@Param('rankingId') rankingId: string) {
    return this.activitiesService.getAllActivitiesByRanking(
      new Types.ObjectId(rankingId),
    );
  }

  @Get('/all/creator/:creatorId')
  @ApiParam({
    name: 'creatorId',
    description: 'The ID of the user that created the activity',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all activities from the desired creator(user).',
  })
  getAllActivitiesByCreator(@Param('creatorId') creatorId: string) {
    return (
      this,
      this.activitiesService.getAllActivitiesByCreator(
        new Types.ObjectId(creatorId),
      )
    );
  }
}
