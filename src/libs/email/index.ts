/**
 * Email Module
 *
 * Usage:
 * ```typescript
 * import { getEmailClient, type EmailPayload } from '@/libs/email';
 *
 * const result = await getEmailClient().send({
 *   to: 'user@example.com',
 *   subject: 'Hello',
 *   react: <WelcomeEmail name="John" />,
 * });
 *
 * if (result.success) {
 *   console.log('Sent:', result.messageId);
 * } else {
 *   console.error('Failed:', result.error);
 * }
 * ```
 */

// Client
export { createEmailClient, EmailClient, getEmailClient, resetEmailClient } from './client';

// Configuration
export { EMAIL_CONFIG, getFromAddress, isEmailEnabled } from './config';

// Helpers
export { sendEmail, sendPlainEmail } from './sendEmail';
export { sendWelcomeEmail } from './sendWelcomeEmail';

// Types
export type {
  BaseTemplateData,
  EmailConfig,
  EmailPayload,
  EmailSendFailure,
  EmailSendResult,
  EmailSendSuccess,
  EmailTag,
  WelcomeEmailData,
} from './types';
