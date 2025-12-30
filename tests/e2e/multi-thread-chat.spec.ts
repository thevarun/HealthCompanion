import { expect, test } from '@playwright/test';

/**
 * Multi-Thread Chat Flow E2E Test
 * AC #8: Full chat flow works with threading (send message, switch thread, verify isolation)
 *
 * Tests:
 * - Thread creation on first message
 * - Multiple thread creation
 * - Thread switching
 * - Message isolation between threads
 */

test.describe('Multi-Thread Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page (requires authentication setup in playwright config)
    await page.goto('/chat');
    await page.waitForLoadState('domcontentloaded');
  });

  test('AC #8.2: User sends message creates thread in sidebar', async ({ page }) => {
    // Wait for empty state
    await expect(page.getByText('Start your first conversation')).toBeVisible();

    // Send first message (will create new thread)
    const composer = page.getByTestId('composer-input');
    await composer.fill('Hello, this is my first message');
    await page.getByRole('button', { name: 'Send' }).click();

    // Wait for response streaming
    await page.waitForTimeout(2000);

    // Verify thread appears in sidebar
    // Note: This test assumes thread title will be auto-generated or show preview
    const sidebar = page.locator('[data-testid="thread-list"]').first();

    await expect(sidebar).toContainText(/Hello/i, { timeout: 10000 });
  });

  test('AC #8.3, #8.4: Create second thread and send message', async ({ page }) => {
    // Create first thread
    await page.getByTestId('composer-input').fill('First thread message');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Click "New Thread" button
    await page.getByRole('button', { name: /new.*thread/i }).click();

    // Verify empty state shown
    await expect(page.getByText('Start your first conversation')).toBeVisible();

    // Send message in second thread
    await page.getByTestId('composer-input').fill('Second thread message');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Verify second thread appears in sidebar
    const sidebar = page.locator('[data-testid="thread-list"]').first();

    await expect(sidebar).toContainText(/Second thread/i, { timeout: 10000 });
  });

  test('AC #8.5, #8.6, #8.7: Thread isolation - messages dont leak', async ({ page }) => {
    // Create first thread
    await page.getByTestId('composer-input').fill('Message A in thread 1');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Create second thread
    await page.getByRole('button', { name: /new.*thread/i }).click();
    await page.getByTestId('composer-input').fill('Message B in thread 2');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // AC #8.5: Switch back to first thread via sidebar
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // AC #8.6, #8.7: Verify isolation
    // First thread should show Message A, not Message B
    await expect(page.locator('[data-message-role="user"]')).toContainText('Message A');
    await expect(page.locator('[data-message-role="user"]')).not.toContainText('Message B');

    // Switch to second thread
    const secondThread = page.locator('[data-testid="thread-item"]').nth(1);
    await secondThread.click();

    // Second thread should show Message B, not Message A
    await expect(page.locator('[data-message-role="user"]')).toContainText('Message B');
    await expect(page.locator('[data-message-role="user"]')).not.toContainText('Message A');
  });

  test('Thread title editing works', async ({ page }) => {
    // Create thread
    await page.getByTestId('composer-input').fill('Test message for title');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Click on thread title to edit
    const threadTitle = page.locator('[data-testid="thread-title"]').first();
    await threadTitle.click();

    // Edit title
    const titleInput = page.locator('input[type="text"]').first();
    await titleInput.fill('My Custom Thread Title');
    await titleInput.press('Enter');

    // Verify title updated
    await expect(page.locator('[data-testid="thread-title"]').first()).toContainText(
      'My Custom Thread Title',
      { timeout: 5000 },
    );
  });

  test('Thread metadata updates after message', async ({ page }) => {
    // Create thread
    await page.getByTestId('composer-input').fill('Initial message');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(2000);

    // Navigate to thread
    await page.locator('[data-testid="thread-item"]').first().click();

    // Send another message
    await page.getByTestId('composer-input').fill('Second message in thread');
    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(3000);

    // Verify thread preview updated in sidebar (within 10s due to polling)
    const threadPreview = page.locator('[data-testid="thread-preview"]').first();

    await expect(threadPreview).toContainText(/Second message/i, { timeout: 15000 });
  });

  test('Streaming responses work correctly', async ({ page }) => {
    // Send message
    await page.getByTestId('composer-input').fill('Tell me a short joke');
    await page.getByRole('button', { name: 'Send' }).click();

    // Verify streaming indicator appears
    // Note: This might need adjustment based on actual UI implementation
    await page.waitForTimeout(1000);

    // Verify assistant message appears
    await expect(page.locator('[data-message-role="assistant"]').first()).toBeVisible({
      timeout: 15000,
    });

    // Verify message has content
    const assistantMessage = page.locator('[data-message-role="assistant"]').first();

    // Locators don't expose length; assert non-empty text directly
    await expect(assistantMessage).toHaveText(/.+/);
  });
});
