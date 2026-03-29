import { Controller, Get, Inject } from '@nestjs/common';
import type { ModelOption } from '@repo/contracts';

import { ModelsService } from './models.service.js';

@Controller('models')
export class ModelsController {
  constructor(@Inject(ModelsService) private readonly modelsService: ModelsService) {}

  @Get()
  getModels(): ModelOption[] {
    return this.modelsService.listModels();
  }
}
