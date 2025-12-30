/**
 * Dify API Mock Fixtures
 * Reusable mock responses for E2E tests
 *
 * These fixtures mirror the actual Dify API event structure to ensure
 * tests accurately represent production behavior.
 *
 * Event Types (as per Dify API v1):
 * - "message": Streaming message content (may be sent multiple times for progressive updates)
 * - "message_end": Indicates completion of message streaming
 * - "error": Error event from Dify API
 * - "ping": Keep-alive ping event
 */

type DifyMessageEvent = {
  event: 'message';
  message_id: string;
  conversation_id?: string;
  answer: string;
};

type DifyMessageEndEvent = {
  event: 'message_end';
  message_id: string;
  conversation_id?: string;
};

type DifyErrorEvent = {
  event: 'error';
  status: number;
  code: string;
  message: string;
};

/**
 * Creates a Dify "message" event (SSE format)
 * Used for streaming message content
 */
export function createMessageEvent(
  messageId: string,
  answer: string,
  conversationId?: string,
): string {
  const event: DifyMessageEvent = {
    event: 'message',
    message_id: messageId,
    answer,
  };

  if (conversationId) {
    event.conversation_id = conversationId;
  }

  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Creates a Dify "message_end" event (SSE format)
 * Signals completion of message streaming
 */
export function createMessageEndEvent(
  messageId: string,
  conversationId?: string,
): string {
  const event: DifyMessageEndEvent = {
    event: 'message_end',
    message_id: messageId,
  };

  if (conversationId) {
    event.conversation_id = conversationId;
  }

  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Creates a Dify "error" event (SSE format)
 */
export function createErrorEvent(
  status: number,
  code: string,
  message: string,
): string {
  const event: DifyErrorEvent = {
    event: 'error',
    status,
    code,
    message,
  };

  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Creates a complete SSE response with message and message_end events
 * This is the most common pattern for a successful Dify response
 */
export function createCompleteMessageResponse(
  messageId: string,
  answer: string,
  conversationId?: string,
): string {
  return (
    createMessageEvent(messageId, answer, conversationId)
    + createMessageEndEvent(messageId, conversationId)
  );
}

/**
 * Creates a streaming response with multiple message chunks
 * Simulates progressive streaming of content
 */
export function createStreamingMessageResponse(
  messageId: string,
  chunks: string[],
  conversationId?: string,
): string {
  let response = '';

  for (const chunk of chunks) {
    response += createMessageEvent(messageId, chunk, conversationId);
  }

  response += createMessageEndEvent(messageId, conversationId);

  return response;
}

/**
 * Pre-configured mock responses for common test scenarios
 */
export const MockResponses = {
  /**
   * Simple greeting response
   */
  greeting: (conversationId = 'conv-123') =>
    createCompleteMessageResponse(
      'msg-123',
      'Hello! How can I help you today?',
      conversationId,
    ),

  /**
   * Health advice with multiple chunks (streaming simulation)
   */
  healthAdvice: (conversationId = 'conv-456') =>
    createStreamingMessageResponse(
      'msg-456',
      [
        'Here are some healthy breakfast options:',
        '\n1. Oatmeal with berries',
        '\n2. Greek yogurt with nuts',
      ],
      conversationId,
    ),

  /**
   * Contextual follow-up response
   */
  followUp: (conversationId: string) =>
    createCompleteMessageResponse(
      'msg-follow-up',
      'Based on our previous conversation, here\'s my recommendation...',
      conversationId,
    ),

  /**
   * Mobile-optimized short response
   */
  mobileResponse: () =>
    createCompleteMessageResponse('msg-mobile', 'Mobile response'),

  /**
   * Delayed response (for loading state testing)
   */
  delayedResponse: () =>
    createCompleteMessageResponse('msg-789', 'Response after delay'),

  /**
   * Error response
   */
  error: () =>
    createErrorEvent(500, 'INTERNAL_ERROR', 'Internal server error'),
};

/**
 * Message history types for /api/chat/messages endpoint
 */
type DifyHistoryMessage = {
  id: string;
  query: string;
  answer: string;
  created_at: number;
};

/**
 * Creates a history response for /api/chat/messages endpoint
 * This mirrors the format returned by Dify's getMessages API
 */
export function createHistoryResponse(
  messages: Array<{
    id: string;
    query: string;
    answer: string;
    createdAt?: number;
  }>,
): { data: DifyHistoryMessage[] } {
  return {
    data: messages.map(m => ({
      id: m.id,
      query: m.query,
      answer: m.answer,
      created_at: m.createdAt || Math.floor(Date.now() / 1000),
    })),
  };
}

/**
 * Pre-configured mock history responses for chat history tests
 */
export const MockHistoryResponses = {
  /**
   * Single message exchange
   */
  singleMessage: () =>
    createHistoryResponse([
      { id: 'msg-1', query: 'Hello', answer: 'Hi there! How can I help you today?' },
    ]),

  /**
   * Multi-turn conversation
   */
  conversation: () =>
    createHistoryResponse([
      { id: 'msg-1', query: 'What is healthy eating?', answer: 'Healthy eating involves consuming a balanced diet rich in nutrients.' },
      { id: 'msg-2', query: 'Give me examples', answer: 'Some examples include fruits, vegetables, whole grains, and lean proteins.' },
      { id: 'msg-3', query: 'What about snacks?', answer: 'Healthy snacks include nuts, yogurt, and fresh fruit.' },
    ]),

  /**
   * Long conversation (for scroll testing)
   */
  longConversation: () =>
    createHistoryResponse([
      { id: 'msg-1', query: 'Hello', answer: 'Hello! I\'m your AI health coach. How can I help you today?' },
      { id: 'msg-2', query: 'Tell me about nutrition', answer: 'Nutrition is the science of how food affects your body. It includes studying nutrients like carbohydrates, proteins, fats, vitamins, and minerals.' },
      { id: 'msg-3', query: 'What should I eat for breakfast?', answer: 'A healthy breakfast should include protein, fiber, and healthy fats. Options include oatmeal with berries, eggs with whole grain toast, or Greek yogurt with nuts.' },
      { id: 'msg-4', query: 'And for lunch?', answer: 'For lunch, aim for a balance of lean protein, complex carbs, and vegetables. A salad with grilled chicken, quinoa bowls, or whole grain sandwiches are great choices.' },
      { id: 'msg-5', query: 'What about dinner?', answer: 'Dinner should be lighter but still nutritious. Consider grilled fish with roasted vegetables, stir-fries with tofu, or lean meat with a side salad.' },
      { id: 'msg-6', query: 'Any snack recommendations?', answer: 'Healthy snacks include fresh fruit, raw vegetables with hummus, nuts and seeds, or a small portion of cheese with whole grain crackers.' },
      { id: 'msg-7', query: 'How much water should I drink?', answer: 'The general recommendation is 8 glasses (64 ounces) per day, but this can vary based on activity level, climate, and individual needs.' },
      { id: 'msg-8', query: 'Thanks for all the tips!', answer: 'You\'re welcome! Remember, consistency is key. Small, sustainable changes lead to lasting health improvements. Feel free to ask if you have more questions!' },
    ]),

  /**
   * Empty history (new thread)
   */
  empty: () => ({ data: [] }),
};
