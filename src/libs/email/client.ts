import { Resend } from 'resend';

import { logger } from '../Logger';
import { EMAIL_CONFIG, getFromAddress, isEmailEnabled } from './config';
import type { EmailPayload, EmailSendResult } from './types';

/**
 * Email Client
 * Abstracts email provider (currently Resend) with development fallback
 */
export class EmailClient {
  private readonly resend: Resend | null;
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';

    if (isEmailEnabled()) {
      this.resend = new Resend(EMAIL_CONFIG.apiKey);
    } else {
      this.resend = null;
      if (this.isDevelopment) {
        logger.warn('Email API key not configured - emails will be logged to console');
      }
    }
  }

  /**
   * Send an email
   * In development without API key: logs email to console
   * In production without API key: returns error
   */
  async send(payload: EmailPayload): Promise<EmailSendResult> {
    const from = getFromAddress();
    const replyTo = payload.replyTo || EMAIL_CONFIG.replyTo;

    // Development mode without API key: log to console
    if (!this.resend) {
      return this.handleDevModeSend(payload, from, replyTo);
    }

    // Production mode: send via Resend
    return this.handleResendSend(payload, from, replyTo);
  }

  /**
   * Development mode: log email to console instead of sending
   */
  private handleDevModeSend(
    payload: EmailPayload,
    from: string,
    replyTo?: string,
  ): EmailSendResult {
    if (!this.isDevelopment) {
      logger.error({ payload }, 'Email sending failed: API key not configured');
      return {
        success: false,
        error: 'Email API key not configured',
        code: 'API_KEY_MISSING',
      };
    }

    // Log email details for development
    logger.info({
      type: 'email_dev_mode',
      from,
      to: payload.to,
      subject: payload.subject,
      replyTo,
      hasReact: !!payload.react,
      hasHtml: !!payload.html,
      hasText: !!payload.text,
    }, 'Email logged (dev mode - not sent)');

    // Return mock success with fake message ID
    return {
      success: true,
      messageId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  /**
   * Production mode: send via Resend API
   */
  private async handleResendSend(
    payload: EmailPayload,
    from: string,
    replyTo?: string,
  ): Promise<EmailSendResult> {
    try {
      const { data, error } = await this.resend!.emails.send({
        from,
        to: payload.to,
        subject: payload.subject,
        react: payload.react,
        html: payload.html,
        text: payload.text,
        replyTo,
        cc: payload.cc,
        bcc: payload.bcc,
        tags: payload.tags,
      });

      if (error) {
        logger.error({
          error,
          to: this.hashEmail(payload.to),
          subject: payload.subject,
        }, 'Email send failed');

        return {
          success: false,
          error: error.message,
          code: error.name,
        };
      }

      logger.info({
        type: 'email_sent',
        messageId: data?.id,
        to: this.hashEmail(payload.to),
        subject: payload.subject,
      }, 'Email sent successfully');

      return {
        success: true,
        messageId: data?.id || 'unknown',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      logger.error({
        error: errorMessage,
        to: this.hashEmail(payload.to),
        subject: payload.subject,
      }, 'Email send exception');

      return {
        success: false,
        error: errorMessage,
        code: 'SEND_EXCEPTION',
      };
    }
  }

  /**
   * Hash email for logging (privacy)
   */
  private hashEmail(email: string | string[]): string {
    const addr = Array.isArray(email) ? email[0] : email;
    if (!addr) {
      return 'unknown';
    }

    const [local, domain] = addr.split('@');
    if (!local || !domain) {
      return 'invalid';
    }

    const maskedLocal = `${local.substring(0, 2)}***`;
    return `${maskedLocal}@${domain}`;
  }
}

/**
 * Create email client instance
 */
export function createEmailClient(): EmailClient {
  return new EmailClient();
}

/**
 * Singleton email client for convenience
 */
let emailClient: EmailClient | null = null;

export function getEmailClient(): EmailClient {
  if (!emailClient) {
    emailClient = createEmailClient();
  }
  return emailClient;
}

/**
 * Reset singleton (for testing)
 */
export function resetEmailClient(): void {
  emailClient = null;
}
