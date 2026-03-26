import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/env.schema';
import { ConversationsModule } from './conversations/conversations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ConversationsModule,
  ],
})
export class AppModule {}
