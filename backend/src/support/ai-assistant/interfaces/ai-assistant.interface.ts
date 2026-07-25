export interface AiPersona {
  id: string;
  name: string;
  description: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  personaId: string;
  updatedAt: string;
  messages: AiMessage[];
}
