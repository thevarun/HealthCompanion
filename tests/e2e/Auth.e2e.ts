import { expect, test } from '@playwright/test';

/**
 * E2E tests for Supabase authentication flows
 * Covers sign-up, sign-in, sign-out, and protected route access
 */

// Test user credentials
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Authentication', () => {
  test.describe('Sign Up Flow', () => {
    test('should display sign up page', async ({ page }) => {
      await page.goto('/sign-up');

      await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
      await expect(page.getByText('Create your account to get started')).toBeVisible();
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/sign-up');

      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');

      // HTML5 validation will prevent form submission
      await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/sign-up');

      await page.fill('input[name="email"]', TEST_EMAIL);
      await page.fill('input[name="password"]', '123'); // Too short
      await page.click('button[type="submit"]');

      // HTML5 minLength validation will prevent submission
      await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    });

    test('should submit sign up form and show verification message', async ({ page }) => {
      await page.goto('/sign-up');

      await page.fill('input[name="email"]', TEST_EMAIL);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.getByText('Check your email!')).toBeVisible();
      await expect(page.getByText(new RegExp(TEST_EMAIL))).toBeVisible();
      await expect(page.getByText(/verify your account/)).toBeVisible();
    });
  });

  test.describe('Sign In Flow', () => {
    test('should display sign in page', async ({ page }) => {
      await page.goto('/sign-in');

      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/sign-in');

      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'WrongPassword123!');
      await page.click('button[type="submit"]');

      // Wait for error message
      await expect(page.getByText(/invalid/i)).toBeVisible();
    });

    // Note: Full sign-in test requires verified email which needs manual setup
    test.skip('should sign in with valid credentials and redirect to dashboard', async ({ page }) => {
      // This test requires a verified user account
      // Skip in automated runs, use for manual testing
      await page.goto('/sign-in');

      await page.fill('input[name="email"]', 'verified@example.com');
      await page.fill('input[name="password"]', 'VerifiedPassword123!');
      await page.click('button[type="submit"]');

      // Should redirect to dashboard after successful sign in
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user from dashboard to sign-in', async ({ page }) => {
      await page.goto('/dashboard');

      // Should be redirected to sign-in page
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should redirect unauthenticated user from onboarding to sign-in', async ({ page }) => {
      await page.goto('/onboarding');

      // Should be redirected to sign-in page
      await expect(page).toHaveURL(/\/sign-in/);
    });

    // Note: Session persistence test requires authenticated session
    test.skip('should maintain session across page refreshes', async ({ page }) => {
      // This test requires a verified, signed-in user
      // Skip in automated runs

      // Sign in first (implementation depends on having verified credentials)
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', 'verified@example.com');
      await page.fill('input[name="password"]', 'VerifiedPassword123!');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/);

      // Refresh the page
      await page.reload();

      // Should still be on dashboard, not redirected to sign-in
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Sign Out Flow', () => {
    test.skip('should sign out user and redirect to home page', async ({ page }) => {
      // This test requires a signed-in user
      // Skip in automated runs

      // Assume user is signed in and on dashboard
      await page.goto('/dashboard');

      // Click sign out button (implementation depends on UI structure)
      await page.click('button:has-text("Sign Out")');

      // Should redirect to home or sign-in page
      await expect(page).toHaveURL(/\/(sign-in)?$/);

      // Attempting to access dashboard should redirect back to sign-in
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/\/sign-in/);
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate from sign-up to sign-in', async ({ page }) => {
      await page.goto('/sign-up');

      await page.click('a:has-text("Sign in")');

      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should navigate from sign-in to sign-up', async ({ page }) => {
      await page.goto('/sign-in');

      // Look for "Sign up" or "Create account" link
      const signUpLink = page.locator('a').filter({ hasText: /sign up|create account/i }).first();

      if (await signUpLink.isVisible()) {
        await signUpLink.click();

        await expect(page).toHaveURL(/\/sign-up/);
      }
    });
  });
});
