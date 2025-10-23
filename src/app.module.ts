import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ActivitiesModule } from './activities/activities.module';
import { RankingsModule } from './rankings/rankings.module';
import { SeederModule } from './seeder/seeder.module';
import { ResearchModule } from './research/research.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'jwt_secret_key',
      signOptions: { expiresIn: '30m' },
      global: true,
    }),
    ActivitiesModule,
    RankingsModule,
    SeederModule,
    ResearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
