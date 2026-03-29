import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { createAppConfig } from './config/app.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = createAppConfig(process.env);

  app.enableCors({
    origin: ['http://localhost:5173'],
  });
  app.setGlobalPrefix('api/v1');

  await app.listen(config.port);
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server', error);
  process.exit(1);
});
