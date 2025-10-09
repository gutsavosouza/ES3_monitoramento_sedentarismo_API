import { forwardRef, Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { RankingsRepository } from './rankings.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Ranking, RankingSchema } from './schemas/rankings.schema';
import { UsersRepository } from 'src/users/users.repository';
import { ActivitiesRepository } from 'src/activities/activities.repository';
import { UsersModule } from 'src/users/users.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ActivitiesModule),
    MongooseModule.forFeature([{ name: Ranking.name, schema: RankingSchema }]),
  ],
  controllers: [RankingsController],
  providers: [RankingsService, RankingsRepository],
  exports: [RankingsRepository],
})
export class RankingsModule {}
