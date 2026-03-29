import { Inject, Injectable } from '@nestjs/common';
import type { ModelOption } from '@repo/contracts';

import { APP_CONFIG, type AppConfig } from '../../shared/tokens.js';

@Injectable()
export class ModelsService {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  listModels(): ModelOption[] {
    return this.config.openRouter.models;
  }
}
