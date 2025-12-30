import { Env } from '@/libs/Env';

/**
 * Dify API Configuration
 */

export const DIFY_CONFIG = {
  apiKey: Env.DIFY_API_KEY,
  apiUrl: Env.DIFY_API_URL,
  endpoints: {
    chatMessages: '/chat-messages',
    messages: '/messages', // Conversation history endpoint
  },
  defaultTimeout: 30000, // 30 seconds
} as const;

export const DIFY_RESPONSE_MODES = {
  STREAMING: 'streaming',
  BLOCKING: 'blocking',
} as const;
