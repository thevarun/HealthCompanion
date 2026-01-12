# Project Context Analysis

## Requirements Overview

**Functional Requirements:**

The VT SaaS Template requires **30+ functional capabilities** organized into 10 core modules:

1. **Authentication & User Management (FR-AUTH-001 to 004)**: Email/password auth, OAuth infrastructure, session management with Supabase Auth V2. Architecturally critical - affects middleware, API route protection, and client-side state.

2. **Onboarding System (FR-ONB-001 to 002)**: 3-step wizard post-signup, skippable with progress tracking. Requires navigation state management and user preference persistence.

3. **User Feedback Collection (FR-FEED-001 to 002)**: Simple widget → database storage pattern. Demonstrates CRUD patterns for template users, includes admin review interface.

4. **Admin Panel (FR-ADMIN-001 to 003)**: User management, system monitoring, access control via DB flag or env config. Requires role-based routing and data aggregation capabilities.

5. **Internationalization (FR-I18N-001 to 002)**: Support for English, Hindi, Bengali (extensible). Affects routing strategy (locale prefix), content loading, and fallback mechanisms.

6. **Email System (FR-EMAIL-001 to 002)**: Transactional emails (welcome, verification, password reset) using React Email templates. Service-agnostic design (Resend/SendGrid/SMTP).

7. **CI/CD Pipeline (FR-CICD-001 to 002)**: GitHub Actions with automated testing, type checking, and deployment. Build artifacts must be cacheable, environment-specific configs required.

8. **Error Handling (FR-ERROR-001 to 002)**: React error boundaries at app/route/component levels, consistent API error format, Sentry integration. Affects component hierarchy and API response contracts.

9. **UI/UX Features (FR-UI-001 to 004)**: Responsive design (3 breakpoints), dark mode with system detection, loading states, helpful empty states. Drives component library structure and state management patterns.

10. **AI Chat Integration (FR-CHAT-001 to 002)**: SSE streaming, API proxy pattern - **kept as example code**. Demonstrates advanced patterns (real-time streaming, conversation state) for template users to learn from or remove.

11. **Analytics & Instrumentation (FR-ANALYTICS-001 to 003)**: Event tracking infrastructure (PostHog/Amplitude), user flow monitoring, privacy-respecting collection. **NEW requirement** - affects all user interactions, requires provider-agnostic architecture.

**Architecturally, these FRs require:**
- Robust middleware orchestration (auth + i18n on every request)
- Modular feature design (admin, feedback, chat must be removable)
- Clear API contracts (consistent error handling, validation patterns)
- Component library with accessible, responsive primitives
- Build pipeline supporting multiple environments and deployment targets

**Non-Functional Requirements:**

**Performance Constraints (NFR-PERF-001 to 003):**
- Lighthouse Performance ≥ 90, FCP < 1.5s, TTI < 3.5s
- API p95 < 500ms, database query optimization required
- Bundle size < 300KB gzipped → drives code splitting strategy

**Scalability Requirements (NFR-SCALE-001 to 002):**
- Serverless auto-scaling (no server management)
- Schema supports thousands of users without degradation
- Connection pooling via Supabase (managed)

**Security Mandates (NFR-SEC-001 to 003):**
- HTTPS-only in production, HTTP-only cookies, CSRF protection
- Environment variables never exposed to client (API proxy pattern critical)
- Zero high/critical vulnerabilities (npm audit gates deployment)

**Reliability Standards (NFR-REL-001 to 002):**
- Graceful degradation when external services fail
- Error boundaries prevent complete crashes
- Retry logic for transient failures

**Maintainability Goals (NFR-MAINT-001 to 003):**
- TypeScript strict mode, ESLint enforcement
- Architecture Decision Records for key choices
- Example tests demonstrating patterns

**Accessibility Baseline (NFR-ACCESS-001 to 002):**
- WCAG 2.1 Level AA compliance (mandatory)
- Keyboard navigation, screen reader support, semantic HTML
- Radix UI primitives provide accessibility foundation

**Compatibility Requirements (NFR-COMPAT-001 to 002):**
- Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions)
- No IE11 → allows modern JS/CSS features
- Deployment-agnostic within serverless platforms (Vercel primary, Netlify/Railway documented)

**NFR Architectural Implications:**
- Performance budget affects component lazy loading, image optimization strategies
- Security requirements mandate API proxy pattern (never expose keys), middleware-enforced auth
- Accessibility baseline affects component library choice (Radix UI), testing strategy
- Serverless-only constraint shapes database connection strategy, middleware design

## Scale & Complexity

**Project Scale Assessment:**

- **Primary domain**: Full-stack serverless web application (Next.js 15 App Router monolith)
- **Complexity level**: **Medium**
  - Established production codebase (not greenfield)
  - Moderate feature set (10 core modules)
  - Upgrade orchestration challenge (Next.js 14→15, React 18→19)
  - Brownfield constraints (preserve battle-tested patterns)
- **Estimated architectural components**:
  - **6 major subsystems**: Auth, UI/Components, API Layer, Database, Integration Layer (Supabase/Dify/Email), Build/Deploy Pipeline
  - **38+ UI components** (shadcn/ui + custom chat/layout components)
  - **5 API endpoints** (chat proxy, thread CRUD, messages)
  - **11 route groups** across public/protected/admin areas

**Complexity Indicators:**
- ✅ Real-time features: SSE streaming for AI chat (example code)
- ❌ Multi-tenancy: Single-user per account (no workspace model in MVP)
- ❌ Regulatory compliance: No specialized requirements (general SaaS only)
- ⚠️ Integration complexity: **Medium** - Supabase (auth + DB), Dify (AI), Email service, Analytics provider
- ✅ User interaction complexity: Streaming chat, responsive design, i18n, theme switching
- ⚠️ Data complexity: **Low-Medium** - Single primary table (threads), external conversation storage (Dify)

**Scale Reality Check:**
This is a **personal reuse template**, not a commercial product. Architectural decisions should optimize for:
1. **Quick fork-to-deploy** (< 1 week from fork to production MVP)
2. **2-hour rebrand** (colors, fonts, logo without hunting through files)
3. **AI agent consistency** (prevent implementation conflicts when agents add features)
4. **Maintainability solo** (future-you can remember how to customize 6 months later)

## Technical Constraints & Dependencies

**Hard Constraints:**

1. **Serverless Deployment Only**:
   - No long-running processes, no cron jobs (use external schedulers)
   - Stateless API routes (session storage in cookies only)
   - Edge runtime compatibility for middleware

2. **PostgreSQL Dependency**:
   - Drizzle ORM requires PostgreSQL-specific features
   - No NoSQL or multi-database support
   - Connection pooling managed externally (Supabase)

3. **Modern Stack Only**:
   - No legacy browser support (IE11, old Safari)
   - Requires JavaScript enabled
   - Modern build tooling required (Node.js 20+)

4. **Zero Vendor Lock-In Mandate**:
   - Supabase client swappable (standard PostgreSQL + Auth interface)
   - AI integration replaceable (Dify → OpenAI/Anthropic example code)
   - Email provider agnostic (Resend/SendGrid/SMTP adaptable)
   - Analytics provider swappable (PostHog/Amplitude/custom)

**Upgrade Path Constraints:**

Critical migrations in flight:
- **Next.js 14 → 15**: Async params/searchParams API changes
- **React 18 → 19**: New hooks, server actions patterns
- **Supabase Auth V1 → V2**: Breaking changes in session management
- **TypeScript 5.6 → 5.7+**: Type system improvements

**Architectural constraint**: Must maintain backward compatibility during upgrade while documenting migration paths.

**External Service Dependencies:**

- **Supabase**: Auth + PostgreSQL hosting (critical path)
- **Dify AI**: Chat streaming service (optional - example code)
- **Email Service**: Transactional emails (Resend/SendGrid/SMTP - configurable)
- **Analytics Provider**: Event tracking (PostHog recommended, swappable)
- **Deployment Platform**: Vercel primary, alternatives documented
- **Error Tracking**: Sentry (optional but recommended)

**Existing Architecture Constraints (Brownfield):**

Must preserve these production-proven patterns:
- Middleware orchestration (i18n → session refresh → auth check)
- API proxy pattern for external services (Dify example)
- Supabase SSR client factories (browser/server/middleware)
- Thread management CRUD (demonstrates data patterns)
- shadcn/ui component system (38+ components in production)

**Architectural Decision Impact**: Cannot introduce patterns that conflict with these established flows. Enhancements only.

## Cross-Cutting Concerns Identified

**1. Authentication & Authorization** (affects: all protected routes, API endpoints, middleware)
- **Scope**: Middleware validates session on every request, API routes check user context
- **Architectural impact**:
  - Middleware design (edge-compatible, cookie-based session refresh)
  - API route boilerplate (session validation pattern)
  - Client-side auth state (minimal - trust server session)
- **AI Agent Implication**: All new protected routes MUST add path to middleware `protectedPaths` array. All API routes MUST validate session.

**2. Internationalization (i18n)** (affects: all UI, routing, content)
- **Scope**: 3 languages (en/hi/bn), locale-prefixed URLs, fallback to English
- **Architectural impact**:
  - Routing strategy (next-intl middleware, locale params)
  - Content loading (JSON translation files)
  - Component design (useTranslations hook everywhere)
- **AI Agent Implication**: All new UI text MUST use translation keys. All new pages MUST exist under `[locale]/` directory structure.

**3. Error Handling & Monitoring** (affects: entire application stack)
- **Scope**: React error boundaries (app/route/component levels), API error format, Sentry integration
- **Architectural impact**:
  - Component hierarchy (error boundaries at strategic levels)
  - API contract (consistent error response structure)
  - Logging infrastructure (structured logging with context)
- **AI Agent Implication**: New components in critical paths NEED error boundaries. API errors MUST follow standard format `{error, code, details}`.

**4. Analytics & Instrumentation** (affects: all user flows, feature adoption)
- **Scope**: Track sign-up, onboarding, feature usage, errors, conversion funnels
- **Architectural impact**:
  - Event tracking utilities (trackEvent wrapper)
  - Privacy-respecting collection (GDPR/CCPA compliant)
  - Provider abstraction (swap PostHog/Amplitude easily)
  - Development mode (log events to console, don't send)
- **AI Agent Implication**: New user flows SHOULD track key events. Critical actions MUST be instrumented for conversion tracking.

**5. Responsive Design** (affects: all pages, components)
- **Scope**: Mobile-first, 3 breakpoints (< 768px, 768-1024px, > 1024px)
- **Architectural impact**:
  - Tailwind configuration (responsive utilities)
  - Component design (mobile-first, progressive enhancement)
  - Touch vs mouse interactions
- **AI Agent Implication**: New components MUST work at all breakpoints. Test mobile view first.

**6. Theme Customization** (affects: all styled components)
- **Scope**: Light/dark mode, 2-hour rebrand requirement
- **Architectural impact**:
  - Design token strategy (CSS variables + Tailwind config)
  - Single source of truth (tailwind.config.js for colors)
  - Component styling (use semantic color tokens, not hardcoded)
- **AI Agent Implication**: New components MUST use theme variables (bg-primary, text-foreground). Never hardcode colors.

**7. Accessibility** (affects: all interactive elements)
- **Scope**: WCAG 2.1 AA compliance, keyboard navigation, screen readers
- **Architectural impact**:
  - Component library choice (Radix UI primitives for built-in a11y)
  - Semantic HTML enforcement
  - ARIA label strategy
- **AI Agent Implication**: New interactive components MUST be keyboard accessible. Use Radix primitives where possible.

**8. Modular Feature Management** (affects: feature development, customization)
- **Scope**: Admin panel, feedback widget, AI chat should be removable without breaking build
- **Architectural impact**:
  - Feature isolation (dedicated route groups, API namespaces)
  - No tight coupling between features
  - Navigation configurable (remove links cleanly)
- **AI Agent Implication**: New features SHOULD be self-contained. Avoid dependencies on optional features.

**9. SEO & Discoverability** (affects: all public pages, social sharing)
- **Scope**: hreflang for i18n, Open Graph metadata, dynamic OG images, sitemap, robots.txt
- **Architectural impact**:
  - Metadata API usage in layouts and pages
  - Edge-compatible OG image generation (`@vercel/og`)
  - Sitemap generation in `app/sitemap.ts`
- **AI Agent Implication**: New public pages MUST include appropriate metadata. Shareable content SHOULD use dynamic OG images.

**10. Go-To-Market Infrastructure** (affects: growth, marketing, launch)
- **Scope**: Share widgets, referral tracking, waitlist capture, social proof, changelog automation
- **Architectural impact**:
  - Database schemas for referrals, shareable links, waitlist
  - Component library for social proof widgets
  - GitHub Actions for changelog-to-content automation
- **AI Agent Implication**: GTM features are OPTIONAL modules. Implement following established patterns if needed.
