import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
  ],
})
export class AppModule {}
