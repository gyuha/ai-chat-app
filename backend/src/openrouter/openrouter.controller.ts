import { Controller, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OpenRouterService } from './openrouter.service';

@Controller('openrouter')
@UseGuards(JwtAuthGuard)
export class OpenRouterController {
  constructor(private openRouterService: OpenRouterService) {}

  @Get('models')
  getModels() {
    return {
      models: this.openRouterService.getAllowedModels(),
      default: this.openRouterService.getDefaultModel(),
    };
  }
}
