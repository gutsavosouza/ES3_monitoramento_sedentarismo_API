import { forwardRef, Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './activities.repository';
import { UsersRepository } from 'src/users/users.repository';
import { RankingsRepository } from 'src/rankings/rankings.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { UsersModule } from 'src/users/users.module';
import { RankingsModule } from 'src/rankings/rankings.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RankingsModule),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
  exports: [ActivitiesRepository, ActivitiesService],
})
export class ActivitiesModule {}
