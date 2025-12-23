/**
 * Playwright fixtures for authenticated test scenarios
 * Provides reusable authenticated context for tests
 */

import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

/**
 * Extended Playwright test with authenticated page fixture
 * Usage: test('my test', async ({ authenticatedPage }) => { ... })
 */
export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Get test credentials from setup.ts
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      throw new Error('Test credentials not found. Ensure setup.ts ran successfully.');
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Sign in to get session
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error || !data.session) {
      throw new Error(`Authentication failed: ${error?.message || 'No session returned'}`);
    }

    // Set session cookies in the browser context
    // Supabase uses these cookie names for SSR auth
    await page.context().addCookies([
      {
        name: 'sb-access-token',
        value: data.session.access_token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + data.session.expires_in,
      },
      {
        name: 'sb-refresh-token',
        value: data.session.refresh_token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
    ]);

    // Page is now authenticated - use it in the test
    await use(page);

    // Cleanup: Sign out after test
    await supabase.auth.signOut();
  },
});

export { expect } from '@playwright/test';
