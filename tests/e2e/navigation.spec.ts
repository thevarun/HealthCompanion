/**
 * E2E Tests for Main Navigation Consistency (Story 3.7)
 *
 * These tests verify that the main navigation sidebar appears consistently
 * across all authenticated routes (/dashboard, /chat, /chat/[threadId]).
 *
 * Regression prevented:
 * - Main navigation missing on /chat route
 * - Inconsistent navigation between routes
 * - Navigation items not matching across routes
 */

import { expect, test } from './helpers/fixtures';

test.describe('Main Navigation Consistency', () => {
  test.describe('Desktop Navigation Sidebar', () => {
    test('main navigation sidebar appears on dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/dashboard');

      // Main navigation sidebar should be visible
      const sidebar = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"]');

      await expect(sidebar).toBeVisible();

      // Should have navigation items
      const navItems = sidebar.locator('nav a');
      const itemCount = await navItems.count();

      expect(itemCount).toBeGreaterThan(0);
    });

    test('main navigation sidebar appears on /chat', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');

      // Main navigation sidebar should be visible (same as dashboard)
      const sidebar = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"]');

      await expect(sidebar).toBeVisible();

      // Should have navigation items
      const navItems = sidebar.locator('nav a');
      const itemCount = await navItems.count();

      expect(itemCount).toBeGreaterThan(0);
    });

    test('navigation items are consistent between routes', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });

      // Get nav items from dashboard
      await authenticatedPage.goto('/dashboard');
      const dashboardNav = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] nav');

      await expect(dashboardNav).toBeVisible();

      const dashboardItems = await dashboardNav.locator('a').allTextContents();

      // Get nav items from chat
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');
      const chatNav = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] nav');

      await expect(chatNav).toBeVisible();

      const chatItems = await chatNav.locator('a').allTextContents();

      // Navigation items should be the same on both pages
      expect(dashboardItems.sort()).toEqual(chatItems.sort());
    });

    test('Chat nav item is active on /chat route', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');

      // Chat nav item should have active state (aria-current="page")
      const chatNavItem = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] a[aria-current="page"]');

      await expect(chatNavItem).toBeVisible();

      const text = await chatNavItem.textContent();

      expect(text?.toLowerCase()).toContain('chat');
    });

    test('Dashboard nav item is active on /dashboard route', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/dashboard');

      // Dashboard nav item should have active state (aria-current="page")
      const dashboardNavItem = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] a[aria-current="page"]');

      await expect(dashboardNavItem).toBeVisible();

      const text = await dashboardNavItem.textContent();

      expect(text?.toLowerCase()).toContain('dashboard');
    });
  });

  test.describe('Mobile Navigation', () => {
    test('mobile hamburger menu appears on dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 667 });
      await authenticatedPage.goto('/dashboard');

      // Mobile hamburger button should be visible
      const hamburger = authenticatedPage.locator('button[aria-label="Open navigation menu"]');

      await expect(hamburger).toBeVisible();
    });

    test('mobile hamburger menu appears on /chat', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 667 });
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');

      // Mobile hamburger button should be visible (same as dashboard)
      const hamburger = authenticatedPage.locator('button[aria-label="Open navigation menu"]');

      await expect(hamburger).toBeVisible();
    });

    test('mobile navigation opens and shows nav items', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 667 });
      await authenticatedPage.goto('/dashboard');

      // Click hamburger to open navigation
      const hamburger = authenticatedPage.locator('button[aria-label="Open navigation menu"]');
      await hamburger.click();

      // Navigation sheet should be visible with items
      const navSheet = authenticatedPage.locator('[role="dialog"] nav, [data-state="open"] nav');

      await expect(navSheet).toBeVisible();

      // Should have navigation items
      const navItems = navSheet.locator('a');
      const itemCount = await navItems.count();

      expect(itemCount).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation Between Routes', () => {
    test('can navigate from dashboard to chat via sidebar', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/dashboard');

      // Find and click Chat link in main navigation
      const chatLink = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] a:has-text("Chat")');
      await chatLink.click();

      // Should be on chat page
      await expect(authenticatedPage).toHaveURL(/\/chat/);

      // Main nav sidebar should still be visible
      const sidebar = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"]');

      await expect(sidebar).toBeVisible();
    });

    test('can navigate from chat to dashboard via sidebar', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');

      // Find and click Dashboard link in main navigation
      const dashboardLink = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"] a:has-text("Dashboard")');
      await dashboardLink.click();

      // Should be on dashboard page
      await expect(authenticatedPage).toHaveURL(/\/dashboard/);

      // Main nav sidebar should still be visible
      const sidebar = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"]');

      await expect(sidebar).toBeVisible();
    });
  });

  test.describe('Two-Level Navigation on Chat', () => {
    test('chat page shows both main nav and thread sidebar', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await authenticatedPage.goto('/chat');
      await authenticatedPage.waitForLoadState('load');

      // Main navigation sidebar should be visible (left-most)
      const mainNav = authenticatedPage.locator('aside[aria-label="Main navigation sidebar"]');

      await expect(mainNav).toBeVisible();

      // Thread list sidebar (AppShell) should also be visible
      // Look for the thread list container or new thread button
      const threadSidebar = authenticatedPage.locator('[data-testid="thread-list"], button:has-text("New Thread"), button:has-text("New Chat")');
      const count = await threadSidebar.count();

      expect(count).toBeGreaterThan(0);
    });
  });
});
