# Technical Details

**1. Authentication Flow**

**Sign Up:**
```
User → Sign Up Page → Supabase Auth (createUser) → Email Verification
  → Verified → Redirect to Onboarding → Create user_preferences record
```

**Sign In:**
```
User → Sign In Page → Supabase Auth (signInWithPassword)
  → Success → Set session cookie → Redirect to /chat
```

**Session Management:**
```
Every Request → Middleware → Supabase session refresh
  → Valid? → Continue
  → Invalid? → Redirect to Sign In
```

**2. Chat Message Flow**

**User sends message:**
```
Client (ChatInterface) → POST /api/chat
  ↓
  Validate Supabase session (server-side)
  ↓
  Extract user.id and message
  ↓
  Call Dify API (with service token)
  {
    query: message,
    user: user.id,
    conversation_id: conversationId || null,
    response_mode: 'streaming'
  }
  ↓
  Dify processes:
    - Retrieves relevant knowledge base context
    - Generates response via LLM
    - Returns streaming SSE response
  ↓
  Proxy streams back to client
  ↓
  Assistant-UI renders message stream in real-time
```

**3. Workflow Trigger Flow**

**User initiates workflow:**
```
Client → Click workflow button → POST /api/chat/workflows
  {
    workflowId: 'goal-setting',
    parameters: { /* user inputs */ }
  }
  ↓
  Validate session
  ↓
  Call Dify Workflow API
  ↓
  Dify executes workflow steps:
    - Collect inputs
    - Process via agents
    - Return structured result
  ↓
  Display result in chat as formatted message
```

**4. Database Operations**

**User Preferences (Example):**
```typescript
// Fetch user preferences
const preferences = await db
  .select()
  .from(userPreferences)
  .where(eq(userPreferences.userId, user.id))
  .limit(1);

// Update preferences
await db
  .update(userPreferences)
  .set({ theme: 'dark', updatedAt: new Date() })
  .where(eq(userPreferences.userId, user.id));
```

**5. Error Handling Strategy**

**API Route Errors:**
```typescript
export async function POST(request: Request) {
  try {
    // Validate session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 },
      );
    }

    // Call Dify
    const response = await difyClient.chat({
      query: 'Hello',
      user: user.id,
    });

    return Response.json(response);
  } catch (error) {
    logger.error('Chat API error', { error, userId: user?.id });

    // Dify API errors
    if (error.response?.status === 429) {
      return Response.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
        { status: 429 },
      );
    }

    // Generic error
    return Response.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
```

**Client Error Handling:**
```typescript
// In React components
async function submitMessage(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || 'Something went wrong');
    }

    // Handle success
  } catch (error) {
    logger.error('Network error', error);
    toast.error('Network error. Please check your connection.');
  }
}
```

**6. Security Considerations**

**API Key Protection:**
- Dify API keys stored in environment variables (server-side only)
- Never exposed to client
- Backend proxy validates all requests

**Session Security:**
- HTTPOnly cookies for session tokens
- Supabase handles token refresh automatically
- Short-lived JWTs (1 hour default)

**Input Validation:**
- All API inputs validated with Zod schemas
- Sanitize user inputs before passing to Dify
- Rate limiting on API routes (via Vercel)

**Data Privacy:**
- User conversations stored in Dify Cloud (SOC 2 compliant)
- Minimal PII in application database
- GDPR-compliant data handling

**7. Performance Optimizations**

**Server Components (Default):**
- Most pages render on server
- Reduces client bundle size
- Better SEO and initial load

**Streaming:**
- Chat responses streamed via SSE
- Progressive rendering for better UX
- No waiting for complete response

**Image Optimization:**
- Next.js Image component for all images
- Automatic WebP conversion
- Lazy loading

**Code Splitting:**
- Automatic route-based splitting (Next.js)
- Dynamic imports for heavy components
- Reduced initial bundle size

---
