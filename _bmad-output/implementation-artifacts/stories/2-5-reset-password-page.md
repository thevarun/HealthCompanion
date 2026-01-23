# Story 2.5: Reset Password Page

Status: ready-for-dev

## Story

As a user with a password reset link,
I want to set a new password,
So that I can access my account with new credentials.

## Acceptance Criteria

1. **Given** I click the reset link from my email **When** the token is valid **Then** I see a reset password form **And** I can enter a new password

2. **Given** I am on the reset password form **When** I enter a new password meeting requirements **Then** my password is updated successfully **And** I see "Password reset successful!" **And** I am redirected to sign-in page

3. **Given** I enter a password not meeting requirements **When** I try to submit **Then** I see validation errors inline **And** requirements are clearly displayed **And** form does not submit until valid

4. **Given** I click an expired reset link **When** the token is no longer valid **Then** I see "This reset link has expired" **And** I am offered a link to request a new reset

5. **Given** I click a malformed or invalid reset link **When** the token cannot be verified **Then** I see "Invalid reset link" **And** I am offered a link to request a new reset

## Tasks / Subtasks

- [ ] Create reset-password page with token validation (AC: #1, #4, #5)
  - [ ] Create route at `src/app/[locale]/(unauth)/(center)/reset-password/page.tsx`
  - [ ] Extract ResetPasswordPage component from MagicPatterns design
  - [ ] Read and validate token from URL hash params (Supabase PKCE flow)
  - [ ] Show loading state while verifying token
  - [ ] Handle invalid/expired token: show error state with link to /forgot-password
  - [ ] Handle valid token: show password reset form
  - [ ] Add i18n translations for ResetPassword namespace

- [ ] Implement password reset form with validation (AC: #2, #3)
  - [ ] Use react-hook-form + zod for password validation
  - [ ] Create validation schema (min 8 chars, complexity requirements)
  - [ ] Add password input field with show/hide toggle (PasswordInput component)
  - [ ] Add confirm password field with matching validation
  - [ ] Display password requirements clearly (before user starts typing)
  - [ ] Show inline validation errors as user types
  - [ ] Add submit button with loading state
  - [ ] Disable form during submission (prevent double-submit)

- [ ] Implement password update functionality (AC: #2)
  - [ ] Call `supabase.auth.updateUser({ password: newPassword })`
  - [ ] Verify session exists before allowing update
  - [ ] Handle success: show success message
  - [ ] Redirect to sign-in page after 2 seconds
  - [ ] Handle errors: show error toast with details
  - [ ] Clear session after successful password update

- [ ] Handle token verification edge cases (AC: #4, #5)
  - [ ] Detect expired token error from Supabase
  - [ ] Detect invalid token format
  - [ ] Show "Reset link has expired" for expired tokens
  - [ ] Show "Invalid reset link" for malformed tokens
  - [ ] Provide clear call-to-action: "Request a new reset link"
  - [ ] Link to /forgot-password page for new request

- [ ] Create unit tests for reset-password page
  - [ ] Test token validation on page load
  - [ ] Test password form validation (min length, complexity, matching)
  - [ ] Test successful password update flow (mock Supabase)
  - [ ] Test expired token error state
  - [ ] Test invalid token error state
  - [ ] Test loading states during submission
  - [ ] Test redirect to sign-in after success
  - [ ] Test "Request new reset link" navigation

## Dev Notes

### UX Design References

**CRITICAL: DO NOT BUILD FROM SCRATCH**

The UI components for this story are already implemented in MagicPatterns.

| Screen/Component | Design Tool | URL | Files to Extract |
|------------------|-------------|-----|------------------|
| Reset Password | MagicPatterns | https://www.magicpatterns.com/c/mvjem6dcsdqzubf6kpavmg | `ResetPasswordPage.tsx` |

**Extraction Command:**
```
mcp__magic-patterns__read_files(url: "https://www.magicpatterns.com/c/mvjem6dcsdqzubf6kpavmg", fileNames: ["ResetPasswordPage.tsx"])
```

**Adaptation Checklist:**
- [ ] Replace inline styles with project's Tailwind classes if different
- [ ] Swap custom inputs for shadcn `Input` component
- [ ] Use PasswordInput component for password fields (with show/hide toggle)
- [ ] Add `"use client"` directive for Next.js
- [ ] Wire up to Supabase auth method (`updateUser`)
- [ ] Add proper TypeScript types for form data
- [ ] Integrate with project's toast notifications
- [ ] Add i18n translations using `useTranslations`
- [ ] Handle Supabase PKCE token verification flow
- [ ] Add password matching validation (password === confirmPassword)

**Required shadcn Components:**
```bash
# Already installed: button, input, label, form, toast, card, separator
# PasswordInput component pattern exists from Story 2.1 (sign-up)
# No new components needed for this story
```

**Reference Documents:**
- Design Brief: _bmad-output/planning-artifacts/ux-design/epic-2-auth-design-brief.md
- Component Strategy: _bmad-output/planning-artifacts/ux-design/epic-2-auth-component-strategy.md

### Reset Password Flow Architecture

**Overview:**
This story implements the password reset completion flow. Users who click the reset link from their email (sent in Story 2.4) land on this page to set a new password. The flow uses Supabase's PKCE (Proof Key for Code Exchange) auth code flow for security.

**Flow Sequence:**
1. User receives password reset email from Story 2.4
2. User clicks reset link: `/reset-password#access_token=...&refresh_token=...&type=recovery`
3. Page loads and reads hash params (Supabase PKCE flow)
4. Page calls `supabase.auth.getSession()` to verify token
5. If valid: Show password reset form
6. If invalid/expired: Show error state with link to /forgot-password
7. User enters new password (with confirmation)
8. Form validates password requirements client-side
9. Submit calls `supabase.auth.updateUser({ password })`
10. On success: Show success message and redirect to /sign-in
11. On error: Show error toast with retry option

### Supabase Auth API Patterns

**Token Verification (PKCE Flow):**
```typescript
// Page loads with hash params: #access_token=...&refresh_token=...&type=recovery
// Supabase client automatically reads these params

useEffect(() => {
  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session || session.user.aud !== 'recovery') {
      // Invalid or expired token
      setTokenError('expired') // or 'invalid'
      return
    }

    // Valid recovery session - show form
    setIsValidToken(true)
  }

  checkSession()
}, [])
```

**Update Password:**
```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
})

if (error) {
  // Handle errors (weak password, network error, etc.)
  toast.error('Failed to reset password: ' + error.message)
  return
}

// Success - redirect to sign-in
toast.success('Password reset successful!')
setTimeout(() => router.push('/sign-in'), 2000)
```

**CRITICAL SECURITY NOTE:**
Supabase uses PKCE (Proof Key for Code Exchange) for password reset tokens. The token is delivered as hash params in the URL, not query params. The Supabase client automatically reads and validates these tokens.

**Token Verification States:**
- **Valid:** `session.user.aud === 'recovery'` - show form
- **Expired:** Session exists but token expired - show expired error
- **Invalid:** No session or malformed token - show invalid error
- **Missing:** No hash params at all - show invalid error

### Critical Implementation Details

**1. Route Location:**
Following the pattern from Stories 2.1-2.4, reset-password should be in the `(unauth)/(center)/` route group:
```
src/app/[locale]/(unauth)/(center)/reset-password/page.tsx
```

**2. Token Handling - Hash Params vs Query Params:**
CRITICAL: Supabase sends tokens in URL HASH (#), not query params (?).

```typescript
// CORRECT: Supabase client auto-reads from hash
// URL: /reset-password#access_token=xxx&refresh_token=yyy&type=recovery
const { data: { session } } = await supabase.auth.getSession()

// INCORRECT: Don't try to read query params
// const searchParams = useSearchParams() // ❌ WRONG
```

The Supabase client automatically handles hash param parsing. Just call `getSession()`.

**3. Recovery Session Verification:**
Verify the session is a recovery session (not a regular auth session):
```typescript
if (session?.user.aud !== 'recovery') {
  // Not a valid password reset session
  setTokenError('invalid')
}
```

**4. Password Requirements:**
Match the requirements from Story 2.1 (sign-up):
```typescript
const schema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})
```

**5. Password Requirements Display:**
Show requirements prominently BEFORE user starts typing:
```typescript
// Display these requirements above/below password input
const requirements = [
  'At least 8 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number'
]
```

**6. Success State with Auto-Redirect:**
After successful password update:
```typescript
const handleSuccess = () => {
  toast.success('Password reset successful! Redirecting to sign-in...')

  // Auto-redirect after 2 seconds
  setTimeout(() => {
    router.push('/sign-in')
  }, 2000)
}
```

**7. Error State Templates:**

**Expired Token:**
```typescript
<div className="text-center">
  <h2>Reset Link Expired</h2>
  <p>This password reset link has expired for security reasons.</p>
  <Button asChild>
    <Link href="/forgot-password">Request a New Reset Link</Link>
  </Button>
</div>
```

**Invalid Token:**
```typescript
<div className="text-center">
  <h2>Invalid Reset Link</h2>
  <p>This password reset link is invalid or has already been used.</p>
  <Button asChild>
    <Link href="/forgot-password">Request a New Reset Link</Link>
  </Button>
</div>
```

**8. Form States:**
The page should handle these states:
- `loading`: Verifying token on initial load
- `invalid`: Token is malformed
- `expired`: Token has expired
- `valid`: Token is valid, show form
- `submitting`: Form is being submitted
- `success`: Password updated successfully

### Previous Story Integration (Story 2.4)

**What Story 2.4 Created:**
- Forgot password page at `(unauth)/(center)/forgot-password/`
- `resetPasswordForEmail()` call with `redirectTo` pointing to `/reset-password`
- Reset email sent with magic link containing PKCE tokens
- Security pattern: generic success messages (no email enumeration)
- i18n translation pattern for auth forms
- Card + backdrop blur styling pattern

**What We're Building On:**
- Follow same route structure: `(unauth)/(center)/reset-password/`
- Use same Card + backdrop blur styling from MagicPatterns
- Follow same i18n pattern (ResetPassword namespace)
- Use same button loading states pattern
- Reuse established form validation approach (react-hook-form + zod)
- Use PasswordInput component pattern from Story 2.1

**Flow Continuation:**
Story 2.4 sends the email → Story 2.5 handles the reset:
- Story 2.4: User requests reset → Email sent with link to `/reset-password`
- Story 2.5: User clicks link → Token verified → Password updated → Redirect to sign-in

### Password Input Component Reuse

**From Story 2.1 (Sign-Up):**
The PasswordInput component should already exist from Story 2.1. This component provides:
- Password visibility toggle (eye icon)
- Show/hide password functionality
- Consistent styling with other inputs

**Location:** `src/components/ui/password-input.tsx`

**Usage in Reset Password Form:**
```typescript
import { PasswordInput } from '@/components/ui/password-input'

<PasswordInput
  {...register('password')}
  placeholder="Enter new password"
/>

<PasswordInput
  {...register('confirmPassword')}
  placeholder="Confirm new password"
/>
```

If PasswordInput doesn't exist, extract it from MagicPatterns design as outlined in the Component Strategy.

### File Structure

```
src/
├── app/
│   ├── [locale]/(unauth)/(center)/
│   │   ├── reset-password/
│   │   │   ├── page.tsx (NEW - reset password form with token validation)
│   │   │   └── page.test.tsx (NEW - unit tests)
│   │   ├── forgot-password/
│   │   │   └── page.tsx (EXISTS - Story 2.4)
│   │   └── sign-in/
│   │       └── page.tsx (EXISTS - redirect destination)
├── components/
│   └── ui/
│       ├── password-input.tsx (EXISTS - from Story 2.1)
│       ├── input.tsx (EXISTS - shadcn component)
│       ├── button.tsx (EXISTS - shadcn component)
│       └── card.tsx (EXISTS - shadcn component)
└── locales/
    ├── en.json (UPDATE - add ResetPassword translations)
    ├── hi.json (UPDATE - add ResetPassword translations)
    └── bn.json (UPDATE - add ResetPassword translations)
```

### I18n Translation Keys

Add to `ResetPassword` namespace:
```json
{
  "ResetPassword": {
    "title": "Reset Password",
    "subtitle": "Enter your new password below",
    "password_label": "New Password",
    "password_placeholder": "Enter new password",
    "confirm_password_label": "Confirm Password",
    "confirm_password_placeholder": "Re-enter new password",
    "requirements_title": "Password Requirements",
    "requirement_min_length": "At least 8 characters",
    "requirement_uppercase": "One uppercase letter",
    "requirement_lowercase": "One lowercase letter",
    "requirement_number": "One number",
    "submit_button": "Reset Password",
    "resetting": "Resetting...",
    "success_title": "Password Reset Successful!",
    "success_message": "Your password has been updated. Redirecting to sign-in...",
    "expired_title": "Reset Link Expired",
    "expired_message": "This password reset link has expired for security reasons.",
    "expired_action": "Request a New Reset Link",
    "invalid_title": "Invalid Reset Link",
    "invalid_message": "This password reset link is invalid or has already been used.",
    "invalid_action": "Request a New Reset Link",
    "error_passwords_match": "Passwords don't match",
    "error_weak_password": "Password doesn't meet requirements",
    "error_update_failed": "Failed to reset password. Please try again.",
    "verifying_token": "Verifying reset link..."
  }
}
```

### Testing Requirements

**Unit Tests (Vitest + Testing Library):**
- Test token verification on page load (mock getSession)
- Test expired token error state rendering
- Test invalid token error state rendering
- Test valid token showing form
- Test password form validation (min length, complexity, matching)
- Test password requirements display
- Test successful password update flow (mock updateUser)
- Test password update error handling
- Test loading states during token verification
- Test loading states during submission
- Test redirect to sign-in after success
- Test "Request new reset link" navigation

**E2E Tests (Playwright):**
- Complete reset password flow from valid link
- Expired token error handling
- Invalid token error handling
- Password validation messages (too short, no uppercase, etc.)
- Password mismatch validation
- Form submission with loading state
- Success message and auto-redirect
- "Request new reset link" navigation
- Password visibility toggle
- Mobile responsiveness

**Manual Testing:**
- Complete flow with real password reset email
- Test with expired reset link (wait for expiry or use old link)
- Test with invalid/malformed link
- Test with already-used reset link
- Test password requirements (try various invalid passwords)
- Test password mismatch error
- Verify auto-redirect to sign-in after success
- Test password visibility toggle
- Test on mobile devices (responsive design)
- Verify new password works on sign-in page

### Edge Cases to Handle

1. **Expired token:** Show expired error state with link to request new reset
2. **Invalid token format:** Show invalid error state with link to request new reset
3. **Already-used token:** Supabase treats as invalid - show invalid error state
4. **No token in URL:** Show invalid error state (user navigated directly)
5. **Weak password:** Client-side validation prevents submission, show requirements
6. **Password mismatch:** Show inline error on confirmPassword field
7. **Network error during update:** Show error toast with retry option
8. **Form double-submit:** Disable button during submission
9. **Token valid but user session expired:** Re-verify session before update
10. **User closes page mid-flow:** Token remains valid for retry within expiry window
11. **Browser back button after success:** Redirect to sign-in (token already used)
12. **Empty password fields:** Required validation prevents submission

### Security Considerations

1. **PKCE Token Verification:** Verify token is valid recovery session before showing form
2. **Token Expiry:** Respect Supabase token expiry (typically 1 hour)
3. **One-Time Use:** Token is invalidated after successful password update
4. **Password Strength:** Enforce same requirements as sign-up (Story 2.1)
5. **No Token Leakage:** Hash params not sent to server (client-side only)
6. **Session Invalidation:** Clear session after password update
7. **Auto-Redirect Security:** Use trusted routes only (/sign-in)
8. **Error Messages:** Generic for invalid tokens (don't reveal user info)
9. **Rate Limiting:** Supabase handles on their end
10. **CSRF Protection:** Next.js + Supabase SSR handles automatically

### Architecture Compliance

**Next.js 15 App Router Patterns:**
- Reset password page is a Client Component (needs to read hash params)
- Use `'use client'` directive
- Use `useRouter()` from `next/navigation` for client-side navigation
- Use `useEffect()` for token verification on mount
- No server-side auth check needed (token verification is client-side)

**Supabase Client Usage:**
- Client Component: `createBrowserClient()` for token verification and password update
- No server-side Supabase calls needed for this story
- Supabase client auto-reads hash params (PKCE flow)
- Session verification: `getSession()` checks recovery session

**TypeScript Strict Mode:**
- All form data properly typed
- Error handling with proper types (Supabase AuthError)
- No `any` types allowed
- Null checks for session data

**Code Style (Antfu Config):**
- No semicolons
- Single quotes for JSX attributes
- Path aliases (`@/` prefix)
- Import organization (auto-sorted)

### Recent Patterns from Git History

**From Story 2.4 Commit (90c4bb4 + d99ce4a):**
- Auth pages in `(unauth)/(center)/` route group
- Client Component for forms with `'use client'` directive
- react-hook-form + zod validation pattern
- Toast notifications for success/error states
- Comprehensive unit tests co-located with pages
- i18n translations in all locale files (en, hi, bn)
- Error state handling with clear user messaging
- Success state transitions with auto-redirect
- MagicPatterns design extraction and adaptation

**From Story 2.3 Commit (c3f83f2):**
- Password input with show/hide toggle
- Form validation with inline error messages
- Loading states during async operations
- Generic error messages for security

**From Story 2.1 Commit (Sign-Up):**
- Password requirements validation
- Password strength enforcement
- PasswordInput component with visibility toggle
- Password complexity checks (uppercase, lowercase, number)

**Pattern to Follow:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/libs/supabase/client'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export default function ResetPasswordPage() {
  const [tokenState, setTokenState] = useState<'loading' | 'valid' | 'expired' | 'invalid'>('loading')
  const router = useRouter()
  const t = useTranslations('ResetPassword')
  const supabase = createClient()

  useEffect(() => {
    const verifyToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session || session.user.aud !== 'recovery') {
        setTokenState('invalid')
        return
      }

      setTokenState('valid')
    }

    verifyToken()
  }, [])

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password
    })

    if (error) {
      toast.error(t('error_update_failed'))
      return
    }

    toast.success(t('success_title'))
    setTimeout(() => router.push('/sign-in'), 2000)
  }

  // Render based on tokenState
  if (tokenState === 'loading') return <LoadingState />
  if (tokenState === 'expired') return <ExpiredState />
  if (tokenState === 'invalid') return <InvalidState />

  return <ResetPasswordForm onSubmit={onSubmit} />
}
```

### Integration with Story 2.4 (Forgot Password Flow)

This story completes the password reset flow started in Story 2.4.

**Story 2.4 → Story 2.5 Flow:**
- Story 2.4: User enters email → `resetPasswordForEmail()` called
- Story 2.4: Email sent with link: `/reset-password#access_token=...&type=recovery`
- Story 2.5: User clicks link → Token verified → Form shown
- Story 2.5: User sets new password → `updateUser()` called
- Story 2.5: Success → Redirect to `/sign-in`

**What Story 2.4 Provides:**
- Reset email with PKCE token in hash params
- `redirectTo` URL configured: `${origin}/reset-password`
- User education about checking email
- Rate limiting and security patterns

**What Story 2.5 Consumes:**
- PKCE token from URL hash params
- Recovery session from Supabase
- User expectation set by Story 2.4's messaging

**Error Handling Continuity:**
If token is expired/invalid, Story 2.5 sends user back to Story 2.4 to request a new reset link.

### Integration with Sign-In (Story 2.3)

After successful password reset, user is redirected to the sign-in page.

**Flow:**
- Story 2.5: Password reset successful → Show success toast
- Story 2.5: Wait 2 seconds → `router.push('/sign-in')`
- Story 2.3: Sign-in page loads
- User: Enters email + NEW password → Signs in successfully

**User Experience:**
- Clear success message: "Password reset successful! Redirecting to sign-in..."
- Auto-redirect (no manual action needed)
- User can immediately sign in with new password
- Toast notification persists briefly on sign-in page

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-complete-authentication-experience.md#Story-2.5]
- [Source: _bmad-output/implementation-artifacts/stories/2-4-forgot-password-flow.md] (Previous story context)
- [Source: _bmad-output/implementation-artifacts/stories/2-3-user-login-with-session-management.md] (Sign-in integration)
- [Source: _bmad-output/planning-artifacts/ux-design/epic-2-auth-design-brief.md] (UX design decisions)
- [Source: _bmad-output/planning-artifacts/ux-design/epic-2-auth-component-strategy.md] (Component extraction guide)
- [Source: https://www.magicpatterns.com/c/mvjem6dcsdqzubf6kpavmg] (Reset password design)
- [Source: docs/api-error-handling.md] (Error handling patterns)
- [Supabase Docs: Password Reset] (https://supabase.com/docs/guides/auth/passwords#reset-password)
- [Supabase API: updateUser] (https://supabase.com/docs/reference/javascript/auth-updateuser)
- [Supabase PKCE Flow] (https://supabase.com/docs/guides/auth/server-side/pkce-flow)
- [OWASP: Password Reset Best Practices] (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List
