import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { MainSeed } from './seeds/main.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(MainSeed);

  try {
    await seeder.run();
  } catch (error) {
  } finally {
    await app.close();
  }
}

bootstrap();
