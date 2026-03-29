import { Module } from '@nestjs/common';

import { StreamingController } from './streaming.controller.js';

@Module({
  controllers: [StreamingController],
})
export class StreamingModule {}
