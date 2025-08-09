export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export type Provider = 'openai' | 'ollama';

export interface ModelConfig {
  id: string;
  name: string; // Display name
  provider: Provider;
  baseUrl: string; // e.g. https://api.openai.com or http://localhost:11434
  apiKey?: string; // optional for providers like Ollama
  model: string; // e.g. gpt-4o-mini or llama3:8b
  temperature?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  configId: string;
  systemPrompt?: string;
  createdAt: number;
  updatedAt: number;
}
