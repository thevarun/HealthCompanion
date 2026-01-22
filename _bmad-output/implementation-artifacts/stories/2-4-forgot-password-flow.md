# Story 2.4: Forgot Password Flow

Status: ready-for-dev

## Story

As a user who forgot my password,
I want to request a password reset,
So that I can regain access to my account.

## Acceptance Criteria

1. **Given** I am on the sign-in page **When** I look for password recovery **Then** I see a "Forgot password?" link clearly visible

2. **Given** I click "Forgot password?" **When** the forgot password page loads **Then** I see an email input field **And** clear instructions to enter my email

3. **Given** I enter my registered email **When** I submit the forgot password form **Then** I see "Check your email for reset link" **And** a password reset email is sent **And** the email contains a secure reset link

4. **Given** I enter an unregistered email **When** I submit the forgot password form **Then** I see the same "Check your email" message (security) **And** no indication whether email exists in system

5. **Given** I submit multiple reset requests **When** I exceed rate limits **Then** I see "Too many requests. Please try again later." **And** I am temporarily blocked from requesting

## Tasks / Subtasks

- [ ] Create forgot-password page with form (AC: #1, #2)
  - [ ] Create route at \`src/app/[locale]/(unauth)/(center)/forgot-password/page.tsx\`
  - [ ] Extract ForgotPasswordPage component from MagicPatterns design
  - [ ] Add email input field with proper validation
  - [ ] Add submit button with loading state
  - [ ] Add "Back to sign in" link
  - [ ] Add clear instructions: "Enter your email address and we'll send you a link to reset your password"
  - [ ] Add i18n translations for ForgotPassword namespace

- [ ] Implement password reset request functionality (AC: #3, #4)
  - [ ] Use react-hook-form + zod for email validation
  - [ ] Create validation schema (email format required)
  - [ ] Call \`supabase.auth.resetPasswordForEmail({ email })\`
  - [ ] Handle success: show "Check your email" message
  - [ ] Show SAME message for both registered and unregistered emails (security)
  - [ ] Disable form during submission (prevent double-submit)
  - [ ] Transition to success state without revealing email existence

- [ ] Implement rate limiting handling (AC: #5)
  - [ ] Detect rate limit errors from Supabase
  - [ ] Show "Too many requests" error message
  - [ ] Disable submit button temporarily
  - [ ] Add appropriate retry timing guidance

- [ ] Update sign-in page (AC: #1)
  - [ ] Verify "Forgot password?" link exists on sign-in form
  - [ ] Ensure link is prominently placed below password field
  - [ ] Link should navigate to \`/forgot-password\`

- [ ] Create unit tests for forgot-password page
  - [ ] Test form validation (email format, required field)
  - [ ] Test successful submission flow (mock Supabase)
  - [ ] Test generic success message (no email existence leak)
  - [ ] Test rate limiting error handling
  - [ ] Test loading states during submission
  - [ ] Test "Back to sign in" link navigation

## Dev Notes

### UX Design References

**CRITICAL: DO NOT BUILD FROM SCRATCH**

The UI components for this story are already implemented in MagicPatterns.

| Screen/Component | Design Tool | URL | Files to Extract |
|------------------|-------------|-----|------------------|
| Forgot Password | MagicPatterns | https://www.magicpatterns.com/c/1xdwsbsectczdt1gpzyd5r | \`ForgotPasswordPage.tsx\` |

**Extraction Command:**
\`\`\`
mcp__magic-patterns__read_files(url: "https://www.magicpatterns.com/c/1xdwsbsectczdt1gpzyd5r", fileNames: ["ForgotPasswordPage.tsx"])
\`\`\`

**Adaptation Checklist:**
- [ ] Replace inline styles with project's Tailwind classes if different
- [ ] Swap custom inputs for shadcn \`Input\` component
- [ ] Add \`"use client"\` directive for Next.js
- [ ] Wire up to Supabase auth method (\`resetPasswordForEmail\`)
- [ ] Add proper TypeScript types for form data
- [ ] Integrate with project's toast notifications
- [ ] Add i18n translations using \`useTranslations\`
- [ ] Ensure success state shows SAME message for all emails (security)

**Required shadcn Components:**
\`\`\`bash
# Already installed: button, input, label, form, toast, card, separator
# No new components needed for this story
\`\`\`

**Reference Documents:**
- Design Brief: _bmad-output/planning-artifacts/ux-design/epic-2-auth-design-brief.md
- Component Strategy: _bmad-output/planning-artifacts/ux-design/epic-2-auth-component-strategy.md

### Forgot Password Flow Architecture

**Overview:**
This story implements the password reset request flow. Users who have forgotten their password can request a reset link to be sent to their email. The flow is intentionally designed to not reveal whether an email exists in the system (security best practice).

**Flow Sequence:**
1. User clicks "Forgot password?" link on sign-in page
2. User navigates to \`/forgot-password\` page
3. User enters email address
4. Form validates email format client-side
5. Submit calls \`supabase.auth.resetPasswordForEmail()\`
6. Show "Check your email" message regardless of email existence
7. If email exists in system: Supabase sends password reset email
8. If email doesn't exist: No email sent, but same message shown
9. Email contains magic link to reset password page (Story 2.5)

### Supabase Auth API Patterns

**Request Password Reset:**
\`\`\`typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: \`\${window.location.origin}/reset-password\`
})

if (error) {
  // Handle rate limiting or network errors
  // Do NOT show "email not found" errors
}
\`\`\`

**CRITICAL SECURITY NOTE:**
Supabase's \`resetPasswordForEmail\` will NOT return an error if the email doesn't exist - it silently succeeds. This is by design to prevent email enumeration attacks. Always show the same success message.

**Rate Limiting:**
Supabase enforces rate limits on password reset requests. Handle rate limit errors:
\`\`\`typescript
if (error?.message?.includes('rate')) {
  setError('Too many password reset requests. Please try again in a few minutes.')
}
\`\`\`

### Critical Implementation Details

**1. Route Location:**
Following the pattern from Stories 2.1, 2.2, and 2.3, forgot-password should be in the \`(unauth)/(center)/\` route group:
\`\`\`
src/app/[locale]/(unauth)/(center)/forgot-password/page.tsx
\`\`\`

**2. Security - Generic Success Messages:**
NEVER reveal whether an email exists in the system. Always show:
\`\`\`
"Check your email for a password reset link. If an account exists with that email, you'll receive instructions to reset your password."
\`\`\`

This prevents attackers from:
- Enumerating valid email addresses
- Confirming user account existence
- Harvesting email lists

**3. Success State Transition:**
After submission, transition form to success state:
\`\`\`typescript
const [isSubmitted, setIsSubmitted] = useState(false)

if (isSubmitted) {
  return (
    <div>
      <h2>Check your email</h2>
      <p>If an account exists with {email}, you'll receive instructions...</p>
      <Link href="/sign-in">Back to sign in</Link>
    </div>
  )
}
\`\`\`

**4. Reset Link Configuration:**
Configure the redirect URL for the reset link:
\`\`\`typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: \`\${window.location.origin}/reset-password\`
})
\`\`\`

This URL will be used in Story 2.5 to handle the actual password reset.

**5. Error Handling:**
Only show errors for:
- Network failures
- Rate limiting
- Invalid email format (client-side validation)

Never show:
- "Email not found" errors
- "User doesn't exist" errors
- Any error that reveals account existence

**6. Form Validation:**
\`\`\`typescript
const schema = z.object({
  email: z.string().email('Please enter a valid email address')
})
\`\`\`

### Previous Story Integration (Story 2.3)

**What Story 2.3 Created:**
- Sign-in page with "Forgot password?" link (verify it exists and is prominent)
- Established route pattern: \`(unauth)/(center)/\` for auth pages
- Form validation pattern with react-hook-form + zod
- Success/error toast notification patterns
- i18n translation pattern for auth forms
- Card + backdrop blur styling pattern

**What We're Building On:**
- Follow same route structure: \`(unauth)/(center)/forgot-password/\`
- Use same Card + backdrop blur styling from MagicPatterns
- Follow same i18n pattern (ForgotPassword namespace)
- Use same button loading states pattern
- Reuse established form validation approach

**Link from Sign-In Page:**
Story 2.3 should have already included a "Forgot password?" link. Verify it exists:
- Location: Below password field in sign-in form
- Style: Small, muted text with hover underline
- Navigation: \`/forgot-password\`

If the link doesn't exist in Story 2.3's implementation, add it as part of this story.

### File Structure

\`\`\`
src/
├── app/
│   ├── [locale]/(unauth)/(center)/
│   │   ├── forgot-password/
│   │   │   ├── page.tsx (NEW - forgot password form)
│   │   │   └── page.test.tsx (NEW - unit tests)
│   │   ├── sign-in/
│   │   │   └── page.tsx (UPDATE - verify "Forgot password?" link)
│   │   └── reset-password/
│   │       └── page.tsx (FUTURE - Story 2.5)
├── components/
│   └── ui/
│       ├── input.tsx (EXISTS - shadcn component)
│       ├── button.tsx (EXISTS - shadcn component)
│       └── card.tsx (EXISTS - shadcn component)
└── locales/
    ├── en.json (UPDATE - add ForgotPassword translations)
    ├── hi.json (UPDATE - add ForgotPassword translations)
    └── bn.json (UPDATE - add ForgotPassword translations)
\`\`\`

### I18n Translation Keys

Add to \`ForgotPassword\` namespace:
\`\`\`json
{
  "ForgotPassword": {
    "title": "Forgot Password",
    "subtitle": "Enter your email address and we'll send you a link to reset your password",
    "email_label": "Email",
    "email_placeholder": "Enter your email",
    "submit_button": "Send Reset Link",
    "sending": "Sending...",
    "back_to_sign_in": "Back to sign in",
    "success_title": "Check your email",
    "success_message": "If an account exists with that email, you'll receive instructions to reset your password within a few minutes.",
    "success_note": "Didn't receive an email? Check your spam folder or try again.",
    "error_invalid_email": "Please enter a valid email address",
    "error_rate_limit": "Too many password reset requests. Please try again in a few minutes.",
    "error_network": "Network error. Please check your connection and try again."
  }
}
\`\`\`

### Testing Requirements

**Unit Tests (Vitest + Testing Library):**
- Test form validation (email format, required field)
- Test successful submission flow (mock Supabase)
- Test generic success message display
- Test rate limiting error handling
- Test network error handling
- Test loading states during submission
- Test form disable during submission
- Test "Back to sign in" link navigation
- Test success state rendering after submission

**E2E Tests (Playwright):**
- Complete forgot password flow with valid email
- Forgot password flow with unregistered email (same success message)
- Rate limiting behavior (multiple rapid submissions)
- Form validation messages
- "Back to sign in" navigation
- Success state after submission
- Mobile responsiveness

**Manual Testing:**
- Complete flow with real email address
- Verify reset email is received
- Test with unregistered email (no email sent, same message shown)
- Test rate limiting (submit multiple times rapidly)
- Test email link format and expiry
- Verify success message doesn't reveal email existence
- Test on mobile devices (responsive design)

### Edge Cases to Handle

1. **Unregistered email:** Show same success message, no email sent (security)
2. **Invalid email format:** Client-side validation prevents submission
3. **Empty email field:** Required validation prevents submission
4. **Network error during submission:** Show error toast with retry option
5. **Rate limiting from Supabase:** Show "Too many requests" message with timing
6. **Form double-submit:** Disable button during submission
7. **User already on reset password page:** Allow re-requesting if needed
8. **Spam folder:** Success message reminds user to check spam
9. **Email takes time to arrive:** Set expectations in success message ("within a few minutes")

### Security Considerations

1. **Email Enumeration Prevention:** Never reveal whether email exists in system
2. **Generic Success Messages:** Always show same message regardless of email existence
3. **Rate Limiting:** Respect Supabase rate limits, show appropriate messaging
4. **Reset Link Expiry:** Supabase magic links expire (typically 1 hour)
5. **No Sensitive Data in URLs:** Email should not be in URL parameters
6. **CSRF Protection:** Next.js + Supabase SSR handles automatically
7. **Redirect URL Validation:** Ensure reset link goes to legitimate reset page

### Architecture Compliance

**Next.js 15 App Router Patterns:**
- Forgot password page can be a pure Client Component (no server-side auth check needed)
- Use \`'use client'\` directive
- Use \`useRouter()\` from \`next/navigation\` for client-side navigation
- Use \`redirect()\` is not needed (no auth required for this page)

**Supabase Client Usage:**
- Client Component: \`createBrowserClient()\` for password reset request
- No server-side Supabase calls needed for this story
- Reset link will contain token for Story 2.5

**TypeScript Strict Mode:**
- All form data properly typed
- Error handling with proper types
- No \`any\` types allowed
- Null checks for API responses

**Code Style (Antfu Config):**
- No semicolons
- Single quotes for JSX attributes
- Path aliases (\`@/\` prefix)
- Import organization (auto-sorted)

### Recent Patterns from Git History

**From Story 2.3 Commit (c3f83f2):**
- Auth pages in \`(unauth)/(center)/\` route group
- Client Component for forms with \`'use client'\` directive
- react-hook-form + zod validation pattern
- Toast notifications for success/error states
- Comprehensive unit tests co-located with pages
- i18n translations in all locale files (en, hi, bn)
- Generic error messages for security

**From Story 2.2 Commit (f283875):**
- Success state transitions in auth flows
- Cooldown timers for rate-limited actions
- Clear user messaging for async operations

**Pattern to Follow:**
\`\`\`typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/libs/supabase/client'
import { useTranslations } from 'next-intl'

const schema = z.object({
  email: z.string().email()
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const t = useTranslations('ForgotPassword')

  // Form logic here

  if (isSubmitted) {
    // Show success state
  }

  return (
    // Form UI
  )
}
\`\`\`

### Integration with Story 2.5 (Reset Password Page)

This story creates the REQUEST for password reset. Story 2.5 will handle the ACTUAL password reset.

**Handoff to Story 2.5:**
- Reset email contains magic link: \`/reset-password?token=...\`
- Token is validated by Supabase
- Story 2.5 will create the reset password page
- Story 2.5 will handle expired/invalid tokens

**What This Story Provides:**
- \`redirectTo\` URL configuration pointing to \`/reset-password\`
- User education about checking email
- Rate limiting and error handling patterns

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-complete-authentication-experience.md#Story-2.4]
- [Source: _bmad-output/implementation-artifacts/stories/2-3-user-login-with-session-management.md] (Previous story context)
- [Source: _bmad-output/planning-artifacts/ux-design/epic-2-auth-design-brief.md] (UX design decisions)
- [Source: _bmad-output/planning-artifacts/ux-design/epic-2-auth-component-strategy.md] (Component extraction guide)
- [Source: https://www.magicpatterns.com/c/1xdwsbsectczdt1gpzyd5r] (Forgot password design)
- [Source: docs/api-error-handling.md] (Error handling patterns)
- [Supabase Docs: Password Reset] (https://supabase.com/docs/guides/auth/passwords#reset-password)
- [Supabase API: resetPasswordForEmail] (https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail)
- [OWASP: Account Enumeration] (https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
