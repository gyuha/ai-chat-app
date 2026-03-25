import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
  });
  const configService = app.get(ConfigService);
  const frontendOrigin = configService.getOrThrow<string>('FRONTEND_ORIGIN');
  const port = configService.getOrThrow<number>('PORT');

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  await app.listen(port);
}

void bootstrap();
