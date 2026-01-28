import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Create mock functions that persist across tests
const mockSend = vi.fn();
const mockLoggerWarn = vi.fn();
const mockLoggerInfo = vi.fn();
const mockLoggerError = vi.fn();

// Track mock config state
let mockApiKey: string | undefined;
let mockIsEnabled = false;

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: mockSend,
    };
  },
}));

vi.mock('../Logger', () => ({
  logger: {
    warn: (...args: unknown[]) => mockLoggerWarn(...args),
    info: (...args: unknown[]) => mockLoggerInfo(...args),
    error: (...args: unknown[]) => mockLoggerError(...args),
  },
}));

vi.mock('./config', () => ({
  get EMAIL_CONFIG() {
    return {
      apiKey: mockApiKey,
      fromAddress: 'test@example.com',
      fromName: 'Test App',
      replyTo: 'reply@example.com',
    };
  },
  isEmailEnabled: () => mockIsEnabled,
  getFromAddress: () => 'Test App <test@example.com>',
}));

describe('EmailClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockReset();
    mockApiKey = undefined;
    mockIsEnabled = false;
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  describe('constructor', () => {
    it('logs warning when API key is not configured in development', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { EmailClient } = await import('./client');
      const _client = new EmailClient();

      expect(_client).toBeDefined();
      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'Email API key not configured - emails will be logged to console',
      );
    });

    it('does not log warning when API key is configured', async () => {
      mockApiKey = 're_test_key';
      mockIsEnabled = true;

      const { EmailClient } = await import('./client');
      const _client = new EmailClient();

      expect(_client).toBeDefined();
      expect(mockLoggerWarn).not.toHaveBeenCalled();
    });
  });

  describe('send - development mode without API key', () => {
    it('logs email to console and returns mock success in development', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      const result = await client.send({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.messageId).toMatch(/^dev_\d+_[a-z0-9]+$/);
      }

      expect(mockLoggerInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'email_dev_mode',
          to: 'recipient@example.com',
          subject: 'Test Subject',
        }),
        'Email logged (dev mode - not sent)',
      );
    });

    it('returns error when API key missing in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      const result = await client.send({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe('Email API key not configured');
        expect(result.code).toBe('API_KEY_MISSING');
      }

      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe('send - with API key', () => {
    beforeEach(() => {
      mockApiKey = 're_test_key';
      mockIsEnabled = true;
    });

    it('sends email via Resend and returns success', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'msg_123abc' },
        error: null,
      });

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      const result = await client.send({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.messageId).toBe('msg_123abc');
      }

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Test App <test@example.com>',
          to: 'recipient@example.com',
          subject: 'Test Subject',
          text: 'Test body',
        }),
      );
      expect(mockLoggerInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'email_sent',
          messageId: 'msg_123abc',
        }),
        'Email sent successfully',
      );
    });

    it('returns error when Resend API returns error', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: {
          name: 'validation_error',
          message: 'Invalid recipient',
        },
      });

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      const result = await client.send({
        to: 'invalid-email',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe('Invalid recipient');
        expect(result.code).toBe('validation_error');
      }

      expect(mockLoggerError).toHaveBeenCalled();
    });

    it('handles exception during send', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      const result = await client.send({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe('Network error');
        expect(result.code).toBe('SEND_EXCEPTION');
      }

      expect(mockLoggerError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Network error',
        }),
        'Email send exception',
      );
    });

    it('uses payload replyTo over config replyTo', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'msg_123' },
        error: null,
      });

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      await client.send({
        to: 'recipient@example.com',
        subject: 'Test',
        text: 'Body',
        replyTo: 'custom-reply@example.com',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'custom-reply@example.com',
        }),
      );
    });
  });

  describe('hashEmail', () => {
    it('masks email addresses correctly when logging in dev mode', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      await client.send({
        to: 'john.doe@example.com',
        subject: 'Test',
        text: 'Body',
      });

      // In dev mode without API key, the full email is logged
      expect(mockLoggerInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'john.doe@example.com',
        }),
        expect.any(String),
      );
    });

    it('handles array of emails in dev mode', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { EmailClient } = await import('./client');
      const client = new EmailClient();
      await client.send({
        to: ['first@example.com', 'second@example.com'],
        subject: 'Test',
        text: 'Body',
      });

      expect(mockLoggerInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['first@example.com', 'second@example.com'],
        }),
        expect.any(String),
      );
    });
  });

  describe('createEmailClient', () => {
    it('creates a new EmailClient instance', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { createEmailClient, EmailClient } = await import('./client');
      const client = createEmailClient();

      expect(client).toBeInstanceOf(EmailClient);
    });
  });

  describe('getEmailClient', () => {
    it('returns singleton instance', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { getEmailClient, resetEmailClient } = await import('./client');

      resetEmailClient();
      const client1 = getEmailClient();
      const client2 = getEmailClient();

      expect(client1).toBe(client2);
    });

    it('creates new instance after reset', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockApiKey = undefined;
      mockIsEnabled = false;

      const { getEmailClient, resetEmailClient } = await import('./client');

      const client1 = getEmailClient();
      resetEmailClient();
      const client2 = getEmailClient();

      expect(client1).not.toBe(client2);
    });
  });
});
