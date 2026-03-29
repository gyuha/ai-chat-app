import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private openai: OpenAI;
  private allowedModels: string[];

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
      baseURL: this.configService.get<string>('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
    });

    const models = this.configService.get<string>('ALLOWED_MODELS', 'google/gemma-2-9b-it:free');
    this.allowedModels = models.split(',').map((m) => m.trim());
  }

  getAllowedModels(): string[] {
    return this.allowedModels;
  }

  isModelAllowed(model: string): boolean {
    return this.allowedModels.includes(model);
  }

  getDefaultModel(): string {
    return this.allowedModels[0] || 'google/gemma-2-9b-it:free';
  }

  async streamChat(messages: Array<{ role: string; content: string }>, model?: string, abortSignal?: AbortSignal) {
    const selectedModel = model || this.getDefaultModel();

    if (!this.isModelAllowed(selectedModel)) {
      throw new Error(`Model ${selectedModel} is not allowed`);
    }

    this.logger.log(`Streaming chat with model: ${selectedModel}`);

    return this.openai.chat.completions.create({
      model: selectedModel,
      messages,
      stream: true,
    }, {
      signal: abortSignal,
    });
  }

  async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.getDefaultModel(),
        messages: [
          {
            role: 'system',
            content: 'Generate a concise title (max 5 words) for the following user message. Return only the title, no quotes.',
          },
          {
            role: 'user',
            content: firstMessage,
          },
        ],
        max_tokens: 30,
      });

      return response.choices[0]?.message?.content?.trim() || 'New Chat';
    } catch (error) {
      this.logger.error('Failed to generate chat title:', error);
      return 'New Chat';
    }
  }
}
