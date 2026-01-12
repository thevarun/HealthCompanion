---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - /Users/varuntorka/Coding/vt-saas-template/_bmad-output/planning-artifacts/prd.md
  - /Users/varuntorka/Coding/vt-saas-template/_bmad-output/planning-artifacts/architecture.md
  - /Users/varuntorka/Coding/vt-saas-template/_bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'epics-and-stories'
project_name: 'VT SaaS Template'
status: 'complete'
completedAt: '2026-01-12'
totalEpics: 10
totalStories: 59
frCoverage: '40/40 (100%)'
---

# VT SaaS Template - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for VT SaaS Template, decomposing the requirements from the PRD, UX Design, and Architecture documents into implementable stories.

**Project Context:** Brownfield transformation - extracting production HealthCompanion app into reusable VT SaaS Template. This is NOT a greenfield project.

## Requirements Inventory

### Functional Requirements

**Authentication & User Management:**
- FR-AUTH-001: User Registration - Email/password signup with email verification, password strength requirements, OAuth infrastructure ready
- FR-AUTH-002: User Login - Email/password auth, "Remember me", password reset, session management, error handling
- FR-AUTH-003: User Profile - View/edit profile info, username setting (unique, validated), account deletion (GDPR)
- FR-AUTH-004: Session Management - HTTP-only cookies, automatic refresh, multi-device support, timeout on inactivity
- FR-AUTH-005: Authentication UI/UX (Tier 1) - Forgot/reset password flow, social auth buttons (Google/GitHub), email verification UI, loading/error states, responsive auth forms

**Onboarding:**
- FR-ONB-001: Post-Signup Wizard - 3-step flow (username, feature intro, preferences), skip option, progress indicator
- FR-ONB-002: Dashboard Welcome State - First-time greeting, quick-start guide, empty states, feature discovery

**User Feedback:**
- FR-FEED-001: Feedback Widget - Simple form accessible anywhere, type selection (bug/feature/praise), confirmation message
- FR-FEED-002: Feedback Management - Admin view of submissions, filter by type, mark as reviewed, CSV export

**Admin Panel:**
- FR-ADMIN-001: User Management - View user list, search users, view details, account actions (suspend, delete, reset)
- FR-ADMIN-002: System Monitoring - Dashboard with metrics (users, signups, active users, errors, feedback count)
- FR-ADMIN-003: Access Control - Admin role via DB flag or env config, protected routes, audit logging

**Internationalization:**
- FR-I18N-001: Multi-Language Support - English, Hindi, Bengali (extensible), language switcher, persistent preference
- FR-I18N-002: Content Translation - JSON translation files, dynamic loading, English fallback

**Email System:**
- FR-EMAIL-001: Transactional Emails - Welcome email, email verification, password reset, React Email templates
- FR-EMAIL-002: Email Delivery - Resend/SendGrid/SMTP integration, error handling, queue (future)

**CI/CD & Deployment:**
- FR-CICD-001: Automated Testing - GitHub Actions on push/PR, ESLint, TypeScript, unit tests, build checks
- FR-CICD-002: Deployment Pipeline - Auto-deploy to Vercel on main, preview deployments, env management, migrations

**Error Handling:**
- FR-ERROR-001: Error Boundaries - React boundaries at app/route/component levels, fallback UI, Sentry logging
- FR-ERROR-002: API Error Handling - Consistent error format {error, code, details}, proper HTTP status codes, validation errors

**UI/UX Features:**
- FR-UI-001: Responsive Design - Mobile-first, 3 breakpoints (<768px, 768-1024px, >1024px), touch-friendly
- FR-UI-002: Dark Mode - System detection, manual toggle, consistent palette, persisted preference
- FR-UI-003: Loading States - Skeleton loaders, spinners, optimistic updates, smooth transitions
- FR-UI-004: Empty States - Helpful illustrations, clear CTAs, contextual guidance

**SEO Foundations:**
- FR-SEO-001: Internationalization SEO - hreflang tags for all languages, alternates.languages metadata
- FR-SEO-002: Social Sharing (Open Graph) - Default OG image, openGraph metadata, Twitter Cards
- FR-SEO-003: Crawler Configuration - robots.txt blocking authenticated routes, proper indexing directives
- FR-SEO-004: Dynamic Open Graph Images - Auto-generated OG images, @vercel/og, customizable templates

**Go-To-Market Features:**
- FR-GTM-001: Referral/Share Widget - Share component, social targets (Twitter, LinkedIn, etc.), referral tracking
- FR-GTM-002: Private Shareable URLs - Unique URLs for content, access control, expiration, view tracking
- FR-GTM-003: Changelog-to-Content Automation - GitHub Action on releases, LLM transforms changelog, n8n publishing
- FR-GTM-004: Programmatic SEO Infrastructure - Page templates from JSON data, dynamic routes, sitemap generation
- FR-GTM-005: Pre-Launch Landing Page - Waitlist capture, interest form, redirect logic, admin view
- FR-GTM-006: Social Proof Widgets - Static counters, testimonials, trust badges

**AI Chat Integration (Example Code):**
- FR-CHAT-001: AI Chat Interface - Real-time SSE streaming, conversation threading, message history
- FR-CHAT-002: Chat API Proxy - Secure API key management, Dify proxy pattern, error recovery

**Analytics & Instrumentation:**
- FR-ANALYTICS-001: Event Tracking - Key user flows, critical actions, friction points, PostHog/Amplitude integration
- FR-ANALYTICS-002: User Flow Instrumentation - Funnel tracking, feature adoption, session replay (opt-in)
- FR-ANALYTICS-003: Developer Experience - trackEvent utility, TypeScript types, dev mode console logging
- FR-ANALYTICS-004: Founder Analytics Dashboard - Internal dashboard, PostgreSQL data source, key metrics

### Non-Functional Requirements

**Performance:**
- NFR-PERF-001: Page Load - FCP < 1.5s, TTI < 3.5s, Lighthouse Performance ≥ 90
- NFR-PERF-002: API Response - p95 < 500ms, query optimization, efficient caching
- NFR-PERF-003: Bundle Size - Initial JS < 300KB gzipped, code splitting, dynamic imports

**Scalability:**
- NFR-SCALE-001: Serverless Architecture - Auto-scaling functions, no server management, pay-per-use compatible
- NFR-SCALE-002: Database Design - Thousands of users without degradation, proper indexes, connection pooling

**Security:**
- NFR-SEC-001: Authentication Security - Bcrypt (Supabase), HTTP-only cookies, CSRF protection, rate limiting
- NFR-SEC-002: Data Protection - HTTPS-only, env vars server-side only, secure secrets storage, SQL injection prevention
- NFR-SEC-003: Dependency Security - Zero high/critical npm audit vulnerabilities, quarterly updates, Dependabot

**Reliability:**
- NFR-REL-001: Error Recovery - Graceful degradation, error boundaries, retry logic
- NFR-REL-002: Data Integrity - Database transactions, boundary validation, type safety (TypeScript + Zod)

**Maintainability:**
- NFR-MAINT-001: Code Quality - TypeScript strict mode, ESLint enforced, Prettier formatting
- NFR-MAINT-002: Documentation - Inline comments, README, env var docs, ADRs
- NFR-MAINT-003: Testing - Unit tests for utilities, example tests, E2E for critical paths

**Accessibility:**
- NFR-ACCESS-001: WCAG Compliance - Level AA, keyboard navigation, screen reader compatible, 4.5:1 contrast
- NFR-ACCESS-002: Assistive Technology - Semantic HTML, skip links, proper form labels, focus management

**Compatibility:**
- NFR-COMPAT-001: Browser Support - Chrome, Firefox, Safari, Edge (last 2 versions), mobile browsers
- NFR-COMPAT-002: Platform Support - Vercel primary, Netlify/Railway documented, PostgreSQL ecosystem

### Additional Requirements

**From Architecture - Upgrade Requirements:**
- Upgrade Next.js 14 → 15 (async params/searchParams API changes)
- Upgrade React 18 → 19 (concurrent rendering, stricter hooks)
- Upgrade Supabase SDK to latest (Auth V2 API changes)
- Upgrade TypeScript 5.6 → 5.7+ (stricter type inference)
- Apply all security patches, npm audit clean

**From Architecture - Brownfield Constraints:**
- Preserve existing middleware orchestration (i18n → session refresh → auth check)
- Preserve API proxy pattern for external services
- Preserve Supabase SSR client factories (browser/server/middleware)
- Preserve shadcn/ui component system (38+ components)
- Per-project PostgreSQL schemas for multi-project DB reuse

**From Architecture - Core vs Removable:**
- CORE (cannot remove): Auth, i18n, UI system, Database, Email, Error Handling, CI/CD
- REMOVABLE (modular): AI Chat, Thread Management, Admin Panel, Feedback Widget

**From Architecture - Technical Patterns:**
- Three Supabase client factories for different contexts
- Edge runtime middleware for session validation (<10ms latency)
- Zod schemas for API validation + React Hook Form integration
- PostHog recommended for analytics (provider-agnostic design)
- Resend for email (provider-agnostic design)

**From UX Design - Experience Requirements:**
- 2-hour rebrand capability (colors, fonts, logo in single sources)
- Mobile-first with touch-friendly interactions (44x44px minimum targets)
- Professional polish throughout (micro-interactions, transitions)
- Empty states with helpful guidance and CTAs
- Streamlined auth flows with clear error handling
- Quick customization guide documented for future-self

**From UX Design - Implementation Priorities:**
- Phase 1: Auth flow, basic navigation, dashboard foundation, settings page
- Phase 2: Onboarding wizard, feedback widget, empty states, micro-interactions
- Phase 3: Admin panel, advanced onboarding, enhanced accessibility
- Phase 4: Performance tuning, analytics integration, advanced customization

### FR Coverage Map

| FR ID | Epic | Description |
|-------|------|-------------|
| FR-CICD-001 | Epic 1 | Automated Testing - GitHub Actions |
| FR-CICD-002 | Epic 1 | Deployment Pipeline - Vercel |
| FR-ERROR-001 | Epic 1 | Error Boundaries - React |
| FR-ERROR-002 | Epic 1 | API Error Handling |
| FR-UI-001 | Epic 1 | Responsive Design (validate existing) |
| FR-UI-002 | Epic 1 | Dark Mode (validate existing) |
| FR-I18N-001 | Epic 1 | Multi-Language Support (validate existing) |
| FR-I18N-002 | Epic 1 | Content Translation (validate existing) |
| FR-AUTH-001 | Epic 2 | User Registration |
| FR-AUTH-002 | Epic 2 | User Login |
| FR-AUTH-003 | Epic 2 | User Profile |
| FR-AUTH-004 | Epic 2 | Session Management |
| FR-AUTH-005 | Epic 2 | Authentication UI/UX (Tier 1) |
| FR-ONB-001 | Epic 3 | Post-Signup Wizard |
| FR-ONB-002 | Epic 3 | Dashboard Welcome State |
| FR-UI-003 | Epic 3 | Loading States |
| FR-UI-004 | Epic 3 | Empty States |
| FR-EMAIL-001 | Epic 4 | Transactional Emails |
| FR-EMAIL-002 | Epic 4 | Email Delivery |
| FR-FEED-001 | Epic 5 | Feedback Widget |
| FR-FEED-002 | Epic 5 | Feedback Management |
| FR-ADMIN-001 | Epic 6 | User Management |
| FR-ADMIN-002 | Epic 6 | System Monitoring |
| FR-ADMIN-003 | Epic 6 | Access Control |
| FR-SEO-001 | Epic 7 | Internationalization SEO (hreflang) |
| FR-SEO-002 | Epic 7 | Social Sharing (Open Graph) |
| FR-SEO-003 | Epic 7 | Crawler Configuration |
| FR-SEO-004 | Epic 7 | Dynamic Open Graph Images |
| FR-GTM-001 | Epic 8 | Referral/Share Widget |
| FR-GTM-002 | Epic 8 | Private Shareable URLs |
| FR-GTM-003 | Epic 8 | Changelog-to-Content Automation |
| FR-GTM-004 | Epic 8 | Programmatic SEO Infrastructure |
| FR-GTM-005 | Epic 8 | Pre-Launch Landing Page |
| FR-GTM-006 | Epic 8 | Social Proof Widgets |
| FR-ANALYTICS-001 | Epic 9 | Event Tracking |
| FR-ANALYTICS-002 | Epic 9 | User Flow Instrumentation |
| FR-ANALYTICS-003 | Epic 9 | Developer Experience |
| FR-ANALYTICS-004 | Epic 9 | Founder Analytics Dashboard |
| FR-CHAT-001 | Epic 10 | AI Chat Interface (Example) |
| FR-CHAT-002 | Epic 10 | Chat API Proxy (Example) |

## Epic List

### Epic 1: Template Foundation & Modernization
**Goal:** Template users get a clean, upgraded foundation ready for customization

This epic handles the brownfield transformation - upgrading all dependencies to latest versions, rebranding from HealthCompanion to VT SaaS Template, and ensuring core infrastructure (CI/CD, error handling, responsive design, dark mode, i18n) works correctly after upgrades.

**FRs covered:** FR-CICD-001, FR-CICD-002, FR-ERROR-001, FR-ERROR-002, FR-UI-001, FR-UI-002, FR-I18N-001, FR-I18N-002

**Key Deliverables:**
- Next.js 15, React 19, Supabase latest, TypeScript 5.7+ upgrades complete
- All "HealthCompanion" references replaced with "VT SaaS Template"
- CI/CD pipeline validated and passing
- Error boundaries working at all levels
- Existing features (dark mode, i18n, responsive) validated post-upgrade

---

### Epic 2: Complete Authentication Experience
**Goal:** Users can register, login, reset passwords, and use social auth with polished flows

Complete end-to-end authentication system with all UI states including social auth buttons, forgot/reset password flows, email verification UI, and proper loading/error states.

**FRs covered:** FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004, FR-AUTH-005

**Key Deliverables:**
- Email/password registration with validation
- Login with "Remember me" functionality
- User profile page with username setting
- Forgot password → email → reset password flow
- Google and GitHub OAuth buttons
- Email verification UI with resend capability
- All auth forms with loading states and error handling

---

### Epic 3: User Onboarding & Welcome
**Goal:** New users feel guided and welcomed, not dumped on empty dashboard

First-time user experience including post-signup wizard and helpful empty states throughout the application.

**FRs covered:** FR-ONB-001, FR-ONB-002, FR-UI-003, FR-UI-004

**Key Deliverables:**
- 3-step onboarding wizard (username, features, preferences)
- Skip option with ability to complete later
- Progress indicator
- Dashboard welcome state for new users
- Empty states with helpful CTAs throughout app
- Loading states (skeletons, spinners) for async content

---

### Epic 4: Email Communication System
**Goal:** Users receive professional transactional emails

Complete email infrastructure with React Email templates for all system communications.

**FRs covered:** FR-EMAIL-001, FR-EMAIL-002

**Key Deliverables:**
- Welcome email after signup
- Email verification with secure link
- Password reset email
- React Email templates (customizable)
- Resend integration (provider-agnostic pattern)
- Error handling for failed sends

---

### Epic 5: User Feedback Collection
**Goal:** Users can easily share feedback; admins can review and manage submissions

Simple but complete feedback loop from widget to admin review.

**FRs covered:** FR-FEED-001, FR-FEED-002

**Key Deliverables:**
- Feedback widget accessible from any page
- Type selection (bug/feature/praise)
- Confirmation message after submission
- Admin view of all submissions
- Filter by type, mark as reviewed
- CSV export capability

---

### Epic 6: Admin Panel & System Management
**Goal:** Admins can manage users and monitor system health

User management, system metrics dashboard, and role-based access control.

**FRs covered:** FR-ADMIN-001, FR-ADMIN-002, FR-ADMIN-003

**Key Deliverables:**
- Admin-protected routes
- User list with search
- User details view (signup date, last login, status)
- Account actions (suspend, delete, reset password)
- System metrics dashboard (users, signups, errors)
- Admin role via DB flag or env config
- Audit logging for admin actions

---

### Epic 7: SEO & Social Sharing Foundations
**Goal:** Product is discoverable; content is shareable with rich previews

Discoverability infrastructure for search engines and social platforms.

**FRs covered:** FR-SEO-001, FR-SEO-002, FR-SEO-003, FR-SEO-004

**Key Deliverables:**
- hreflang tags for all supported languages
- Open Graph metadata on key pages
- Twitter Card support
- robots.txt blocking authenticated routes
- Dynamic OG image generation (@vercel/og)
- Customizable OG image templates

---

### Epic 8: Go-To-Market Features
**Goal:** Pre-launch and growth infrastructure ready for product launches

Marketing and growth enablement features for launching products built on the template.

**FRs covered:** FR-GTM-001, FR-GTM-002, FR-GTM-003, FR-GTM-004, FR-GTM-005, FR-GTM-006

**Key Deliverables:**
- Share/referral widget component
- Private shareable URLs with access control
- Changelog-to-content automation (GitHub Action + LLM + n8n)
- Programmatic SEO page templates
- Pre-launch landing page with waitlist
- Social proof widgets (counters, testimonials, badges)

---

### Epic 9: Analytics & Founder Dashboard
**Goal:** Product owner can track user behavior and key conversion metrics

Instrumentation and insights infrastructure.

**FRs covered:** FR-ANALYTICS-001, FR-ANALYTICS-002, FR-ANALYTICS-003, FR-ANALYTICS-004

**Key Deliverables:**
- Event tracking utility (trackEvent wrapper)
- PostHog integration (swappable)
- User flow funnel tracking
- TypeScript types for events
- Dev mode: log to console
- Founder analytics dashboard (PostgreSQL-based)
- Key metrics: signups, activation, referrals, conversions

---

### Epic 10: AI Chat Integration (Example Module)
**Goal:** Template users see production-quality streaming patterns they can learn from or remove

Already exists from HealthCompanion - needs cleanup and documentation as example code.

**FRs covered:** FR-CHAT-001, FR-CHAT-002

**Key Deliverables:**
- Clean up existing chat interface code
- Document SSE streaming patterns
- Document API proxy pattern
- Clear removal instructions
- Mark as "example code" in documentation

---

## Epic 1: Template Foundation & Modernization

**Goal:** Template users get a clean, upgraded foundation ready for customization

### Story 1.1: Upgrade Next.js to Version 15

As a **template user (developer)**,
I want **the template upgraded to Next.js 15**,
So that **I have access to the latest framework features and performance improvements**.

**Acceptance Criteria:**

**Given** the current Next.js 14 installation
**When** I upgrade to Next.js 15
**Then** the package.json shows next@15.x
**And** all page components use async params/searchParams patterns
**And** `npm run build` completes with 0 errors
**And** `npm run dev` starts without errors
**And** all existing routes render correctly

**Given** any page using params or searchParams
**When** I review the component code
**Then** params and searchParams are awaited before use
**And** TypeScript types are updated for async params

---

### Story 1.2: Upgrade React to Version 19

As a **template user (developer)**,
I want **the template upgraded to React 19**,
So that **I can use the latest React features and patterns**.

**Acceptance Criteria:**

**Given** the current React 18 installation
**When** I upgrade to React 19
**Then** the package.json shows react@19.x and react-dom@19.x
**And** all components render without errors
**And** no console warnings about deprecated patterns
**And** Server Components continue to work correctly
**And** Client Components with hooks function properly

**Given** any component using useEffect or other hooks
**When** I test the component
**Then** hook behavior matches React 19 expectations
**And** cleanup functions execute correctly

---

### Story 1.3: Upgrade Supabase SDK & Auth Patterns

As a **template user (developer)**,
I want **the Supabase SDK upgraded to the latest version**,
So that **I have the most secure and feature-complete auth integration**.

**Acceptance Criteria:**

**Given** the current Supabase SDK installation
**When** I upgrade to the latest @supabase/supabase-js
**Then** the package.json shows the latest stable version
**And** browser client factory works correctly
**And** server client factory works correctly
**And** middleware client factory works correctly

**Given** a user attempting to sign in
**When** they submit valid credentials
**Then** session is created and stored in cookies
**And** user is redirected to dashboard
**And** session refresh works automatically

**Given** a protected route
**When** an unauthenticated user attempts access
**Then** they are redirected to sign-in page
**And** middleware correctly validates session

---

### Story 1.4: Upgrade TypeScript & Fix Type Errors

As a **template user (developer)**,
I want **TypeScript upgraded to 5.7+ with all type errors resolved**,
So that **I have the best type safety and developer experience**.

**Acceptance Criteria:**

**Given** the current TypeScript installation
**When** I upgrade to TypeScript 5.7+
**Then** the package.json shows typescript@5.7.x or higher
**And** `npm run check-types` passes with 0 errors
**And** strict mode remains enabled in tsconfig.json
**And** no type assertions added just to silence errors

**Given** any component or utility file
**When** I hover over variables in VS Code
**Then** type inference is accurate and helpful
**And** no `any` types introduced during upgrade

---

### Story 1.5: Rebrand to VT SaaS Template

As a **template user (developer)**,
I want **all HealthCompanion references replaced with VT SaaS Template**,
So that **the template is ready for customization without domain-specific content**.

**Acceptance Criteria:**

**Given** a search for "HealthCompanion" in the codebase
**When** I search all files (excluding node_modules, .git)
**Then** zero matches are found
**And** all instances replaced with "VT SaaS Template" or generic equivalent

**Given** the application metadata
**When** I check page titles, descriptions, and OG tags
**Then** they reflect "VT SaaS Template" branding
**And** no health-specific messaging remains

**Given** any UI text visible to users
**When** I review the application
**Then** content is generic/placeholder
**And** suitable for any SaaS use case

**Given** the README and documentation
**When** I review docs
**Then** project is described as "VT SaaS Template"
**And** setup instructions are template-focused

---

### Story 1.6: Validate & Enhance Error Boundaries

As a **user of applications built with this template**,
I want **graceful error handling that prevents white screens**,
So that **I can recover from errors without losing my work**.

**Acceptance Criteria:**

**Given** a React error in any component
**When** the error occurs during rendering
**Then** the nearest error boundary catches it
**And** a user-friendly fallback UI is displayed
**And** the error is logged to Sentry (if configured)

**Given** the application structure
**When** I review error boundary placement
**Then** boundaries exist at app level (global fallback)
**And** boundaries exist at route level (page isolation)
**And** boundaries exist for critical component groups

**Given** an error boundary fallback
**When** a user sees the error UI
**Then** they can attempt to recover (retry/refresh)
**And** they can navigate to a safe page
**And** the message is helpful, not technical

---

### Story 1.7: Standardize API Error Handling

As a **developer consuming API endpoints**,
I want **consistent error response format across all APIs**,
So that **I can handle errors predictably in my frontend code**.

**Acceptance Criteria:**

**Given** any API endpoint returning an error
**When** the error response is sent
**Then** it follows the format `{ error: string, code: string, details?: object }`
**And** HTTP status codes are used correctly (400, 401, 403, 404, 500)

**Given** a validation error on API input
**When** the request contains invalid data
**Then** response is 400 Bad Request
**And** `details` contains field-level error information
**And** error message is user-friendly

**Given** an authentication error
**When** the user is not authenticated
**Then** response is 401 Unauthorized
**And** `code` is "UNAUTHORIZED"

**Given** an authorization error
**When** the user lacks permission
**Then** response is 403 Forbidden
**And** `code` is "FORBIDDEN"

---

### Story 1.8: Validate CI/CD Pipeline

As a **template user (developer)**,
I want **a working CI/CD pipeline that catches issues before deployment**,
So that **I can deploy with confidence**.

**Acceptance Criteria:**

**Given** a push to any branch
**When** GitHub Actions workflow triggers
**Then** ESLint check runs and passes
**And** TypeScript check runs and passes
**And** Unit tests run and pass
**And** Build completes successfully

**Given** a pull request to main branch
**When** the PR is created
**Then** all checks must pass before merge is allowed
**And** preview deployment is created on Vercel

**Given** a merge to main branch
**When** the merge completes
**Then** production deployment triggers automatically
**And** deployment completes successfully on Vercel

**Given** the CI/CD configuration
**When** I review the workflow files
**Then** build artifacts are cached for performance
**And** environment variables are properly configured

---

### Story 1.9: Validate Existing Features Post-Upgrade

As a **template user (developer)**,
I want **confirmation that existing features work after all upgrades**,
So that **I know the template is stable and production-ready**.

**Acceptance Criteria:**

**Given** the dark mode toggle
**When** I switch between light and dark modes
**Then** the theme changes correctly throughout the app
**And** preference is persisted across page refreshes
**And** system preference detection works

**Given** the language switcher
**When** I change language to Hindi or Bengali
**Then** all UI text updates to the selected language
**And** URL reflects the locale prefix
**And** preference is persisted

**Given** the responsive design
**When** I resize the browser to mobile width (<768px)
**Then** layout adapts correctly
**And** navigation transforms to mobile pattern
**And** touch targets are appropriately sized (44x44px)

**Given** the tablet viewport (768-1024px)
**When** I view the application
**Then** layout adapts for tablet
**And** all features remain accessible

**Given** Lighthouse audit
**When** I run Lighthouse on key pages
**Then** Performance score is ≥ 90
**And** Accessibility score is ≥ 90
**And** Best Practices score is ≥ 90

---

## Epic 2: Complete Authentication Experience

**Goal:** Users can register, login, reset passwords, and use social auth with polished flows

### Story 2.1: User Registration with Email/Password

As a **new user**,
I want **to create an account with my email and password**,
So that **I can access the application's features**.

**Acceptance Criteria:**

**Given** I am on the sign-up page
**When** I enter a valid email and password meeting requirements
**Then** my account is created in Supabase
**And** a verification email is sent to my address
**And** I see a message to check my email

**Given** I enter an email that already exists
**When** I submit the registration form
**Then** I see a clear error message "Email already registered"
**And** I am offered a link to sign in instead

**Given** I enter a weak password
**When** I attempt to submit
**Then** I see validation requirements (min 8 chars, complexity)
**And** the form does not submit until requirements are met

**Given** the registration form
**When** I view it on any device
**Then** form fields are appropriately sized
**And** keyboard type is correct for email field
**And** password field has show/hide toggle

---

### Story 2.2: Email Verification Flow

As a **newly registered user**,
I want **to verify my email address**,
So that **I can fully access my account**.

**Acceptance Criteria:**

**Given** I just registered
**When** I land on the post-registration page
**Then** I see "Check your email for verification link"
**And** I see a "Resend verification email" button

**Given** I click "Resend verification email"
**When** the request is sent
**Then** I see a loading state on the button
**And** after success, I see "Email sent!" confirmation
**And** button shows cooldown timer (60 seconds) before resend

**Given** I click the verification link in my email
**When** the link is valid
**Then** I am redirected to the app with verified status
**And** I see a success message "Email verified!"
**And** I can now access all features

**Given** I click an expired verification link
**When** the token is no longer valid
**Then** I see "This link has expired"
**And** I am offered option to resend verification email

**Given** I try to access protected routes unverified
**When** my email is not yet verified
**Then** I am shown the verification required screen
**And** I cannot proceed until verified

---

### Story 2.3: User Login with Session Management

As a **registered user**,
I want **to sign in to my account**,
So that **I can access my dashboard and data**.

**Acceptance Criteria:**

**Given** I am on the sign-in page
**When** I enter valid email and password
**Then** I am authenticated successfully
**And** session is stored in HTTP-only cookies
**And** I am redirected to the dashboard

**Given** I check "Remember me" option
**When** I sign in successfully
**Then** my session persists for extended duration
**And** I remain signed in across browser restarts

**Given** I enter invalid credentials
**When** I submit the sign-in form
**Then** I see "Invalid email or password"
**And** no indication of which field is wrong (security)
**And** I can retry immediately

**Given** I am signed in and idle
**When** my session approaches expiry
**Then** the session is automatically refreshed
**And** I am not unexpectedly logged out

**Given** I am signed in
**When** I try to access sign-in page
**Then** I am redirected to dashboard
**And** I don't see the sign-in form

**Given** I am not signed in
**When** I try to access a protected route
**Then** I am redirected to sign-in page
**And** after sign-in, I am returned to my intended destination

---

### Story 2.4: Forgot Password Flow

As a **user who forgot my password**,
I want **to request a password reset**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

**Given** I am on the sign-in page
**When** I look for password recovery
**Then** I see a "Forgot password?" link clearly visible

**Given** I click "Forgot password?"
**When** the forgot password page loads
**Then** I see an email input field
**And** clear instructions to enter my email

**Given** I enter my registered email
**When** I submit the forgot password form
**Then** I see "Check your email for reset link"
**And** a password reset email is sent
**And** the email contains a secure reset link

**Given** I enter an unregistered email
**When** I submit the forgot password form
**Then** I see the same "Check your email" message (security)
**And** no indication whether email exists in system

**Given** I submit multiple reset requests
**When** I exceed rate limits
**Then** I see "Too many requests. Please try again later."
**And** I am temporarily blocked from requesting

---

### Story 2.5: Reset Password Page

As a **user with a password reset link**,
I want **to set a new password**,
So that **I can access my account with new credentials**.

**Acceptance Criteria:**

**Given** I click the reset link from my email
**When** the token is valid
**Then** I see a reset password form
**And** I can enter a new password

**Given** I am on the reset password form
**When** I enter a new password meeting requirements
**Then** my password is updated successfully
**And** I see "Password reset successful!"
**And** I am redirected to sign-in page

**Given** I enter a password not meeting requirements
**When** I try to submit
**Then** I see validation errors inline
**And** requirements are clearly displayed
**And** form does not submit until valid

**Given** I click an expired reset link
**When** the token is no longer valid
**Then** I see "This reset link has expired"
**And** I am offered a link to request a new reset

**Given** I click a malformed or invalid reset link
**When** the token cannot be verified
**Then** I see "Invalid reset link"
**And** I am offered a link to request a new reset

---

### Story 2.6: Social Authentication (Google & GitHub)

As a **user who prefers social login**,
I want **to sign in with Google or GitHub**,
So that **I don't need to remember another password**.

**Acceptance Criteria:**

**Given** I am on the sign-in page
**When** I view the authentication options
**Then** I see "Continue with Google" button with Google icon
**And** I see "Continue with GitHub" button with GitHub icon
**And** buttons are styled consistently with design system

**Given** I am on the sign-up page
**When** I view the registration options
**Then** I see the same social auth buttons
**And** they work for both new and existing accounts

**Given** I click "Continue with Google"
**When** OAuth flow initiates
**Then** I see a loading state on the button
**And** I am redirected to Google's auth page
**And** after authorization, I return to the app authenticated

**Given** I click "Continue with GitHub"
**When** OAuth flow initiates
**Then** I see a loading state on the button
**And** I am redirected to GitHub's auth page
**And** after authorization, I return to the app authenticated

**Given** OAuth fails (user cancels or error)
**When** I return to the app
**Then** I see a clear error message
**And** I can try again or use email/password

**Given** I sign in with social auth for the first time
**When** my account is created
**Then** my profile is populated with available data (name, avatar)
**And** I am directed to onboarding if applicable

---

### Story 2.7: User Profile Page

As a **signed-in user**,
I want **to view and edit my profile information**,
So that **I can personalize my account**.

**Acceptance Criteria:**

**Given** I am signed in
**When** I navigate to my profile page
**Then** I see my current profile information
**And** I see my email address (not editable)
**And** I see my username (editable)
**And** I see my display name (if set)

**Given** I want to set my username
**When** I enter a username
**Then** I see real-time availability check
**And** valid usernames show green checkmark
**And** taken usernames show error message

**Given** I enter an invalid username format
**When** I type in the username field
**Then** I see validation rules (alphanumeric, min/max length)
**And** invalid input is highlighted

**Given** I make changes to my profile
**When** I click "Save"
**Then** I see a loading state
**And** on success, I see "Profile updated!" toast
**And** changes are reflected immediately

**Given** I want to delete my account
**When** I look for account deletion
**Then** I find a clearly marked option
**And** I am warned about permanent data loss
**And** I must confirm the action explicitly

---

### Story 2.8: Auth UI Polish (Loading & Error States)

As a **user interacting with authentication forms**,
I want **clear feedback on my actions**,
So that **I know what's happening and can recover from errors**.

**Acceptance Criteria:**

**Given** I submit any auth form (sign-in, sign-up, reset)
**When** the request is processing
**Then** submit button shows loading spinner
**And** button is disabled to prevent double-submit
**And** form fields are disabled during processing

**Given** a form field has a validation error
**When** the error is detected (on blur or submit)
**Then** the field shows red border
**And** error message appears below the field
**And** error is specific and actionable

**Given** an auth action succeeds
**When** the operation completes
**Then** I see a success toast notification
**And** toast auto-dismisses after 5 seconds
**And** I can manually dismiss the toast

**Given** an auth action fails (network error)
**When** the request fails
**Then** I see an error toast with retry option
**And** form remains filled with my input
**And** I can retry without re-entering data

**Given** any auth form
**When** I press Enter in a form field
**Then** the form submits (if valid)
**And** focus management is correct

**Given** auth forms on mobile
**When** I interact with the form
**Then** keyboard doesn't obscure the input
**And** form scrolls appropriately
**And** submit button remains accessible

---

## Epic 3: User Onboarding & Welcome

**Goal:** New users feel guided and welcomed, not dumped on empty dashboard

### Story 3.1: Onboarding Wizard - Step 1 (Username)

As a **new user who just verified my email**,
I want **to set my username as the first step of onboarding**,
So that **I have a unique identity in the application**.

**Acceptance Criteria:**

**Given** I have just verified my email
**When** I am redirected to the app
**Then** I land on the onboarding wizard at Step 1
**And** I see a friendly welcome message
**And** I see a username input field

**Given** I am on Step 1 of onboarding
**When** I enter a username
**Then** I see real-time availability checking
**And** available usernames show success indicator
**And** taken usernames show "Username taken" error

**Given** I enter a valid, available username
**When** I click "Continue"
**Then** my username is saved to my profile
**And** I advance to Step 2
**And** progress indicator updates

**Given** I enter an invalid username format
**When** I view the validation feedback
**Then** I see the format requirements (3-20 chars, alphanumeric, underscores)
**And** I cannot proceed until valid

**Given** the onboarding wizard
**When** I view Step 1
**Then** I see a progress indicator showing 1 of 3
**And** the UI is clean and focused on the single task

---

### Story 3.2: Onboarding Wizard - Step 2 (Feature Tour)

As a **new user completing onboarding**,
I want **to see a brief overview of the app's key features**,
So that **I understand what I can do with the application**.

**Acceptance Criteria:**

**Given** I completed Step 1 (username)
**When** I advance to Step 2
**Then** I see a feature tour with 3-4 key features highlighted
**And** each feature has an icon, title, and brief description
**And** visuals are clean and professional

**Given** I am on Step 2
**When** I view the feature cards
**Then** features are presented in logical order
**And** descriptions are concise (1-2 sentences each)
**And** icons are meaningful and consistent

**Given** I am on Step 2
**When** I click "Continue"
**Then** I advance to Step 3
**And** progress indicator shows 2 of 3 complete

**Given** the feature tour
**When** I view it on mobile
**Then** features stack vertically
**And** layout is optimized for smaller screens
**And** all content is readable without horizontal scrolling

---

### Story 3.3: Onboarding Wizard - Step 3 (Preferences)

As a **new user completing onboarding**,
I want **to set my basic preferences**,
So that **the app is configured to my liking from the start**.

**Acceptance Criteria:**

**Given** I completed Step 2 (feature tour)
**When** I advance to Step 3
**Then** I see preference options for notifications and language
**And** sensible defaults are pre-selected

**Given** I am on Step 3
**When** I view notification preferences
**Then** I see options for email notifications (on/off)
**And** I can toggle preferences easily
**And** my choices are clearly indicated

**Given** I am on Step 3
**When** I view language preference
**Then** I see a dropdown with available languages (English, Hindi, Bengali)
**And** current browser/system language is pre-selected
**And** I can change my preference

**Given** I have set my preferences
**When** I click "Complete Setup"
**Then** my preferences are saved
**And** I see a success message "You're all set!"
**And** I am redirected to the dashboard

**Given** I complete onboarding
**When** I land on the dashboard
**Then** my selected language is active
**And** notification preferences are saved to my profile

---

### Story 3.4: Onboarding Progress & Skip

As a **new user going through onboarding**,
I want **to see my progress and skip if I choose**,
So that **I feel in control of my experience**.

**Acceptance Criteria:**

**Given** I am in the onboarding wizard
**When** I view any step
**Then** I see a progress indicator (e.g., "Step 1 of 3")
**And** completed steps are visually marked
**And** current step is highlighted

**Given** I am on any onboarding step
**When** I look for a skip option
**Then** I see "Skip for now" link
**And** it is visible but not prominent (encouraging completion)

**Given** I click "Skip for now"
**When** I confirm I want to skip
**Then** I am taken to the dashboard
**And** onboarding is marked as incomplete
**And** I see a prompt to complete setup later

**Given** I skipped onboarding
**When** I return to the app later
**Then** I see a subtle reminder to complete setup
**And** I can access onboarding from my profile/settings
**And** my previous progress is preserved

**Given** I completed some steps then skipped
**When** I return to complete onboarding
**Then** I resume from where I left off
**And** completed steps are not repeated
**And** I can complete the remaining steps

---

### Story 3.5: Dashboard Welcome State

As a **new user landing on the dashboard for the first time**,
I want **to see a welcoming experience with guidance**,
So that **I know what to do next and feel oriented**.

**Acceptance Criteria:**

**Given** I am a new user with no activity
**When** I land on the dashboard
**Then** I see a personalized welcome message with my name/username
**And** I see a "Getting Started" section with suggested actions
**And** the page feels welcoming, not empty

**Given** the dashboard welcome state
**When** I view suggested actions
**Then** I see 2-3 clear next steps
**And** each action has a title, description, and CTA button
**And** actions are relevant to getting started

**Given** I complete a suggested action
**When** I return to the dashboard
**Then** the completed action is marked or removed
**And** new suggestions may appear based on progress

**Given** I have used the app for a while
**When** I have meaningful activity/data
**Then** welcome state transitions to regular dashboard
**And** data and activity are prominently displayed
**And** getting started section is minimized or hidden

**Given** the welcome state
**When** I view it on mobile
**Then** layout is optimized for mobile
**And** CTAs are touch-friendly
**And** content is scannable

---

### Story 3.6: Empty States Design System

As a **user viewing a section with no data**,
I want **to see helpful empty states instead of blank pages**,
So that **I understand what to do and don't feel confused**.

**Acceptance Criteria:**

**Given** any list or data view with no items
**When** the view loads
**Then** I see an empty state component
**And** it includes an illustration or icon
**And** it includes a heading explaining the empty state
**And** it includes a CTA to take action

**Given** empty state components
**When** I review the component library
**Then** there is a reusable EmptyState component
**And** it accepts props for: icon, title, description, action
**And** it follows the design system styling

**Given** an empty state with a CTA
**When** I click the action button
**Then** I am taken to the relevant creation flow
**And** the action is contextually appropriate

**Given** different empty states across the app
**When** I compare them
**Then** they have consistent styling
**And** illustrations/icons follow a cohesive style
**And** messaging tone is consistent (helpful, encouraging)

**Given** empty states
**When** I view them on mobile
**Then** they are properly sized and centered
**And** CTAs are full-width and touch-friendly
**And** text is readable

---

### Story 3.7: Loading States Pattern Library

As a **user waiting for content to load**,
I want **to see appropriate loading indicators**,
So that **I know the app is working and what to expect**.

**Acceptance Criteria:**

**Given** a page or section loading async data
**When** the data is being fetched
**Then** I see skeleton loaders matching content shape
**And** skeletons animate subtly (pulse or shimmer)
**And** layout shift is minimal when content loads

**Given** the component library
**When** I review loading components
**Then** there is a Skeleton component for content placeholders
**And** there is a Spinner component for action feedback
**And** there are variants for different sizes

**Given** skeleton loaders
**When** I view them across the app
**Then** they match the shape of the content they replace
**And** cards have card-shaped skeletons
**And** text has line-shaped skeletons
**And** avatars have circle-shaped skeletons

**Given** an action button triggering async operation
**When** I click the button
**Then** I see a spinner in/on the button
**And** the button is disabled during loading
**And** spinner size is appropriate for the button

**Given** a full-page loading state
**When** initial page data is loading
**Then** I see a centered spinner or skeleton layout
**And** there is no flash of empty content
**And** transition to loaded state is smooth

**Given** loading states on slow connections
**When** loading takes more than 3 seconds
**Then** loading indicator remains visible
**And** user is not left wondering if app is frozen
**And** timeout handling shows appropriate message if needed

---

## Epic 4: Email Communication System

**Goal:** Users receive professional transactional emails

### Story 4.1: Email Infrastructure Setup (Resend)

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

### Story 4.2: Welcome Email Template

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

### Story 4.3: Email Verification Template

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

### Story 4.4: Password Reset Email Template

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

### Story 4.5: Email Error Handling & Logging

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

## Epic 5: User Feedback Collection

**Goal:** Users can easily share feedback; admins can review and manage submissions

### Story 5.1: Feedback Database Schema

As a **developer implementing feedback collection**,
I want **a database schema for storing feedback**,
So that **user feedback is persisted and queryable**.

**Acceptance Criteria:**

**Given** the database schema
**When** I review the feedback table definition
**Then** table exists in the project schema (e.g., `vt_saas.feedback`)
**And** table has id (uuid, primary key)
**And** table has message (text, required)
**And** table has type (enum: bug, feature, praise)
**And** table has user_id (uuid, nullable - for anonymous)
**And** table has user_email (text, nullable - for anonymous)
**And** table has status (enum: pending, reviewed, archived)
**And** table has created_at (timestamp)
**And** table has reviewed_at (timestamp, nullable)

**Given** the Drizzle schema
**When** I review `src/models/Schema.ts`
**Then** feedback table is defined with proper types
**And** enums are defined for type and status
**And** relations to users table (optional) are defined

**Given** the migration
**When** I run `npm run db:generate`
**Then** migration is created for feedback table
**And** migration applies successfully
**And** table is created in database

**Given** the feedback schema
**When** I query the table
**Then** indexes exist on user_id, status, created_at
**And** queries are performant

---

### Story 5.2: Feedback Widget Component

As a **user who wants to share feedback**,
I want **an easily accessible feedback widget**,
So that **I can quickly share my thoughts from any page**.

**Acceptance Criteria:**

**Given** any page in the application
**When** I look for feedback option
**Then** I see a floating feedback button (bottom-right corner)
**And** button has a recognizable icon (speech bubble or similar)
**And** button doesn't obstruct important content

**Given** I click the feedback button
**When** the modal opens
**Then** I see a feedback form
**And** form has a message textarea
**And** form has type selection (Bug, Feature Request, Praise)
**And** form has a submit button
**And** modal can be closed with X or clicking outside

**Given** I am logged in
**When** I open the feedback form
**Then** my email is pre-filled (or associated automatically)
**And** I don't need to enter contact info

**Given** I am not logged in
**When** I open the feedback form
**Then** I see an optional email field
**And** I can submit anonymously or with email

**Given** the feedback form
**When** I select a feedback type
**Then** each type has a clear label and optional description
**And** selection is visually indicated
**And** default type is "Feature Request" or none

**Given** the feedback widget on mobile
**When** I view it on small screens
**Then** button is still visible but appropriately sized
**And** modal is full-screen or properly sized for mobile
**And** form is usable with touch keyboard

---

### Story 5.3: Feedback Submission API

As a **user submitting feedback**,
I want **my feedback saved reliably**,
So that **the team receives my input**.

**Acceptance Criteria:**

**Given** a valid feedback submission
**When** I submit the form
**Then** POST request is sent to `/api/feedback`
**And** feedback is saved to database
**And** I see a success message "Thanks for your feedback!"
**And** modal closes automatically

**Given** the feedback API endpoint
**When** I review the implementation
**Then** endpoint validates message (required, max length)
**And** endpoint validates type (must be valid enum)
**And** endpoint accepts optional user_id or email
**And** endpoint returns 201 on success

**Given** an authenticated user submits feedback
**When** the request is processed
**Then** user_id is automatically attached
**And** feedback is linked to their account

**Given** an anonymous user submits feedback
**When** they provide an email
**Then** email is stored with the feedback
**And** email is validated for format

**Given** validation errors
**When** submission is invalid
**Then** 400 response with field-level errors
**And** errors follow standard API error format
**And** user sees helpful error messages

**Given** the feedback submission
**When** I submit the form
**Then** I see loading state on submit button
**And** double-submission is prevented
**And** form resets after successful submission

---

### Story 5.4: Feedback Admin List View

As an **admin reviewing feedback**,
I want **to see all feedback submissions in one place**,
So that **I can understand user needs and issues**.

**Acceptance Criteria:**

**Given** I am an admin user
**When** I navigate to the admin feedback page
**Then** I see a list of all feedback submissions
**And** list is sorted by newest first (default)
**And** list shows: type, message preview, user/email, date, status

**Given** the feedback list
**When** I view it
**Then** I can filter by type (Bug, Feature, Praise, All)
**And** I can filter by status (Pending, Reviewed, Archived, All)
**And** filters update the list without page reload

**Given** a feedback item in the list
**When** I view the preview
**Then** I see the first ~100 characters of the message
**And** I see the feedback type with color coding
**And** I see relative timestamp ("2 hours ago")
**And** I see user email or "Anonymous"

**Given** I click on a feedback item
**When** the detail view opens
**Then** I see the full message
**And** I see all metadata (type, user, date, status)
**And** I can take actions (mark reviewed, delete)

**Given** the admin feedback page
**When** I access it as non-admin
**Then** I am redirected to dashboard
**And** I see "Access denied" or similar message

**Given** the feedback list is empty
**When** no feedback exists
**Then** I see an empty state
**And** message indicates no feedback yet

---

### Story 5.5: Feedback Admin Actions

As an **admin managing feedback**,
I want **to take actions on feedback items**,
So that **I can track what's been reviewed and export data**.

**Acceptance Criteria:**

**Given** a pending feedback item
**When** I click "Mark as Reviewed"
**Then** status changes to "reviewed"
**And** reviewed_at timestamp is set
**And** UI updates to reflect new status
**And** I see confirmation toast

**Given** a feedback item
**When** I click "Delete"
**Then** I see a confirmation dialog
**And** dialog warns about permanent deletion
**And** on confirm, item is deleted from database
**And** list updates to remove the item

**Given** I click "Archive"
**When** I archive a feedback item
**Then** status changes to "archived"
**And** item remains in database but hidden by default
**And** I can filter to see archived items

**Given** the feedback admin page
**When** I click "Export CSV"
**Then** a CSV file is downloaded
**And** file contains: id, type, message, email, status, created_at, reviewed_at
**And** filename includes date (e.g., feedback-2024-01-15.csv)

**Given** filters are active
**When** I export CSV
**Then** only filtered results are exported
**And** export reflects current filter state

**Given** bulk actions
**When** I select multiple feedback items
**Then** I can mark all as reviewed
**And** I can delete all selected
**And** confirmation is required for bulk actions

---

## Epic 6: Admin Panel & System Management

**Goal:** Admins can manage users and monitor system health

### Story 6.1: Admin Role & Access Control

As a **product owner**,
I want **admin access controlled by a simple flag**,
So that **only authorized users can access admin features**.

**Acceptance Criteria:**

**Given** user roles
**When** I check if a user is admin
**Then** admin status is determined by user_metadata.isAdmin flag
**Or** admin status is determined by ADMIN_EMAILS env var list

**Given** the admin check implementation
**When** I review the code
**Then** there is a utility function `isAdmin(user)` or similar
**And** function checks both DB flag and env var fallback
**And** function is used consistently across admin features

**Given** a non-admin user
**When** they try to access `/admin/*` routes
**Then** middleware blocks the request
**And** user is redirected to dashboard
**And** they see "Access denied" message

**Given** an admin user
**When** they access `/admin/*` routes
**Then** access is granted
**And** admin content is displayed
**And** admin-specific navigation is visible

**Given** the environment variable approach
**When** ADMIN_EMAILS is set (e.g., "admin@example.com,owner@example.com")
**Then** users with those emails are treated as admins
**And** this works without database changes
**And** useful for initial setup before DB-based roles

**Given** the middleware protection
**When** admin routes are accessed
**Then** check happens at edge (middleware.ts)
**And** unauthorized requests never reach route handlers
**And** performance impact is minimal

---

### Story 6.2: Admin Layout & Navigation

As an **admin user**,
I want **a dedicated admin interface**,
So that **I can easily navigate admin features**.

**Acceptance Criteria:**

**Given** I am an admin accessing admin section
**When** I view any admin page
**Then** I see an admin-specific layout
**And** layout is distinct from regular user layout
**And** admin navigation is visible

**Given** the admin navigation
**When** I view the sidebar/menu
**Then** I see links to: Dashboard, Users, Feedback, Settings
**And** current page is highlighted
**And** navigation is collapsible on mobile

**Given** the admin header
**When** I view admin pages
**Then** I see "Admin" indicator clearly
**And** I can navigate back to main app
**And** my user avatar/menu is accessible

**Given** admin pages
**When** I navigate between them
**Then** transitions are smooth
**And** active state updates correctly
**And** breadcrumbs show current location (optional)

**Given** the admin layout on mobile
**When** I view on small screens
**Then** navigation collapses to hamburger menu
**And** content is properly responsive
**And** all features remain accessible

**Given** the admin route structure
**When** I review the code
**Then** admin routes are under `src/app/[locale]/(admin)/`
**And** layout is defined at route group level
**And** layout is self-contained (modular)

---

### Story 6.3: User Management List

As an **admin**,
I want **to see all users in the system**,
So that **I can find and manage user accounts**.

**Acceptance Criteria:**

**Given** I am on the admin users page
**When** the page loads
**Then** I see a list of all users
**And** list shows: email, username, signup date, status
**And** list is paginated (20 per page default)

**Given** the user list
**When** I look for search
**Then** I see a search input
**And** I can search by email or username
**And** search filters results in real-time or on submit

**Given** the user list
**When** I want to sort
**Then** I can sort by signup date (newest/oldest)
**And** I can sort by email alphabetically
**And** current sort is indicated visually

**Given** a user row in the list
**When** I view the row
**Then** I see their email
**And** I see their username (or "Not set")
**And** I see signup date (relative or formatted)
**And** I see status indicator (active, suspended)
**And** I see quick action buttons

**Given** pagination
**When** there are more than 20 users
**Then** I see pagination controls
**And** I can navigate between pages
**And** current page is indicated
**And** total user count is shown

**Given** the user list is empty
**When** no users exist (unlikely)
**Then** I see an appropriate empty state

---

### Story 6.4: User Detail & Actions

As an **admin**,
I want **to view user details and take actions**,
So that **I can manage individual accounts**.

**Acceptance Criteria:**

**Given** I click on a user in the list
**When** the detail view opens
**Then** I see full user information
**And** I see: email, username, display name, signup date
**And** I see: last login, email verified status
**And** I see: account status (active/suspended)

**Given** user detail view
**When** I look for actions
**Then** I see action buttons: Suspend, Delete, Reset Password
**And** actions are clearly labeled
**And** dangerous actions are visually distinct (red)

**Given** I click "Suspend User"
**When** user is currently active
**Then** I see confirmation dialog
**And** on confirm, user status changes to suspended
**And** suspended users cannot log in
**And** I see success confirmation

**Given** I click "Unsuspend User"
**When** user is currently suspended
**Then** I see confirmation dialog
**And** on confirm, user status changes to active
**And** user can log in again
**And** I see success confirmation

**Given** I click "Delete User"
**When** I confirm the action
**Then** I see a strong warning about permanence
**And** I must type user email to confirm
**And** on confirm, user and their data are deleted
**And** I am redirected to user list

**Given** I click "Reset Password"
**When** I confirm the action
**Then** password reset email is sent to user
**And** I see confirmation that email was sent
**And** user can use reset link to set new password

**Given** I am viewing my own admin account
**When** I look at actions
**Then** I cannot suspend or delete my own account
**And** self-destructive actions are disabled

---

### Story 6.5: System Metrics Dashboard

As an **admin**,
I want **to see key system metrics at a glance**,
So that **I can monitor the health of the application**.

**Acceptance Criteria:**

**Given** I am on the admin dashboard
**When** the page loads
**Then** I see key metrics displayed as cards
**And** metrics include: Total Users, New Signups (7d), Active Users (7d)
**And** metrics include: Pending Feedback, Error Count (if available)

**Given** each metric card
**When** I view it
**Then** I see the metric name
**And** I see the current value (large, prominent)
**And** I see trend indicator if applicable (+5% this week)
**And** design is clean and scannable

**Given** the Total Users metric
**When** I view it
**Then** I see count of all registered users
**And** count is accurate and real-time

**Given** the New Signups metric
**When** I view it
**Then** I see count of users registered in last 7 days
**And** I can optionally see daily breakdown

**Given** the Active Users metric
**When** I view it
**Then** I see count of users who logged in last 7 days
**And** metric is based on session/login data

**Given** the Pending Feedback metric
**When** I view it
**Then** I see count of unreviewed feedback
**And** clicking navigates to feedback page

**Given** the admin dashboard
**When** data is loading
**Then** I see skeleton loaders for each metric
**And** dashboard remains usable during loading

**Given** the dashboard layout
**When** I view on different screen sizes
**Then** metric cards reflow appropriately
**And** 4 columns on desktop, 2 on tablet, 1 on mobile

---

### Story 6.6: Admin Audit Logging

As a **product owner**,
I want **admin actions to be logged**,
So that **I have accountability and can troubleshoot issues**.

**Acceptance Criteria:**

**Given** an admin performs an action
**When** the action is: suspend user, delete user, reset password
**Then** an audit log entry is created
**And** entry includes: admin_id, action, target_user_id, timestamp
**And** entry includes: metadata (reason if provided)

**Given** the audit log schema
**When** I review the database
**Then** admin_audit_log table exists
**And** table has: id, admin_id, action, target_type, target_id, metadata, created_at
**And** appropriate indexes exist

**Given** the admin panel
**When** I look for audit log
**Then** I can access audit log from admin settings
**And** I see a list of recent admin actions
**And** list shows: action, admin, target, timestamp

**Given** the audit log list
**When** I view entries
**Then** I can filter by action type
**And** I can filter by date range
**And** I can filter by admin user

**Given** audit log entries
**When** I review them
**Then** entries are tamper-resistant (no edit/delete in UI)
**And** entries are retained for compliance period
**And** sensitive data is appropriately logged (no passwords)

**Given** the audit logging implementation
**When** I review the code
**Then** logging is done server-side only
**And** logging function is reusable: `logAdminAction(action, target, metadata)`
**And** logging failures don't break admin actions (graceful)

---

## Epic 7: SEO & Social Sharing Foundations

**Goal:** Product is discoverable; content is shareable with rich previews

### Story 7.1: Internationalization SEO (hreflang)

As a **search engine crawler**,
I want **to understand language variants of pages**,
So that **users are shown the right language version in search results**.

**Acceptance Criteria:**

**Given** any public page on the site
**When** I view the page source
**Then** I see hreflang link tags for all supported languages
**And** tags include: en, hi, bn (all supported locales)
**And** tags include x-default pointing to English version

**Given** the hreflang implementation
**When** I review the code
**Then** alternates are configured in layout.tsx or page metadata
**And** Next.js Metadata API is used correctly
**And** URLs are absolute (including domain)

**Given** the landing page at /en
**When** I inspect hreflang tags
**Then** I see `<link rel="alternate" hreflang="en" href="https://example.com/en" />`
**And** I see `<link rel="alternate" hreflang="hi" href="https://example.com/hi" />`
**And** I see `<link rel="alternate" hreflang="bn" href="https://example.com/bn" />`
**And** I see `<link rel="alternate" hreflang="x-default" href="https://example.com/en" />`

**Given** any localized page (e.g., /hi/about)
**When** I check hreflang tags
**Then** alternates point to correct localized versions
**And** self-referential hreflang is included
**And** URLs match actual page paths

**Given** authenticated pages (dashboard, settings)
**When** I check for hreflang
**Then** hreflang tags are NOT present (or pages are noindex)
**And** only public pages have language alternates

---

### Story 7.2: Open Graph & Twitter Card Metadata

As a **user sharing the app on social media**,
I want **rich previews with images and descriptions**,
So that **my shares look professional and informative**.

**Acceptance Criteria:**

**Given** the landing page
**When** I share on Facebook/LinkedIn
**Then** Open Graph preview shows: title, description, image
**And** title is the app name or page title
**And** description is compelling and accurate
**And** image is the default OG image (1200x630)

**Given** the landing page
**When** I share on Twitter
**Then** Twitter Card preview shows: title, description, image
**And** card type is "summary_large_image"
**And** image displays correctly in timeline

**Given** page metadata
**When** I review the root layout
**Then** default openGraph config is set
**And** default twitter config is set
**And** site name, type, and images are configured

**Given** individual pages
**When** they have specific metadata
**Then** page-specific OG overrides default
**And** titles include page name + site name
**And** descriptions are page-appropriate

**Given** the OG image configuration
**When** I check image URLs
**Then** default OG image exists at /og-image.png or similar
**And** image is 1200x630 pixels
**And** image includes app branding
**And** URL is absolute

**Given** metadata validation
**When** I test with Facebook Sharing Debugger
**Then** no errors or warnings appear
**And** preview renders correctly
**When** I test with Twitter Card Validator
**Then** card renders correctly

---

### Story 7.3: Robots.txt & Sitemap Configuration

As a **search engine crawler**,
I want **clear indexing instructions**,
So that **I index public pages and avoid private ones**.

**Acceptance Criteria:**

**Given** robots.txt at /robots.txt
**When** I view the file
**Then** it allows crawling of public pages
**And** it disallows /dashboard, /admin, /api paths
**And** it references the sitemap location
**And** format follows standard robots.txt spec

**Given** the robots.txt content
**When** I review the rules
**Then** I see `User-agent: *`
**And** I see `Allow: /`
**And** I see `Disallow: /dashboard`
**And** I see `Disallow: /admin`
**And** I see `Disallow: /api`
**And** I see `Sitemap: https://example.com/sitemap.xml`

**Given** the sitemap at /sitemap.xml
**When** I view the sitemap
**Then** it lists all public pages
**And** it includes localized versions of pages
**And** each URL has lastmod, changefreq (optional)
**And** format is valid XML sitemap

**Given** the sitemap implementation
**When** I review the code
**Then** sitemap is generated via `src/app/sitemap.ts`
**And** sitemap is dynamically generated (not static file)
**And** new public pages are automatically included

**Given** authenticated routes
**When** I check the sitemap
**Then** /dashboard, /admin, /settings are NOT listed
**And** only publicly accessible pages are included

**Given** localized pages in sitemap
**When** I review entries
**Then** each page appears with all locale variants
**And** alternates are properly linked
**And** URLs are absolute with domain

---

### Story 7.4: Dynamic Open Graph Images

As a **user sharing specific content**,
I want **dynamically generated preview images**,
So that **shared links have contextual, branded previews**.

**Acceptance Criteria:**

**Given** the OG image generation endpoint
**When** I access /api/og or /og/[...path]
**Then** an image is generated on the edge
**And** image is returned as PNG
**And** generation is fast (< 500ms)

**Given** the default OG image
**When** generated without parameters
**Then** image shows app name/logo
**And** image uses brand colors
**And** image is 1200x630 pixels
**And** text is readable and well-positioned

**Given** page-specific OG images
**When** a page passes title parameter
**Then** image includes the page title
**And** layout adapts to title length
**And** branding elements remain consistent

**Given** the OG image template
**When** I review the implementation
**Then** @vercel/og (or similar) is used
**And** template is in `src/app/api/og/route.tsx` or similar
**And** template uses JSX for layout
**And** fonts are properly loaded

**Given** customization needs
**When** I want to modify OG image design
**Then** template is clearly structured
**And** colors reference brand variables
**And** logo/assets are easily swappable
**And** documentation explains customization

**Given** OG image caching
**When** same parameters are requested
**Then** images are cached at edge
**And** cache headers are properly set
**And** regeneration happens on deploy or param change

**Given** error handling
**When** OG generation fails
**Then** fallback to static default image
**And** error is logged
**And** user doesn't see broken image

---

## Epic 8: Go-To-Market Features

**Goal:** Pre-launch and growth infrastructure ready for product launches

### Story 8.1: Share/Referral Widget Component

As a **user who wants to share the product**,
I want **an easy way to share on social platforms**,
So that **I can spread the word with minimal effort**.

**Acceptance Criteria:**

**Given** the ShareWidget component
**When** I use it in any page
**Then** it displays share buttons for major platforms
**And** platforms include: Twitter/X, LinkedIn, Facebook, Copy Link
**And** buttons have recognizable platform icons

**Given** I click a social share button
**When** the share action triggers
**Then** platform's share dialog opens
**And** pre-filled text includes page title/description
**And** URL being shared is the current page (or specified URL)

**Given** I click "Copy Link"
**When** the action completes
**Then** URL is copied to clipboard
**And** I see confirmation feedback ("Copied!")
**And** feedback auto-dismisses after 2 seconds

**Given** the ShareWidget component props
**When** I review the API
**Then** component accepts: url, title, description (optional)
**And** component accepts: platforms (array to customize which buttons)
**And** component accepts: variant (inline, popup, minimal)

**Given** referral tracking needs
**When** share links are generated
**Then** optional referral code can be appended to URL
**And** format is ?ref=USER_CODE or similar
**And** referral tracking is opt-in per implementation

**Given** the ShareWidget on mobile
**When** I view on small screens
**Then** native share API is used if available
**And** fallback to platform buttons if not
**And** buttons are touch-friendly

---

### Story 8.2: Private Shareable URLs

As a **user who wants to share private content**,
I want **to generate secure, shareable links**,
So that **I can share content with specific people**.

**Acceptance Criteria:**

**Given** shareable content (e.g., a report, document)
**When** I click "Create Share Link"
**Then** a unique URL is generated
**And** URL contains a random, unguessable token
**And** URL is displayed with copy button

**Given** the shareable URL schema
**When** I review the database
**Then** table exists: shareable_links
**And** fields include: id, token, resource_type, resource_id, created_by
**And** fields include: expires_at, access_count, max_access, is_active

**Given** I create a share link
**When** I configure options
**Then** I can set expiration (never, 1 day, 7 days, 30 days)
**And** I can set max access count (optional)
**And** I can revoke the link later

**Given** someone accesses a share link
**When** the link is valid
**Then** they see the shared content
**And** access_count is incremented
**And** no authentication required (unless configured)

**Given** an expired or revoked link
**When** someone tries to access it
**Then** they see "This link has expired" message
**And** content is not displayed
**And** they may see option to request new link

**Given** share link management
**When** I view my shared links
**Then** I see list of links I've created
**And** I see access count, expiration status
**And** I can revoke any active link

---

### Story 8.3: Pre-Launch Landing Page & Waitlist

As a **product owner preparing to launch**,
I want **a landing page to capture interest**,
So that **I can build an audience before launch**.

**Acceptance Criteria:**

**Given** the pre-launch landing page
**When** I visit the root URL (before launch mode)
**Then** I see a compelling landing page
**And** page has headline, value proposition, visuals
**And** page has email capture form prominently displayed

**Given** the waitlist signup form
**When** I enter my email and submit
**Then** my email is saved to waitlist table
**And** I see confirmation "You're on the list!"
**And** optional: confirmation email is sent

**Given** the waitlist form
**When** I submit an invalid email
**Then** I see validation error
**And** form does not submit
**When** I submit an already-registered email
**Then** I see friendly message "You're already on the list!"

**Given** the waitlist database schema
**When** I review the table
**Then** waitlist table exists with: id, email, created_at
**And** optional fields: name, interests, referral_source
**And** email has unique constraint

**Given** admin access to waitlist
**When** I view admin waitlist page
**Then** I see list of all signups
**And** I see total count
**And** I can export to CSV
**And** I can see signup trends over time

**Given** launch mode toggle
**When** LAUNCH_MODE env var is set to "live"
**Then** landing page redirects to main app
**And** waitlist functionality is bypassed
**And** existing users can sign in normally

---

### Story 8.4: Social Proof Widgets

As a **visitor evaluating the product**,
I want **to see evidence of traction and trust**,
So that **I feel confident signing up**.

**Acceptance Criteria:**

**Given** the StatsCounter component
**When** I use it on landing page
**Then** it displays metrics like "500+ users", "10k+ messages"
**And** numbers can be static or fetched dynamically
**And** display includes labels and optional icons

**Given** the Testimonials component
**When** I use it on landing page
**Then** it displays customer quotes
**And** each testimonial shows: quote, name, title/company, avatar
**And** component supports carousel or grid layout

**Given** testimonial data
**When** I configure testimonials
**Then** data comes from config file or CMS
**And** format is: { quote, author, role, company, avatar }
**And** easy to add/edit testimonials

**Given** the TrustBadges component
**When** I use it on landing page
**Then** it displays trust indicators
**And** examples: "SOC 2 Compliant", "GDPR Ready", "99.9% Uptime"
**And** badges are visually consistent

**Given** social proof components
**When** I review the component library
**Then** components are in `src/components/marketing/`
**And** components are well-documented
**And** components follow design system

**Given** social proof on mobile
**When** I view on small screens
**Then** layouts adapt appropriately
**And** testimonial carousel is swipeable
**And** content remains readable

---

### Story 8.5: Changelog-to-Content Automation

As a **product owner releasing updates**,
I want **releases to automatically generate content**,
So that **I can communicate updates without manual effort**.

**Acceptance Criteria:**

**Given** a GitHub release is published
**When** the release event triggers
**Then** GitHub Action workflow runs
**And** workflow extracts release notes
**And** workflow prepares content for publishing

**Given** the changelog workflow
**When** I review .github/workflows/changelog.yml
**Then** workflow triggers on: release published
**And** workflow extracts: version, date, notes
**And** workflow formats content appropriately

**Given** release content generation
**When** workflow processes a release
**Then** content is formatted as markdown
**And** content includes: version number, date, changes
**And** content is suitable for blog/changelog page

**Given** content output options
**When** workflow completes
**Then** content is saved to docs/changelog/ or similar
**And** optionally: webhook is called (for n8n/Zapier)
**And** optionally: PR is created with new content

**Given** the changelog page
**When** I visit /changelog
**Then** I see list of releases
**And** releases are sorted newest first
**And** each entry shows version, date, changes
**And** page is auto-updated when new releases happen

**Given** minimal initial implementation
**When** I review the scope
**Then** basic workflow is functional
**And** LLM transformation is optional/future
**And** n8n integration is documented but not required

---

### Story 8.6: Programmatic SEO Infrastructure

As a **growth-focused product owner**,
I want **to generate SEO pages from data**,
So that **I can capture long-tail search traffic**.

**Acceptance Criteria:**

**Given** programmatic SEO needs
**When** I want to create data-driven pages
**Then** there is a pattern for dynamic route generation
**And** pattern uses Next.js dynamic routes
**And** pattern is documented with examples

**Given** a pSEO page template
**When** I create pages from data
**Then** route structure is /[category]/[slug] or similar
**And** pages are statically generated at build time
**And** pages have proper metadata (title, description, OG)

**Given** the pSEO data source
**When** I configure pages
**Then** data comes from JSON files in /data directory
**And** or data comes from API/database
**And** generateStaticParams is used for static generation

**Given** an example pSEO implementation
**When** I review the code
**Then** example exists in src/app/[locale]/(pseo)/
**And** example demonstrates: data loading, template, metadata
**And** example is well-commented for learning

**Given** pSEO pages in sitemap
**When** sitemap is generated
**Then** all pSEO pages are included
**And** pages have proper URLs and metadata
**And** sitemap scales to hundreds/thousands of pages

**Given** pSEO page content
**When** I view a generated page
**Then** content is unique and valuable (not thin)
**And** page passes basic SEO checks
**And** internal linking connects related pages

**Given** customization needs
**When** I want to create my own pSEO pages
**Then** documentation explains the pattern
**And** example template is easy to copy/modify
**And** data format is clearly specified

---

## Epic 9: Analytics & Founder Dashboard

**Goal:** Product owner can track user behavior and key conversion metrics

### Story 9.1: Analytics Infrastructure Setup (PostHog)

As a **template user (developer)**,
I want **analytics infrastructure configured with PostHog**,
So that **I can track user behavior and make data-driven decisions**.

**Acceptance Criteria:**

**Given** the analytics setup
**When** I configure PostHog
**Then** NEXT_PUBLIC_POSTHOG_KEY environment variable is documented
**And** NEXT_PUBLIC_POSTHOG_HOST is configurable
**And** .env.example includes required variables

**Given** the analytics library setup
**When** I review the code structure
**Then** there is an analytics module at `src/libs/analytics/`
**And** the module abstracts the provider (swappable later)
**And** TypeScript types are defined for events

**Given** PostHog initialization
**When** the app loads
**Then** PostHog client is initialized
**And** initialization happens client-side only
**And** user is identified when authenticated

**Given** privacy considerations
**When** analytics is configured
**Then** IP anonymization is enabled by default
**And** session recording is opt-in (not default)
**And** cookie consent integration is documented

**Given** development mode
**When** NEXT_PUBLIC_POSTHOG_KEY is not set
**Then** analytics events are logged to console
**And** no errors are thrown
**And** developer can see what would be tracked

**Given** the analytics provider abstraction
**When** I want to swap to Amplitude or custom
**Then** interface is clearly defined
**And** implementation can be swapped without app changes
**And** documentation explains how to swap providers

---

### Story 9.2: Event Tracking Utility

As a **developer implementing features**,
I want **a simple, type-safe way to track events**,
So that **I can instrument features without friction**.

**Acceptance Criteria:**

**Given** the trackEvent utility
**When** I call it in my code
**Then** signature is `trackEvent(eventName, properties?)`
**And** eventName is typed (string literal union or enum)
**And** properties are typed per event

**Given** tracking an event
**When** I call `trackEvent('signup_completed', { method: 'email' })`
**Then** event is sent to analytics provider
**And** user context is automatically attached
**And** timestamp is automatically added

**Given** the event types
**When** I review the type definitions
**Then** all standard events are defined
**And** properties for each event are typed
**And** TypeScript catches incorrect usage

**Given** event categories
**When** I review the event schema
**Then** events are organized by category (auth, onboarding, feature)
**And** naming convention is consistent (snake_case)
**And** event names are descriptive and specific

**Given** development mode
**When** analytics provider is not configured
**Then** events are logged to console with full details
**And** console output shows: event name, properties, timestamp
**And** helps debugging without sending real events

**Given** server-side tracking needs
**When** I need to track from API routes
**Then** server-side tracking utility exists
**And** uses PostHog server-side API
**And** includes user identification if available

---

### Story 9.3: Core User Flow Instrumentation

As a **product owner**,
I want **key user actions automatically tracked**,
So that **I understand how users interact with the product**.

**Acceptance Criteria:**

**Given** user signup
**When** registration is completed
**Then** `signup_completed` event is tracked
**And** properties include: method (email/google/github)
**And** user is identified in analytics

**Given** user login
**When** login is successful
**Then** `login_completed` event is tracked
**And** properties include: method (email/google/github)
**And** session context is updated

**Given** onboarding flow
**When** user progresses through steps
**Then** `onboarding_step_completed` is tracked for each step
**And** properties include: step_number, step_name
**And** `onboarding_completed` is tracked on finish
**And** `onboarding_skipped` is tracked if skipped

**Given** core feature usage
**When** user uses key features
**Then** relevant events are tracked
**And** examples: feedback_submitted, profile_updated
**And** events include contextual properties

**Given** page views
**When** user navigates between pages
**Then** page views are tracked automatically
**And** PostHog autocapture handles this
**And** custom page view events optional

**Given** error occurrences
**When** significant errors happen
**Then** error events are tracked
**And** properties include: error_type, error_message (sanitized)
**And** sensitive data is NOT included

---

### Story 9.4: Conversion Funnel Tracking

As a **product owner**,
I want **to track conversion funnels**,
So that **I can identify and fix drop-off points**.

**Acceptance Criteria:**

**Given** the signup-to-activation funnel
**When** I review tracked events
**Then** funnel stages are trackable
**And** stages: landing_viewed → signup_started → signup_completed → onboarding_started → onboarding_completed → first_action

**Given** each funnel stage
**When** user reaches that stage
**Then** corresponding event is tracked
**And** events are ordered correctly
**And** timestamps enable time-based analysis

**Given** funnel configuration in PostHog
**When** I set up funnel analysis
**Then** events align with PostHog funnel requirements
**And** conversion rates are calculable
**And** drop-off points are visible

**Given** activation metrics
**When** user completes key action
**Then** `user_activated` event is tracked
**And** activation is defined (e.g., completed onboarding + first feature use)
**And** activation time from signup is calculable

**Given** referral tracking
**When** user arrives via referral link
**Then** referral source is captured
**And** `referred_signup` event includes referrer info
**And** referral conversions are trackable

**Given** feature adoption tracking
**When** user uses a feature for first time
**Then** `feature_first_use` event is tracked
**And** properties include: feature_name
**And** feature adoption rates are calculable

---

### Story 9.5: Founder Analytics Dashboard

As a **product owner (founder)**,
I want **an internal dashboard with key metrics**,
So that **I can monitor the business without external tools**.

**Acceptance Criteria:**

**Given** the founder dashboard
**When** I access /admin/analytics (or /founder)
**Then** I see key metrics displayed
**And** metrics are pulled from PostgreSQL (not PostHog)
**And** dashboard is admin-only protected

**Given** the key metrics displayed
**When** I view the dashboard
**Then** I see: Total Users, Signups (7d, 30d), Active Users (7d)
**And** I see: Activation Rate, Onboarding Completion Rate
**And** I see: Feedback Count, optional: Error Count

**Given** each metric
**When** displayed on dashboard
**Then** current value is shown prominently
**And** trend indicator shows change vs previous period
**And** sparkline or mini-chart shows recent trend (optional)

**Given** signups over time
**When** I view the signups section
**Then** I see a chart showing daily signups (last 30 days)
**And** chart is simple and clear (line or bar)
**And** total for period is shown

**Given** the data source
**When** metrics are calculated
**Then** queries run against PostgreSQL directly
**And** queries are efficient (indexed columns)
**And** data is real-time or near-real-time

**Given** the dashboard on mobile
**When** I view on small screens
**Then** layout adapts appropriately
**And** metrics stack vertically
**And** charts resize or simplify

**Given** dashboard performance
**When** page loads
**Then** initial load is fast (skeleton states)
**And** heavy queries don't block render
**And** caching is used where appropriate

---

## Epic 10: AI Chat Integration (Example Module)

**Goal:** Template users see production-quality streaming patterns they can learn from or remove

### Story 10.1: Clean Up Existing Chat Code

As a **template user (developer)**,
I want **the chat feature to be clean, generic, and well-organized**,
So that **I can learn from it or easily remove it**.

**Acceptance Criteria:**

**Given** the existing chat implementation
**When** I review the code
**Then** all HealthCompanion-specific references are removed
**And** component names are generic (ChatInterface, ChatMessage, etc.)
**And** code follows template coding standards

**Given** the chat components
**When** I review `src/components/chat/`
**Then** components are well-structured
**And** each component has a single responsibility
**And** props are properly typed with TypeScript
**And** no dead code or unused imports

**Given** the chat API route
**When** I review `src/app/api/chat/`
**Then** route is clean and well-commented
**And** error handling is comprehensive
**And** environment variables are documented
**And** no hardcoded values

**Given** the Dify client
**When** I review `src/libs/dify/`
**Then** client is well-structured
**And** types are properly defined
**And** timeout and error handling are robust
**And** SSE parsing is correct

**Given** the chat feature
**When** I test it locally (with Dify configured)
**Then** chat interface loads correctly
**And** messages can be sent
**And** streaming responses display properly
**And** conversation history persists

**Given** the chat feature
**When** Dify is NOT configured
**Then** chat page shows appropriate message
**And** no errors are thrown
**And** user understands setup is required

---

### Story 10.2: Document SSE Streaming Patterns

As a **template user (developer)**,
I want **clear documentation of the SSE streaming implementation**,
So that **I can understand and adapt the pattern for my needs**.

**Acceptance Criteria:**

**Given** the SSE documentation
**When** I read it
**Then** I understand what Server-Sent Events are
**And** I understand why SSE was chosen (vs WebSocket)
**And** I understand the benefits for AI streaming

**Given** the streaming implementation docs
**When** I review the technical details
**Then** server-side streaming is explained
**And** client-side consumption is explained
**And** code snippets are provided for both

**Given** the API route streaming pattern
**When** I review the documentation
**Then** I see how to create a streaming response
**And** I see how to handle chunked data
**And** I see proper headers for SSE
**And** I see error handling patterns

**Given** the client-side streaming pattern
**When** I review the documentation
**Then** I see how to consume SSE in React
**And** I see state management for streaming messages
**And** I see how to handle connection errors
**And** I see how to implement cancel/abort

**Given** the documentation location
**When** I look for it
**Then** docs are in `docs/patterns/sse-streaming.md` or similar
**And** docs are linked from main README
**And** docs include "Learn More" resources

**Given** code comments in implementation
**When** I read the chat code
**Then** key patterns have inline comments
**And** comments reference the documentation
**And** complex logic is explained

---

### Story 10.3: Document API Proxy Pattern

As a **template user (developer)**,
I want **clear documentation of the API proxy pattern**,
So that **I can securely integrate other external APIs**.

**Acceptance Criteria:**

**Given** the API proxy documentation
**When** I read it
**Then** I understand why proxying is needed (security)
**And** I understand the pattern: client → Next.js API → external service
**And** I understand never exposing API keys to client

**Given** the proxy implementation docs
**When** I review the technical details
**Then** request flow is explained with diagram
**And** authentication passthrough is explained
**And** error handling and mapping is explained
**And** timeout and retry patterns are covered

**Given** the Dify proxy as example
**When** I review the documentation
**Then** I see the complete implementation explained
**And** I see how API key is kept server-side
**And** I see how user session is validated
**And** I see how responses are proxied/transformed

**Given** adapting for other services
**When** I want to proxy a different API
**Then** documentation includes adaptation guide
**And** guide shows: new route, env vars, client wrapper
**And** common patterns (REST, GraphQL) are mentioned

**Given** security considerations
**When** I review the documentation
**Then** I see why NEXT_PUBLIC_ vars are dangerous for secrets
**And** I see proper env var handling
**And** I see input validation recommendations
**And** I see rate limiting considerations

**Given** the documentation location
**When** I look for it
**Then** docs are in `docs/patterns/api-proxy.md` or similar
**And** docs are linked from main README
**And** docs reference the SSE streaming docs where relevant

---

### Story 10.4: Feature Removal Guide

As a **template user (developer)**,
I want **clear instructions for removing the chat feature**,
So that **I can cleanly remove it if I don't need AI chat**.

**Acceptance Criteria:**

**Given** the removal guide
**When** I read it
**Then** I understand which files/folders to delete
**And** I understand which config changes to make
**And** I have a checklist to follow

**Given** files to delete
**When** I follow the guide
**Then** I delete `src/components/chat/`
**And** I delete `src/app/[locale]/(chat)/`
**And** I delete `src/app/api/chat/`
**And** I delete `src/libs/dify/`
**And** I optionally remove thread-related code

**Given** configuration changes
**When** I follow the guide
**Then** I remove chat-related env vars from .env.example
**And** I remove chat navigation links from layout
**And** I remove chat-related routes from middleware (if any)

**Given** database changes (if applicable)
**When** threads table exists
**Then** guide explains how to remove threads schema
**And** guide explains migration to drop table
**And** guide warns about data loss

**Given** dependency cleanup
**When** chat-specific packages exist
**Then** guide lists packages that can be removed
**And** examples: assistant-ui packages (if only for chat)
**And** `npm uninstall` commands provided

**Given** verification steps
**When** I complete the removal
**Then** guide includes verification checklist
**And** `npm run build` should pass
**And** `npm run check-types` should pass
**And** no broken imports or dead code

**Given** the removal guide location
**When** I look for it
**Then** guide is in `docs/customization/removing-chat.md` or similar
**And** guide is linked from main README
**And** guide is mentioned in chat documentation
