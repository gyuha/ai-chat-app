import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, createAppConfig } from '../config/app.config.js';
import { OpenRouterClient } from '../infrastructure/openrouter/openrouter.client.js';
import { FileChatRepository } from '../infrastructure/storage/file-chat.repository.js';
import { MemoryChatRepository } from '../infrastructure/storage/memory-chat.repository.js';
import { APP_CONFIG, CHAT_REPOSITORY } from './tokens.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: () => createAppConfig(process.env),
    },
    {
      provide: CHAT_REPOSITORY,
      inject: [APP_CONFIG],
      useFactory: (config: ReturnType<typeof createAppConfig>) =>
        config.storage.mode === 'file'
          ? new FileChatRepository(config.storage.directory)
          : new MemoryChatRepository(),
    },
    OpenRouterClient,
  ],
  exports: [ConfigModule, APP_CONFIG, CHAT_REPOSITORY, OpenRouterClient],
})
export class CoreModule {}
