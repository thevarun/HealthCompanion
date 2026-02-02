import type { User } from '@supabase/supabase-js';

/**
 * Determines the status of a user based on their Supabase auth data.
 *
 * Status logic:
 * - suspended: User has banned_until set (any date)
 * - pending: Email not confirmed (email_confirmed_at is null)
 * - active: All other cases
 */
export function getUserStatus(user: User): 'active' | 'suspended' | 'pending' {
  // Check for ban (suspended status)
  if (user.banned_until) {
    return 'suspended';
  }

  // Check for pending email verification
  if (!user.email_confirmed_at) {
    return 'pending';
  }

  // Default to active
  return 'active';
}

/**
 * Gets user initials from email and/or username.
 * Priority: username > email
 * Returns first 2 characters, uppercase.
 */
export function getUserInitials(email?: string | null, username?: string | null): string {
  if (username && username.length > 0) {
    return username.substring(0, 2).toUpperCase();
  }
  if (email && email.length > 0) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'U?';
}
