import type { ReactElement } from 'react';

import { getEmailClient } from './client';
import type { EmailSendResult, EmailTag } from './types';

/**
 * Send an email with React Email template
 *
 * @param to - Recipient email address(es)
 * @param subject - Email subject line
 * @param template - React Email component
 * @param options - Optional settings (replyTo, cc, bcc, tags)
 * @returns Email send result
 *
 * @example
 * ```typescript
 * const result = await sendEmail(
 *   'user@example.com',
 *   'Welcome!',
 *   <WelcomeEmail name="John" />
 * );
 * ```
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  template: ReactElement,
  options?: {
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    tags?: EmailTag[];
  },
): Promise<EmailSendResult> {
  return getEmailClient().send({
    to,
    subject,
    react: template,
    ...options,
  });
}

/**
 * Send a plain text email (no template)
 *
 * @param to - Recipient email address(es)
 * @param subject - Email subject line
 * @param text - Plain text content
 * @param html - Optional HTML content
 * @returns Email send result
 */
export async function sendPlainEmail(
  to: string | string[],
  subject: string,
  text: string,
  html?: string,
): Promise<EmailSendResult> {
  return getEmailClient().send({
    to,
    subject,
    text,
    html,
  });
}
