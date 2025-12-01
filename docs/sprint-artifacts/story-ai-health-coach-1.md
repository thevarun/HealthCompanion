# Story 1.1: Replace Clerk with Supabase Auth

**Status:** Draft

---

## User Story

As a developer,
I want to replace Clerk authentication with Supabase Auth,
So that we have a unified auth + database + vector DB stack for the MVP.

---

## Acceptance Criteria

**AC #1:** User can sign up with email/password via Supabase Auth
**AC #2:** User receives verification email and can verify account
**AC #3:** User can sign in with verified credentials
**AC #4:** User can sign out and session is properly cleared
**AC #5:** Protected routes redirect to sign-in page when user is not authenticated
**AC #6:** Session persists across page refreshes
**AC #7:** All Clerk dependencies removed from codebase
**AC #8:** All existing E2E auth tests pass with Supabase

---

## Implementation Details

### Tasks / Subtasks

**Setup & Preparation:**
- [ ] Create Supabase project and obtain credentials (AC: #1)
- [ ] Install @supabase/supabase-js ^2.39.0 and @supabase/ssr ^0.1.0 (AC: #1)
- [ ] Uninstall @clerk/nextjs and all Clerk packages (AC: #7)
- [ ] Add Supabase environment variables to .env.local.example (AC: #1)

**Core Implementation:**
- [ ] Create lib/supabase/client.ts - browser-side Supabase client (AC: #1)
- [ ] Create lib/supabase/server.ts - server-side Supabase SSR client (AC: #1, #6)
- [ ] Replace middleware.ts with Supabase session refresh logic (AC: #6)
- [ ] Update app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx for Supabase (AC: #3)
- [ ] Update app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx for Supabase (AC: #1, #2)
- [ ] Update app/[locale]/(auth)/sign-out/page.tsx for Supabase (AC: #4)
- [ ] Replace components/UserButton.tsx to use Supabase user data (AC: #4)
- [ ] Update components/ProtectedRoute.tsx to check Supabase session (AC: #5)
- [ ] Update components/Navigation.tsx with Supabase user menu (AC: #4)
- [ ] Replace libs/auth.ts with Supabase utility functions (AC: #1, #3, #4)

**Cleanup:**
- [ ] Remove app/api/auth/[...nextauth]/route.ts (Clerk-specific) (AC: #7)
- [ ] Remove any remaining Clerk imports from codebase (AC: #7)
- [ ] Update package.json - verify no Clerk packages remain (AC: #7)

**Testing:**
- [ ] Update tests/e2e/auth.spec.ts for Supabase auth flow (AC: #8)
- [ ] Run E2E auth tests and verify all pass (AC: #8)
- [ ] Manual test: Sign up, verify email, sign in, sign out (AC: #1-4)
- [ ] Manual test: Protected route redirect without auth (AC: #5)
- [ ] Manual test: Session persists after page refresh (AC: #6)

### Technical Summary

Replace Clerk authentication system with Supabase Auth throughout the SaaS boilerplate. Use `@supabase/ssr` package for Next.js 14 App Router integration with proper server/client separation.

**Key Technical Decisions:**
- Server Components use `lib/supabase/server.ts` with cookies() access
- Client Components use `lib/supabase/client.ts` with browser client
- Middleware refreshes sessions on every request
- Email verification required before sign-in (Supabase default)

**Files Involved:** ~15-20 files total (12 modifications, 2-3 creations, 5 deletions)

### Project Structure Notes

- **Files to create:**
  - lib/supabase/client.ts
  - lib/supabase/server.ts
  - lib/supabase/middleware.ts (utility functions)

- **Files to modify:**
  - middleware.ts
  - app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx
  - app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx
  - app/[locale]/(auth)/sign-out/page.tsx
  - components/UserButton.tsx
  - components/ProtectedRoute.tsx
  - components/Navigation.tsx
  - libs/auth.ts
  - package.json
  - .env.local
  - tests/e2e/auth.spec.ts

- **Files to delete:**
  - app/api/auth/[...nextauth]/route.ts
  - Any Clerk-specific utilities

- **Expected test locations:**
  - tests/e2e/auth.spec.ts (update existing)
  - tests/unit/lib/supabase/client.test.ts (new)
  - tests/unit/lib/supabase/server.test.ts (new)

- **Estimated effort:** 3 story points (2-3 days)

- **Prerequisites:**
  - Supabase project created with credentials available
  - SaaS boilerplate cloned and dependencies installed
  - Local development environment running

### Key Code References

**Boilerplate Auth Implementation (to replace):**
- `middleware.ts:1-50` - Current Clerk middleware pattern
- `libs/auth.ts` - Clerk utility functions to replace
- `app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx` - Clerk SignIn component
- `app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx` - Clerk SignUp component

**Supabase Implementation Patterns (from tech-spec):**
```typescript
// lib/supabase/server.ts pattern
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:
- Complete Supabase Auth implementation approach (Technical Approach section)
- Exact code patterns for server/client Supabase clients
- Middleware session refresh implementation
- Authentication flow diagrams
- Testing strategy for auth flows

**Architecture:** See tech-spec.md "Technical Approach" section for auth architecture

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
