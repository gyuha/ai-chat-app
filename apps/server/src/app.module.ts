import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { ModelsModule } from './modules/models/models.module.js';
import { StreamingModule } from './modules/streaming/streaming.module.js';
import { CoreModule } from './shared/core.module.js';

@Module({
  imports: [CoreModule, HealthModule, ModelsModule, StreamingModule],
})
export class AppModule {}
