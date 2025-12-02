# Testing Approach

**Comprehensive Testing Strategy:**

**1. Unit Tests (Vitest + React Testing Library)**

**Coverage Target:** 80% for business logic

**Test Scope:**
- Utility functions (formatters, validators)
- Supabase client utilities
- Dify client wrapper
- React components (isolated)
- Drizzle schema definitions

**Mock Strategy:**
- Mock Supabase client: `vi.mock('@/lib/supabase/client')`
- Mock Dify client: `vi.mock('@/lib/dify/client')`
- Mock Next.js router: `vi.mock('next/navigation')`

**Example Tests:**
```tsx
// Dify client test
describe('DifyClient', () => {
  it('should send chat message with correct format', () => {
    const client = new DifyClient('test-key');
    const message = client.formatMessage('Hello', 'user-123');

    expect(message).toMatchObject({
      query: 'Hello',
      user: 'user-123',
      response_mode: 'streaming',
    });
  });
});

// Component test
describe('ChatInput', () => {
  it('should call onSend with message when submitted', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(onSend).toHaveBeenCalledWith('Test message');
  });
});
```

**2. Integration Tests (Vitest + MSW)**

**Coverage Target:** All API routes and critical integrations

**Test Scope:**
- API routes (/api/chat, /api/chat/workflows)
- Database operations (Drizzle queries)
- Authentication flow (Supabase integration)
- External API calls (Dify, mocked)

**Mock Strategy:**
- Use MSW (Mock Service Worker) for API mocking
- Mock Supabase Auth responses
- Mock Dify API responses

**Example Tests:**
```typescript
// API route test
describe('POST /api/chat', () => {
  beforeAll(() => {
    server.listen(); // MSW server
  });

  it('returns 401 without authentication', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      }),
    );

    expect(response.status).toBe(401);
  });
});
```

**3. E2E Tests (Playwright)**

**Coverage Target:** All critical user flows

**Test Scope:**
- Complete authentication flows
- Chat interaction flows
- Workflow execution flows
- Responsive design verification
- Error handling scenarios

**Test Environments:**
- Desktop (Chrome, Firefox, Safari)
- Mobile (iPhone, Android emulators)
- Tablet (iPad simulator)

**Example Tests:**
```typescript
test('user can complete full chat flow', async ({ page }) => {
  // 1. Sign in
  await page.goto('/sign-in');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Test123!');
  await page.click('button[type="submit"]');

  // 2. Navigate to chat
  await expect(page).toHaveURL('/chat');

  // 3. Send message
  const input = page.locator('[data-testid="chat-input"]');
  await input.fill('What are good protein sources?');
  await page.click('[data-testid="send-button"]');

  // 4. Wait for streaming response
  const aiMessage = page.locator('[data-testid="ai-message"]').last();

  await expect(aiMessage).toBeVisible({ timeout: 10000 });
  await expect(aiMessage).toContainText(/protein/);

  // 5. Verify message in history
  const messages = page.locator('[data-testid="message"]');

  await expect(messages).toHaveCount(2); // User + AI
});

test('workflow trigger works correctly', async ({ page }) => {
  await authenticateUser(page);
  await page.goto('/chat');

  // Open workflow menu
  await page.click('[data-testid="workflows-button"]');

  // Select workflow
  await page.click('[data-testid="workflow-goal-setting"]');

  // Verify workflow execution
  await expect(page.locator('[data-testid="workflow-result"]'))
    .toBeVisible({ timeout: 15000 });
});
```

**4. Visual Regression Tests (Percy - Optional)**

**Test Scope:**
- Chat interface layouts
- Workflow modals
- Auth pages
- Responsive breakpoints

**5. Performance Tests**

**Metrics:**
- Initial page load: < 3 seconds
- Time to interactive: < 2 seconds
- Chat response start: < 1 second
- Streaming latency: < 100ms per chunk

**Tools:**
- Lighthouse CI in GitHub Actions
- Core Web Vitals monitoring
- Custom performance marks in code

**6. Security Tests**

**Test Scope:**
- API authentication checks
- SQL injection prevention (Drizzle)
- XSS prevention (React escapes by default)
- CSRF protection (Supabase tokens)
- Rate limiting verification

**7. Accessibility Tests**

**Tools:**
- axe-core (automated)
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)

**CI/CD Integration:**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---
