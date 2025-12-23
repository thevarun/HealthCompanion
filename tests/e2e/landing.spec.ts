import { test } from '@playwright/test';

import { expect, test as authenticatedTest } from './helpers/fixtures';

/**
 * E2E Tests for Landing Page (Story 2.3)
 * Tests landing page auth state detection (AC #11-12)
 */

test.describe('Landing Page', () => {
  test.describe('Logged-out State (AC #11)', () => {
    test('displays sign in and sign up buttons when not authenticated', async ({ page }) => {
      await page.goto('/');

      // Should show sign-in button
      const signInButton = page.locator('a[href*="/sign-in"], button:has-text("Sign In")').first();

      await expect(signInButton).toBeVisible();

      // Should show sign-up button
      const signUpButton = page.locator('a[href*="/sign-up"], button:has-text("Sign Up")').first();

      await expect(signUpButton).toBeVisible();

      // Dashboard button should NOT be visible
      const dashboardButton = page.locator('a[href*="/dashboard"], button:has-text("Dashboard")');

      await expect(dashboardButton).toBeHidden();
    });

    test('sign in button navigates to sign-in page', async ({ page }) => {
      await page.goto('/');

      const signInButton = page.locator('a[href*="/sign-in"], button:has-text("Sign In")').first();
      await signInButton.click();

      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('sign up button navigates to sign-up page', async ({ page }) => {
      await page.goto('/');

      const signUpButton = page.locator('a[href*="/sign-up"], button:has-text("Sign Up")').first();
      await signUpButton.click();

      await expect(page).toHaveURL(/\/sign-up/);
    });
  });

  test.describe('Logged-in State (AC #12)', () => {
    authenticatedTest('displays dashboard button when authenticated', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Dashboard button should be visible
      const dashboardButton = authenticatedPage.locator('a[href*="/dashboard"], button:has-text("Dashboard")').first();

      // eslint-disable-next-line playwright/no-standalone-expect
      await expect(dashboardButton).toBeVisible();

      // Sign-in and sign-up buttons should be hidden
      const signInButton = authenticatedPage.locator('a[href*="/sign-in"]:visible, button:has-text("Sign In"):visible');
      const signUpButton = authenticatedPage.locator('a[href*="/sign-up"]:visible, button:has-text("Sign Up"):visible');

      // Note: Buttons may exist in DOM but hidden via CSS
      const signInCount = await signInButton.count();
      const signUpCount = await signUpButton.count();

      // eslint-disable-next-line playwright/no-standalone-expect
      expect(signInCount).toBe(0);
      // eslint-disable-next-line playwright/no-standalone-expect
      expect(signUpCount).toBe(0);
    });

    authenticatedTest('dashboard button navigates to dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      const dashboardButton = authenticatedPage.locator('a[href*="/dashboard"], button:has-text("Dashboard")').first();
      await dashboardButton.click();

      // eslint-disable-next-line playwright/no-standalone-expect
      await expect(authenticatedPage).toHaveURL(/\/dashboard/);
    });
  });

  // test.describe('Branding and Content', () => {
  //   test('displays HealthCompanion branding', async ({ page }) => {
  //     await page.goto('/');

  //     // Should display project name (from Story 2.2 - AppConfig updated)
  //     const appName = page.getByTestId('app-name');

  //     await expect(appName).toContainText('Health');
  //   });

  //   test('no sponsor logos or demo badges visible', async ({ page }) => {
  //     await page.goto('/');

  //     // From Story 2.2 - sponsors and demo banners removed
  //     const sponsorLogos = page.locator('[data-testid="sponsors"], .sponsor-logo');
  //     const demoBadges = page.locator('[data-testid="demo-badge"], .demo-banner');

  //     expect(await sponsorLogos.count()).toBe(0);
  //     expect(await demoBadges.count()).toBe(0);
  //   });
  // });
});
