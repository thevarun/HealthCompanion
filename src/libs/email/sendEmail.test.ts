import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the client module
const mockSend = vi.fn();
vi.mock('./client', () => ({
  getEmailClient: vi.fn(() => ({
    send: mockSend,
  })),
}));

describe('sendEmail helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({
      success: true,
      messageId: 'test_msg_123',
    });
  });

  describe('sendEmail', () => {
    it('sends email with React template', async () => {
      const { sendEmail } = await import('./sendEmail');

      const MockTemplate = React.createElement('div', null, 'Hello World');
      const result = await sendEmail(
        'user@example.com',
        'Welcome!',
        MockTemplate,
      );

      expect(mockSend).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Welcome!',
        react: MockTemplate,
      });
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.messageId).toBe('test_msg_123');
      }
    });

    it('sends email with all options', async () => {
      const { sendEmail } = await import('./sendEmail');

      const MockTemplate = React.createElement('div', null, 'Hello');
      const result = await sendEmail(
        ['user1@example.com', 'user2@example.com'],
        'Subject Line',
        MockTemplate,
        {
          replyTo: 'reply@example.com',
          cc: 'cc@example.com',
          bcc: ['bcc1@example.com', 'bcc2@example.com'],
          tags: [{ name: 'category', value: 'welcome' }],
        },
      );

      expect(mockSend).toHaveBeenCalledWith({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Subject Line',
        react: MockTemplate,
        replyTo: 'reply@example.com',
        cc: 'cc@example.com',
        bcc: ['bcc1@example.com', 'bcc2@example.com'],
        tags: [{ name: 'category', value: 'welcome' }],
      });
      expect(result.success).toBe(true);
    });

    it('handles send failure', async () => {
      mockSend.mockResolvedValue({
        success: false,
        error: 'Invalid recipient',
        code: 'validation_error',
      });

      const { sendEmail } = await import('./sendEmail');

      const MockTemplate = React.createElement('div', null, 'Hello');
      const result = await sendEmail(
        'invalid',
        'Subject',
        MockTemplate,
      );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe('Invalid recipient');
      }
    });
  });

  describe('sendPlainEmail', () => {
    it('sends plain text email', async () => {
      const { sendPlainEmail } = await import('./sendEmail');

      const result = await sendPlainEmail(
        'user@example.com',
        'Plain Subject',
        'This is plain text content',
      );

      expect(mockSend).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Plain Subject',
        text: 'This is plain text content',
        html: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('sends email with both text and html', async () => {
      const { sendPlainEmail } = await import('./sendEmail');

      const result = await sendPlainEmail(
        'user@example.com',
        'HTML Subject',
        'Plain text fallback',
        '<p>HTML content</p>',
      );

      expect(mockSend).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'HTML Subject',
        text: 'Plain text fallback',
        html: '<p>HTML content</p>',
      });
      expect(result.success).toBe(true);
    });

    it('handles send failure', async () => {
      mockSend.mockResolvedValue({
        success: false,
        error: 'Rate limit exceeded',
        code: 'rate_limit',
      });

      const { sendPlainEmail } = await import('./sendEmail');

      const result = await sendPlainEmail(
        'user@example.com',
        'Subject',
        'Body',
      );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe('Rate limit exceeded');
        expect(result.code).toBe('rate_limit');
      }
    });
  });
});
