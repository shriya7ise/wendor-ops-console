import { Injectable, NotFoundException } from '@nestjs/common';
import { AskAiDto } from './dto/ask-ai.dto';
import { AiConversation } from './interfaces/ai-assistant.interface';
import {
  AI_PERSONAS,
  AI_SUGGESTED_PROMPTS,
  MOCK_AI_CONVERSATIONS,
  generateAiReply,
} from './ai-assistant.mock';

// PRD 3.2.3 — AI Assistant
@Injectable()
export class AiAssistantService {
  private readonly conversations: AiConversation[] = MOCK_AI_CONVERSATIONS;

  getPersonas() {
    return AI_PERSONAS;
  }

  getSuggestedPrompts() {
    return AI_SUGGESTED_PROMPTS;
  }

  listConversations() {
    return [...this.conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  getConversation(id: string) {
    const found = this.conversations.find((c) => c.id === id);
    if (!found) throw new NotFoundException(`Conversation ${id} not found`);
    return found;
  }

  startConversation(personaId = 'ops') {
    const conversation: AiConversation = {
      id: `CONV${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'New conversation',
      personaId,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    this.conversations.unshift(conversation);
    return conversation;
  }

  ask(dto: AskAiDto) {
    let conversation = dto.conversationId
      ? this.conversations.find((c) => c.id === dto.conversationId)
      : undefined;

    if (!conversation) {
      conversation = this.startConversation(dto.personaId);
      conversation.title = dto.question.slice(0, 48);
    }

    const now = new Date().toISOString();
    conversation.messages.push({
      id: `M${Date.now()}`,
      role: 'user',
      content: dto.question,
      createdAt: now,
    });

    const reply = generateAiReply(dto.question);
    conversation.messages.push({
      id: `M${Date.now() + 1}`,
      role: 'assistant',
      content: reply,
      createdAt: new Date().toISOString(),
    });
    conversation.updatedAt = new Date().toISOString();

    return conversation;
  }
}
