import { sendEmail } from './sendEmail';
import { WelcomeEmail } from './templates/WelcomeEmail';
import type { EmailSendResult } from './types';

/**
 * Send welcome email to a new user
 *
 * @param email - Recipient email address
 * @param name - Optional user name for personalization
 * @returns Email send result
 *
 * @example
 * ```typescript
 * // Fire and forget (don't block user flow)
 * sendWelcomeEmail(user.email, user.name)
 *   .catch(err => console.error('Failed to send welcome email:', err));
 *
 * // Await result
 * const result = await sendWelcomeEmail('user@example.com', 'John');
 * if (result.success) {
 *   console.log('Welcome email sent:', result.messageId);
 * }
 * ```
 */
export async function sendWelcomeEmail(
  email: string,
  name?: string,
): Promise<EmailSendResult> {
  const appName = process.env.EMAIL_FROM_NAME || 'VT SaaS Template';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return sendEmail(
    email,
    `Welcome to ${appName}!`,
    <WelcomeEmail
      recipientEmail={email}
      recipientName={name}
      appName={appName}
      appUrl={appUrl}
    />,
    {
      tags: [{ name: 'type', value: 'welcome' }],
    },
  );
}
