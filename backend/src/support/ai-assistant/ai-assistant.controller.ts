import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai.dto';
import { AiAssistantService } from './ai-assistant.service';

// PRD 3.2.3 — AI Assistant
@Controller('support/ai-assistant')
export class AiAssistantController {
  constructor(private readonly service: AiAssistantService) {}

  @Get('personas')
  getPersonas() {
    return this.service.getPersonas();
  }

  @Get('suggested-prompts')
  getSuggestedPrompts() {
    return this.service.getSuggestedPrompts();
  }

  @Get('conversations')
  listConversations() {
    return this.service.listConversations();
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string) {
    return this.service.getConversation(id);
  }

  @Post('conversations')
  startConversation(@Query('personaId') personaId?: string) {
    return this.service.startConversation(personaId);
  }

  @Post('ask')
  ask(@Body() dto: AskAiDto) {
    return this.service.ask(dto);
  }
}
