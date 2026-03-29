import { Inject, Injectable } from '@nestjs/common';

import type { AppConfig } from '../../config/app.config.js';
import { APP_CONFIG } from '../../shared/tokens.js';

export interface OpenRouterStreamInput {
  model: string;
  messages: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
}

@Injectable()
export class OpenRouterClient {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  createHeaders() {
    return {
      Authorization: `Bearer ${this.config.openRouter.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'OpenRouter Free Chat Web App',
    };
  }

  async streamChat(_input: OpenRouterStreamInput) {
    return {
      baseUrl: this.config.openRouter.baseUrl,
      headers: this.createHeaders(),
    };
  }
}
