# Implementation Guide

## Setup Steps

**Pre-implementation Checklist:**

- [ ] Supabase project created and credentials available
- [ ] Dify Cloud account created with API key
- [ ] GitHub repository initialized
- [ ] Local development environment ready (Node.js 20.x, Docker)
- [ ] SaaS boilerplate cloned
- [ ] All team members have access to Supabase and Dify dashboards

**Story-by-Story Setup:**

**Before Story 1 (Supabase Auth Migration):**
- Create feature branch: `git checkout -b feat/supabase-auth`
- Install Supabase packages
- Set up environment variables
- Review Clerk implementation in boilerplate

**Before Story 2 (Dify Proxy):**
- Ensure Story 1 merged to main
- Create feature branch: `git checkout -b feat/dify-proxy`
- Install dify-client package
- Set up Dify API credentials
- Test Dify API access with curl

**Before Story 3 (Chat UI):**
- Ensure Story 2 merged to main
- Create feature branch: `git checkout -b feat/chat-ui`
- Install Assistant-UI package
- Review Assistant-UI documentation

**Before Story 4 (Knowledge Base):**
- Gather health coach content (documents, FAQs, methodology)
- Prepare content in digestible format (MD, PDF, TXT)
- Create feature branch for any app-side KB integration

**Before Story 5 (Workflows):**
- Define workflow requirements with health coach
- Create feature branch: `git checkout -b feat/workflows`
- Design workflow UI components

## Implementation Steps

**High-Level Implementation Phases:**

**Phase 1: Foundation (Story 1)**
1. Remove Clerk dependencies from package.json
2. Install Supabase packages
3. Create Supabase client utilities (lib/supabase/client.ts, server.ts)
4. Replace middleware.ts with Supabase session handling
5. Update auth pages (sign-in, sign-up, sign-out)
6. Replace all Clerk hooks with Supabase equivalents
7. Test auth flow end-to-end
8. Update E2E tests for new auth

**Phase 2: Backend Infrastructure (Story 2)**
1. Install dify-client package
2. Create Dify client wrapper (lib/dify/client.ts)
3. Implement /api/chat route with session validation
4. Set up SSE streaming from Dify
5. Add error handling and logging
6. Write integration tests for proxy
7. Test with Postman/curl

**Phase 3: User Interface (Story 3)**
1. Install Assistant-UI package
2. Create chat page layout (app/[locale]/(chat)/page.tsx)
3. Integrate Assistant-UI Thread component
4. Connect to /api/chat endpoint
5. Add loading states and error handling
6. Style with Tailwind/Shadcn UI
7. Make responsive (mobile, tablet, desktop)
8. Add E2E tests for chat interaction

**Phase 4: Content & Intelligence (Story 4)**
1. Prepare knowledge base content
2. Upload to Dify dashboard (Knowledge Base section)
3. Configure chunking and embedding settings
4. Test knowledge retrieval in Dify playground
5. Fine-tune agent prompts and persona
6. Validate responses align with health coach expertise

**Phase 5: Workflows (Story 5)**
1. Design workflows in Dify workflow builder
2. Create workflow trigger UI components
3. Implement /api/chat/workflows endpoint
4. Add workflow selection menu to chat interface
5. Handle workflow parameters and results
6. Test each workflow end-to-end
7. Document workflow usage for users

## Testing Strategy

**Unit Testing:**

**Target:** 80% coverage for business logic

**Focus Areas:**
- Supabase client utilities (lib/supabase/*)
- Dify client wrapper (lib/dify/client.ts)
- Utility functions
- Drizzle schema validation

**Example:**
```typescript
describe('Dify Client', () => {
  it('should format chat message correctly', () => {
    const client = new DifyClient(API_KEY)
    const formatted = client.formatMessage('Hello', 'user-123')
    expect(formatted).toHaveProperty('query', 'Hello')
    expect(formatted).toHaveProperty('user', 'user-123')
  })
})
```

**Integration Testing:**

**Target:** All API routes

**Focus Areas:**
- /api/chat - Complete flow with mocked Dify
- /api/chat/workflows - Workflow trigger flow
- Auth endpoints (if custom beyond Supabase)
- Database operations

**Example:**
```typescript
describe('POST /api/chat', () => {
  it('should return 401 without valid session', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    })
    expect(response.status).toBe(401)
  })

  it('should proxy to Dify with valid session', async () => {
    // Mock Supabase session
    // Mock Dify response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { Cookie: validSessionCookie },
      body: JSON.stringify({ message: 'Hello' }),
    })
    expect(response.ok).toBe(true)
  })
})
```

**E2E Testing (Playwright):**

**Critical User Flows:**
1. Sign up → Email verification → Onboarding → First chat
2. Sign in → Load previous conversations → Send message
3. Trigger workflow → Complete steps → View results
4. Sign out → Redirected to landing page

**Example:**
```typescript
test('complete chat flow', async ({ page }) => {
  // Sign in
  await page.goto('/sign-in')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  // Navigate to chat
  await expect(page).toHaveURL('/chat')

  // Send message
  await page.fill('[data-testid="chat-input"]', 'What are healthy breakfast options?')
  await page.click('[data-testid="send-button"]')

  // Verify response
  await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('[data-testid="ai-response"]')).not.toBeEmpty()
})
```

**Manual Testing Checklist:**

- [ ] Auth: Sign up, sign in, sign out, password reset
- [ ] Chat: Send message, receive response, streaming works
- [ ] Chat: Conversation history persists
- [ ] Workflows: Each workflow triggers and completes
- [ ] Responsive: Mobile, tablet, desktop layouts
- [ ] Accessibility: Keyboard navigation, screen reader
- [ ] Error states: Network errors, API errors, validation errors
- [ ] Performance: Initial load < 3s, chat response starts < 1s

## Acceptance Criteria

**Overall MVP Success Criteria:**

1. **User can create account and sign in**
   - Given a new user visits the site
   - When they complete sign-up with email and password
   - Then they receive verification email and can access the app

2. **User can have AI-powered conversation**
   - Given an authenticated user on the chat page
   - When they type a health-related question and send
   - Then they receive a relevant, streaming response from the AI health coach within 2 seconds

3. **AI responses are grounded in health coach expertise**
   - Given the knowledge base is populated with health coach content
   - When user asks questions covered in knowledge base
   - Then responses reflect the health coach's methodology and expertise

4. **User can trigger predefined workflows**
   - Given workflow buttons are visible in the chat interface
   - When user clicks a workflow (e.g., "Goal Setting")
   - Then the workflow executes and returns structured guidance

5. **Conversations are persistent**
   - Given a user has had previous conversations
   - When they return to the chat page
   - Then their conversation history is displayed and they can continue where they left off

6. **Application is secure**
   - Given any API endpoint
   - When accessed without valid authentication
   - Then request is rejected with 401 Unauthorized

7. **Application is responsive**
   - Given the application is loaded on mobile, tablet, or desktop
   - When user interacts with chat interface
   - Then UI adapts appropriately and remains fully functional

**Story-Specific Acceptance Criteria:**

**Story 1: Supabase Auth**
- [ ] User can sign up with email/password
- [ ] User receives verification email
- [ ] User can sign in with verified credentials
- [ ] User can sign out and session is cleared
- [ ] Protected routes redirect to sign-in if not authenticated
- [ ] Session persists across page refreshes
- [ ] All Clerk code removed from codebase

**Story 2: Dify Proxy**
- [ ] /api/chat endpoint validates Supabase session
- [ ] Unauthorized requests return 401
- [ ] Valid requests proxy to Dify API successfully
- [ ] Streaming responses work correctly
- [ ] Errors from Dify are handled gracefully
- [ ] API keys never exposed to client

**Story 3: Chat UI**
- [ ] Chat interface loads without errors
- [ ] User can type and send messages
- [ ] Messages display in chronological order
- [ ] AI responses stream in real-time
- [ ] Loading states display during response
- [ ] Error messages show for failed requests
- [ ] UI is responsive on all screen sizes

**Story 4: Knowledge Base**
- [ ] Health coach content uploaded to Dify
- [ ] Embedding and indexing complete
- [ ] Test queries return relevant information
- [ ] Responses cite health coach methodology
- [ ] Knowledge base is searchable and retrievable

**Story 5: Workflows**
- [ ] Workflow menu visible in chat UI
- [ ] Each workflow can be triggered
- [ ] Workflow parameters collected correctly
- [ ] Workflow results displayed in chat
- [ ] Workflow execution errors handled gracefully

---
