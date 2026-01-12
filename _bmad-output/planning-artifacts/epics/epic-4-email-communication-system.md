# Epic 4: Email Communication System

**Goal:** Users receive professional transactional emails

## Story 4.1: Email Infrastructure Setup (Resend)

As a **template user (developer)**,
I want **email sending infrastructure configured with Resend**,
So that **I can send transactional emails from my application**.

**Acceptance Criteria:**

**Given** the email system setup
**When** I configure Resend
**Then** RESEND_API_KEY environment variable is documented
**And** .env.example includes the required variable
**And** email sender address is configurable via env var

**Given** the email library setup
**When** I review the code structure
**Then** there is an email service module at `src/libs/email/`
**And** the service abstracts the provider (swappable later)
**And** TypeScript types are defined for email payloads

**Given** email configuration
**When** I review the sender setup
**Then** FROM address uses a configurable domain
**And** reply-to address is configurable
**And** sender name matches application branding

**Given** a test email send
**When** I trigger an email in development
**Then** email is sent successfully via Resend API
**And** delivery status is logged
**And** errors are caught and logged appropriately

**Given** the email service
**When** I review the API
**Then** there is a `sendEmail` function accepting template + data
**And** function returns success/failure status
**And** function is async and properly typed

---

## Story 4.2: Welcome Email Template

As a **new user who just signed up**,
I want **to receive a professional welcome email**,
So that **I feel welcomed and know my account was created**.

**Acceptance Criteria:**

**Given** a user completes registration
**When** their account is created
**Then** a welcome email is sent to their address
**And** the email arrives within 30 seconds

**Given** the welcome email
**When** I view it in my inbox
**Then** subject line is welcoming (e.g., "Welcome to VT SaaS Template!")
**And** sender name is the application name
**And** email renders correctly in major clients (Gmail, Outlook)

**Given** the welcome email content
**When** I read the email
**Then** I see a personalized greeting (if name available)
**And** I see brief info about getting started
**And** I see a CTA button to access the app
**And** I see contact/support information

**Given** the welcome email template
**When** I review the code
**Then** template is built with React Email
**And** template is in `src/libs/email/templates/`
**And** template uses consistent branding (colors, logo)
**And** template is responsive (mobile-friendly)

**Given** the welcome email
**When** I view it on mobile
**Then** layout adapts properly
**And** CTA button is tap-friendly
**And** text is readable without zooming

---

## Story 4.3: Email Verification Template

As a **new user needing to verify my email**,
I want **to receive a clear verification email with a link**,
So that **I can verify my account and access all features**.

**Acceptance Criteria:**

**Given** a user registers with email/password
**When** registration completes
**Then** a verification email is sent automatically
**And** email contains a secure verification link

**Given** the verification email
**When** I view it in my inbox
**Then** subject line is clear (e.g., "Verify your email")
**And** purpose of the email is immediately obvious
**And** verification link/button is prominent

**Given** the verification email content
**When** I read the email
**Then** I see clear instructions to click the link
**And** I see information about link expiration
**And** I see what to do if I didn't request this
**And** I see a fallback text link if button doesn't work

**Given** the verification link
**When** I click it
**Then** I am taken to the app's verification handler
**And** link contains secure token
**And** link works only once (consumed on use)

**Given** the verification email template
**When** I review the code
**Then** template is built with React Email
**And** template matches welcome email branding
**And** verification URL is properly escaped
**And** template handles long URLs gracefully

---

## Story 4.4: Password Reset Email Template

As a **user who forgot my password**,
I want **to receive a password reset email with a secure link**,
So that **I can reset my password and regain access**.

**Acceptance Criteria:**

**Given** a user requests password reset
**When** they submit their email on forgot password page
**Then** a password reset email is sent (if account exists)
**And** email arrives within 30 seconds

**Given** the password reset email
**When** I view it in my inbox
**Then** subject line is clear (e.g., "Reset your password")
**And** sender is recognizable as the application
**And** email doesn't reveal if account exists (security)

**Given** the password reset email content
**When** I read the email
**Then** I see clear instructions to reset password
**And** I see the reset link/button prominently
**And** I see link expiration time (e.g., "expires in 1 hour")
**And** I see security notice if I didn't request this

**Given** the reset link
**When** I click it
**Then** I am taken to the password reset page
**And** link contains secure, single-use token
**And** token is validated before showing reset form

**Given** the password reset email template
**When** I review the code
**Then** template is built with React Email
**And** template matches other email branding
**And** security messaging is appropriate
**And** template handles edge cases (expired links mentioned)

---

## Story 4.5: Email Error Handling & Logging

As a **developer maintaining the application**,
I want **robust error handling for email sending**,
So that **I can diagnose issues and ensure reliability**.

**Acceptance Criteria:**

**Given** an email send fails
**When** the Resend API returns an error
**Then** the error is caught gracefully
**And** error details are logged with context
**And** the calling code receives failure status
**And** user experience degrades gracefully (no crash)

**Given** email sending
**When** any email is sent (success or failure)
**Then** event is logged with: type, recipient (hashed), status, timestamp
**And** logs are structured (JSON format)
**And** sensitive data is not logged (full email, tokens)

**Given** a transient email failure
**When** Resend returns a retryable error
**Then** retry is attempted (up to 3 times)
**And** exponential backoff is used between retries
**And** final failure is logged if all retries fail

**Given** critical email failures (verification, reset)
**When** emails fail to send
**Then** user is informed they may need to retry
**And** fallback messaging is shown in UI
**And** no silent failures for critical emails

**Given** email sending in development
**When** RESEND_API_KEY is not set
**Then** emails are logged to console instead of sending
**And** developer can see email content locally
**And** no errors thrown for missing API key in dev

---
