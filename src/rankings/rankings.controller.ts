import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { CreateRankingDTO } from './dtos/create-ranking.dto';
import { JoinRankingDTO } from './dtos/join-ranking.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('ranking')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Post('join')
  @ApiBody({ type: JoinRankingDTO })
  @ApiResponse({
    status: 201,
    description: 'Student successfully joined the ranking.',
  })
  @ApiResponse({ status: 404, description: 'Ranking or Student not found.' })
  @ApiResponse({
    status: 403,
    description: 'Student is already in the ranking.',
  })
  joinRanking(@Body() joinRankingDto: JoinRankingDTO) {
    return this.rankingsService.join(
      joinRankingDto.code,
      joinRankingDto.studentId,
    );
  }

  @Post(':teacherId')
  @ApiParam({
    name: 'teacherId',
    description: 'The ID of the teacher creating the ranking',
    type: String,
  })
  @ApiBody({ type: CreateRankingDTO })
  @ApiResponse({
    status: 201,
    description: 'The ranking has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  createRanking(
    @Param('teacherId') teacherId: string,
    @Body()
    createData: CreateRankingDTO,
  ) {
    return this.rankingsService.create(createData, teacherId);
  }

  @Get(':id/leaderboard')
  @ApiParam({
    name: 'id',
    description: 'The ID of the ranking',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the ranking leaderboard.',
  })
  @ApiResponse({ status: 404, description: 'Ranking not found.' })
  getLeaderboard(@Param('id') id: string) {
    return this.rankingsService.getLeaderboard(id);
  }

  @ApiParam({
    name: 'teacherId',
    description: 'The ID of the teacher(user) to retrieve the rankings from.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all rankings from teacher.',
  })
  @ApiResponse({ status: 404, description: 'Teacher user not found.' })
  @ApiResponse({ status: 403, description: 'User is not a teacher.' })
  @Get('/all/:teacherId')
  getAllRankings(@Param('teacherId') teacherId: string) {
    return this.rankingsService.getAllRankings(teacherId);
  }

  @Get('/participant/:studentId')
  @ApiParam({
    name: 'studentId',
    description: 'The ID of the student to retrieve rankings from.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all rankings that include this participant.',
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 403, description: 'User is not a student.' })
  getAllRankingsByParticipant(@Param('studentId') studentId: string) {
    return this.rankingsService.getAllRankingsByParticipant(studentId);
  }
}
