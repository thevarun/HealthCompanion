# Story 1.2: Build Dify Backend Proxy

**Status:** Draft

---

## User Story

As a developer,
I want a secure backend proxy for the Dify API,
So that API keys remain server-side and user sessions are validated before AI requests.

---

## Acceptance Criteria

**AC #1:** /api/chat endpoint validates Supabase session before proxying requests
**AC #2:** Unauthorized requests return 401 with appropriate error message
**AC #3:** Valid requests successfully proxy to Dify API
**AC #4:** Streaming responses (SSE) work correctly from Dify through proxy to client
**AC #5:** Dify API errors are caught and returned as appropriate HTTP responses
**AC #6:** Dify API key is never exposed to client-side code
**AC #7:** Integration tests pass for chat API route

---

## Implementation Details

### Tasks / Subtasks

**Setup & Preparation:**
- [ ] Install dify-client package (AC: #3)
- [ ] Create Dify Cloud account and obtain API key (AC: #3)
- [ ] Add DIFY_API_KEY and DIFY_API_URL to environment variables (AC: #6)
- [ ] Test Dify API access with curl to verify credentials (AC: #3)

**Core Implementation:**
- [ ] Create lib/dify/client.ts - Dify API wrapper using dify-client SDK (AC: #3)
- [ ] Create lib/dify/types.ts - TypeScript interfaces for Dify requests/responses (AC: #3)
- [ ] Create lib/dify/config.ts - Dify configuration constants (AC: #3)
- [ ] Create app/api/chat/route.ts - Main chat endpoint with session validation (AC: #1, #2, #3)
- [ ] Implement Supabase session validation in chat route (AC: #1, #2)
- [ ] Implement SSE streaming from Dify to client (AC: #4)
- [ ] Add error handling for Dify API errors (429, 500, etc.) (AC: #5)
- [ ] Add logging for chat requests and errors (AC: #5)

**Security:**
- [ ] Verify API keys only accessible server-side (AC: #6)
- [ ] Verify no API keys in client bundle (check browser DevTools) (AC: #6)
- [ ] Add rate limiting considerations (document for future) (AC: #5)

**Testing:**
- [ ] Write integration test for /api/chat with mock Supabase session (AC: #7)
- [ ] Write integration test for unauthorized request (AC: #2, #7)
- [ ] Write integration test for Dify API error handling (AC: #5, #7)
- [ ] Manual test with Postman: Valid session → successful proxy (AC: #1, #3)
- [ ] Manual test with Postman: No session → 401 error (AC: #2)
- [ ] Manual test streaming response in browser (AC: #4)

### Technical Summary

Create backend API route that validates Supabase sessions and proxies requests to Dify Cloud securely. Use dify-client SDK for Dify communication. Implement Server-Sent Events (SSE) streaming for real-time AI responses.

**Key Technical Decisions:**
- Backend proxy pattern keeps Dify API keys server-side
- Use `dify-client` package for official Dify SDK
- Validate sessions using Supabase SSR server client
- Stream responses using Next.js Response with text/event-stream

**Architecture Flow:**
```
Client → POST /api/chat (with message)
  ↓
  Validate Supabase session (401 if invalid)
  ↓
  Extract user.id and message
  ↓
  Call Dify API (with service token)
  ↓
  Stream SSE response back to client
```

### Project Structure Notes

- **Files to create:**
  - lib/dify/client.ts
  - lib/dify/types.ts
  - lib/dify/config.ts
  - app/api/chat/route.ts

- **Files to modify:**
  - .env.local (add Dify credentials)
  - package.json (add dify-client)

- **Expected test locations:**
  - tests/integration/api/chat.test.ts (new)
  - tests/unit/lib/dify/client.test.ts (new)

- **Estimated effort:** 2 story points (1-2 days)

- **Prerequisites:**
  - Story 1.1 completed (Supabase auth functional)
  - Dify Cloud account created with API key

### Key Code References

**Tech-Spec Implementation (from tech-spec.md):**
```typescript
// app/api/chat/route.ts pattern
import { createClient } from '@/lib/supabase/server'
import { DifyClient } from '@/lib/dify/client'

export async function POST(request: Request) {
  // 1. Validate Supabase session
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Extract message from request
  const { message, conversationId } = await request.json()

  // 3. Call Dify API with service token
  const dify = new DifyClient(process.env.DIFY_API_KEY!)
  const stream = await dify.chatMessages({
    query: message,
    user: user.id,
    conversation_id: conversationId,
    response_mode: 'streaming',
  })

  // 4. Stream response back to client
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

**Error Handling Pattern:**
- See tech-spec.md "Technical Details" → "Error Handling Strategy"

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:
- Complete Dify integration architecture (Integration Points section)
- Backend proxy implementation code (Technical Approach section)
- Error handling strategy
- Security considerations
- API endpoint specifications

**Architecture:** See tech-spec.md "Technical Approach" → "Dify Integration via Backend Proxy"

---

## Dev Agent Record

### Agent Model Used

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes

<!-- Will be populated during dev-story execution -->

### Files Modified

<!-- Will be populated during dev-story execution -->

### Test Results

<!-- Will be populated during dev-story execution -->

---

## Review Notes

<!-- Will be populated during code review -->
