import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 8080;

  const config = new DocumentBuilder()
    .setTitle('ES3 - Monitoramento Sedentarismo API')
    .setDescription(
      'API construída para o projeto da disciplina de Engenharia de Software 3, com base nos requisitos levantdos pelo cliente e pela equipe.',
    )
    .setVersion('0.1.0')
    .addServer(`http://localhost:${PORT}`)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  await app.listen(PORT);
}
bootstrap();
