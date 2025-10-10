import { forwardRef, Logger, Module, OnModuleInit } from '@nestjs/common';
import { MainSeed } from './seeds/main.seed';
import { UsersSeed } from './seeds/users.seed';
import { RankingsSeed } from './seeds/ranking.seed';
import { ActivitiesSeed } from './seeds/activities.seed';
import { UsersModule } from 'src/users/users.module';
import { RankingsModule } from 'src/rankings/rankings.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RankingsModule),
    forwardRef(() => ActivitiesModule),
  ],
  providers: [MainSeed, UsersSeed, RankingsSeed, ActivitiesSeed],
  exports: [MainSeed],
})
export class SeederModule {}
