// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Usar ValidationPipe para validar DTOs
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
