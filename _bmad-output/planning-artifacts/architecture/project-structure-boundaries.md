# Project Structure & Boundaries

## Complete Project Directory Structure

```
vt-saas-template/  (formerly HealthCompanion)
├── README.md                      # Project overview, setup instructions
├── CLAUDE.md                      # AI assistant instructions
├── package.json                   # Dependencies, scripts, metadata
├── package-lock.json              # Lockfile for deterministic installs
├── next.config.mjs                # Next.js config (plugins, env, rewrites)
├── tailwind.config.ts             # Tailwind CSS config (theme, plugins)
├── tsconfig.json                  # TypeScript config (strict mode, paths)
├── postcss.config.mjs             # PostCSS config (Tailwind, autoprefixer)
├── drizzle.config.ts              # Drizzle ORM config (DB, migrations)
├── vitest.config.ts               # Vitest test runner config
├── vitest-setup.ts                # Vitest global setup
├── playwright.config.ts           # Playwright E2E test config
├── commitlint.config.js           # Commit message linting
├── eslint.config.js               # ESLint rules (Antfu config)
├── .prettierrc                    # Prettier formatting rules
├── .env.example                   # Example environment variables
├── .env.local                     # Local environment (NEVER commit)
├── .gitignore                     # Git ignore rules
│
├── .github/                       # GitHub-specific configuration
│   ├── PULL_REQUEST_TEMPLATE.md  # PR template
│   └── workflows/                # GitHub Actions CI/CD
│       ├── ci.yml               # Main CI pipeline (test, lint, build)
│       ├── e2e.yml              # E2E test workflow
│       └── crowdin.yml          # i18n sync workflow
│
├── .husky/                        # Git hooks for code quality
│   ├── pre-commit               # Runs lint-staged
│   └── commit-msg               # Runs commitlint
│
├── .storybook/                    # Storybook configuration
│   ├── main.ts                  # Storybook main config
│   └── preview.ts               # Global decorators
│
├── _bmad/                         # BMAD workflow system (optional)
│   ├── bmm/                     # BMM modules and workflows
│   └── core/                    # BMAD core workflows
│
├── docs/                          # Project documentation
│   ├── index.md                 # Documentation index
│   ├── project-overview.md      # Project overview
│   ├── architecture.md          # Architecture decisions (legacy)
│   ├── source-tree-analysis.md  # Codebase structure analysis
│   ├── api-contracts.md         # API endpoint documentation
│   ├── component-inventory.md   # Component catalog
│   ├── data-models.md           # Database schema documentation
│   ├── deployment-guide.md      # Deployment instructions
│   ├── development-guide.md     # Developer onboarding
│   └── archive/                 # Archived documentation
│
├── migrations/                    # Database migrations (Drizzle)
│   ├── 0000_*.sql              # Migration SQL files
│   ├── 0001_*.sql              # Sequential migrations
│   └── meta/                   # Migration metadata
│       └── _journal.json       # Migration tracking
│
├── public/                        # Static assets (served as-is)
│   ├── apple-touch-icon.png    # iOS home screen icon
│   ├── favicon.ico             # Browser favicon
│   └── assets/                 # Images, icons, etc.
│       ├── images/
│       └── icons/
│
├── src/                           # Application source code ⭐ PRIMARY
│   ├── middleware.ts            # Edge middleware (i18n + auth) ⭐ ENTRY POINT
│   │
│   ├── app/                     # Next.js App Router (pages + API)
│   │   ├── layout.tsx          # Root app layout
│   │   ├── sitemap.ts          # Sitemap generation
│   │   │
│   │   ├── [locale]/           # Internationalized routes
│   │   │   ├── layout.tsx      # Root locale layout (providers, fonts)
│   │   │   ├── not-found.tsx   # 404 page
│   │   │   │
│   │   │   ├── (unauth)/       # Route group: Public pages
│   │   │   │   ├── layout.tsx  # Public layout
│   │   │   │   └── page.tsx    # Landing page
│   │   │   │
│   │   │   ├── (auth)/         # Route group: Protected pages
│   │   │   │   ├── layout.tsx  # Auth layout
│   │   │   │   │
│   │   │   │   ├── (center)/   # Centered auth pages
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── sign-in/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── sign-up/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── sign-out/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── dashboard/   # Dashboard page
│   │   │   │   │   └── page.tsx
│   │   │   │   └── onboarding/  # Onboarding flow
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── (chat)/          # Route group: Chat interface
│   │   │       ├── layout.tsx   # Chat layout with sidebar
│   │   │       └── chat/
│   │   │           └── page.tsx # Main chat UI
│   │   │
│   │   ├── api/                 # API Routes (serverless functions)
│   │   │   ├── chat/           # Chat endpoints
│   │   │   │   ├── route.ts    # POST /api/chat - AI chat proxy ⭐ CRITICAL
│   │   │   │   └── messages/
│   │   │   │       └── route.ts # GET /api/chat/messages
│   │   │   │
│   │   │   └── threads/         # Thread management
│   │   │       ├── route.ts     # GET/POST /api/threads
│   │   │       └── [id]/
│   │   │           ├── route.ts # GET/PUT/DELETE /api/threads/:id
│   │   │           └── archive/
│   │   │               └── route.ts # POST /api/threads/:id/archive
│   │   │
│   │   └── auth/                # Auth callback handlers
│   │       └── callback/
│   │           └── route.ts     # OAuth callback
│   │
│   ├── components/              # Reusable React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── label.tsx
│   │   │   └── accordion.tsx
│   │   │
│   │   ├── chat/               # Chat-specific components (REMOVABLE)
│   │   │   ├── AppShell.tsx
│   │   │   ├── ChatInterface.tsx ⭐ CRITICAL
│   │   │   ├── ThreadListSidebar.tsx
│   │   │   ├── ThreadItem.tsx
│   │   │   ├── ThreadView.tsx
│   │   │   ├── ThreadTitleEditor.tsx
│   │   │   ├── Thread.tsx
│   │   │   ├── EmptyThreadState.tsx
│   │   │   ├── ErrorThreadState.tsx
│   │   │   ├── ThreadListSkeleton.tsx
│   │   │   └── TypingIndicator.tsx
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── MainAppShell.tsx
│   │   │   └── NavItem.tsx
│   │   │
│   │   ├── ActiveLink.tsx      # Active link wrapper
│   │   ├── Background.tsx      # Background gradient
│   │   ├── LocaleSwitcher.tsx  # Language switcher
│   │   └── ToggleMenuButton.tsx # Menu toggle button
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/              # Authentication features
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── dashboard/         # Dashboard features
│   │   │   ├── DashboardContent.tsx
│   │   │   └── DashboardStats.tsx
│   │   │
│   │   └── landing/           # Landing page features
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       └── CTA.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSupabase.ts     # Supabase client hook
│   │   ├── useAuth.ts         # Auth state hook
│   │   └── useToast.ts        # Toast notification hook
│   │
│   ├── libs/                   # Third-party integrations
│   │   ├── supabase/          # Supabase clients
│   │   │   ├── client.ts      # Browser client
│   │   │   ├── server.ts      # Server client ⭐ CRITICAL
│   │   │   └── middleware.ts  # Middleware session helper
│   │   │
│   │   └── dify/              # Dify AI client (REMOVABLE)
│   │       └── client.ts      # Dify API wrapper ⭐ CRITICAL
│   │
│   ├── locales/                # i18n translation files
│   │   ├── en.json            # English (default)
│   │   ├── hi.json            # Hindi
│   │   └── bn.json            # Bengali
│   │
│   ├── models/                 # Database schemas (Drizzle ORM)
│   │   └── Schema.ts          # Table definitions ⭐ CRITICAL
│   │
│   ├── styles/                 # Global styles
│   │   └── global.css         # Tailwind imports + custom CSS
│   │
│   ├── templates/              # Page templates
│   │   └── BaseTemplate.tsx   # Base page template
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── database.types.ts  # Auto-generated Supabase types
│   │   └── global.d.ts        # Global type declarations
│   │
│   └── utils/                  # Utility functions
│       ├── AppConfig.ts       # App configuration ⭐ CRITICAL
│       ├── Helpers.ts         # Helper functions
│       └── Logger.ts          # Logging utilities (Pino)
│
└── tests/                      # E2E test files (Playwright)
    ├── auth.spec.ts           # Auth flow tests
    ├── chat.spec.ts           # Chat functionality tests
    ├── dashboard.spec.ts      # Dashboard tests
    └── fixtures/              # Test fixtures
        └── test-user.ts       # Test account creation
```

## Architectural Boundaries

**API Boundaries:**

**External API Endpoints** (`/api/*`):
- **Authentication**: `/api/auth/callback` - OAuth callback handler (Supabase)
- **Chat**: `/api/chat` - AI chat proxy (Dify integration) - REMOVABLE
  - Validates session → Proxies to Dify → Returns SSE stream
  - Request: `{ messages, conversation_id? }`
  - Response: SSE stream with `data: {...}` chunks
- **Chat Messages**: `/api/chat/messages` - Message history - REMOVABLE
  - Query params: `conversation_id`
  - Response: `{ data: Message[] }`
- **Threads**: `/api/threads` - Thread CRUD operations - REMOVABLE
  - GET: List user threads
  - POST: Create new thread
  - `[id]` routes: GET/PUT/DELETE specific thread
  - `[id]/archive`: POST to archive thread

**Internal Service Boundaries:**
- **Supabase Client Layer** (`src/libs/supabase/`):
  - Browser client for client components
  - Server client for server components/API routes
  - Middleware client for edge runtime
  - All share same session, different initialization
- **Database Access Layer** (`src/models/Schema.ts`):
  - Drizzle ORM schemas define table structure
  - Per-project schema pattern (`health_companion` schema)
  - All database access goes through Drizzle
- **AI Integration Layer** (`src/libs/dify/client.ts`) - REMOVABLE:
  - Encapsulates Dify API calls
  - Handles SSE streaming
  - Timeout management

**Authentication & Authorization Boundaries:**
- **Middleware Boundary** (`src/middleware.ts`):
  - First point of auth check
  - Runs on Edge runtime before page render
  - Validates session, redirects if unauthorized
- **Protected Route Groups** (`(auth)`, `(chat)`):
  - All routes require authenticated session
  - Session validated via Supabase client
- **API Route Protection**:
  - Every API route validates session independently
  - Returns 401 if unauthenticated
  - No shared auth state between API routes

**Component Boundaries:**

**Client vs Server Components:**
- **Server Components** (default):
  - All page.tsx files
  - Layouts without client interactivity
  - Use `createClient(cookieStore)` for Supabase
- **Client Components** (`'use client'`):
  - Interactive UI components
  - Hooks usage (useState, useEffect, etc.)
  - Event handlers
  - Use `createBrowserClient()` for Supabase

**Component Communication Patterns:**
- **Parent → Child**: Props (typed with TypeScript interfaces)
- **Child → Parent**: Callback props
- **Sibling Communication**: Lift state to common parent or use Context
- **Global State**: React Context providers in `[locale]/layout.tsx`
  - Example: Theme provider, Auth context (if needed)
- **Server → Client**: Server actions or API routes
  - Prefer API routes for complex operations

**UI Component Hierarchy:**
- **Primitive Components** (`components/ui/`):
  - shadcn/ui components based on Radix UI
  - No business logic, pure presentation
  - Reusable across all features
- **Feature Components** (`components/{feature}/`):
  - Domain-specific UI logic
  - Compose primitive components
  - Example: `chat/ChatInterface.tsx` uses `ui/button`, `ui/input`
- **Feature Modules** (`features/{feature}/`):
  - Complete feature implementations
  - May include local components, hooks, utils
  - Example: `features/auth/SignInForm.tsx`
- **Page Components** (`app/[locale]/(group)/{route}/page.tsx`):
  - Top-level entry points
  - Orchestrate feature components
  - Handle data fetching (Server Components)

**Service Boundaries:**

**Database Service** (Drizzle ORM):
- **Schema Definition**: `src/models/Schema.ts`
- **Migration Management**: Automatic on app start (dev) or manual (production)
- **Query Interface**: Type-safe query builder
- **Transaction Support**: Built-in transaction methods

**Authentication Service** (Supabase Auth):
- **Session Management**: Handled by Supabase SDK
- **Token Refresh**: Automatic via middleware
- **User Management**: Supabase Auth API
- **OAuth Providers**: Configured in Supabase dashboard

**External Integration Service**:
- **Dify AI** (REMOVABLE): `src/libs/dify/client.ts`
  - Stateless, API key stored server-side only
  - No client-side exposure
  - SSE streaming for real-time responses
- **PostHog Analytics** (TO BE ADDED):
  - Client-side tracking via PostHog SDK
  - Event tracking: `{object}_{action}` naming
  - User identification on auth
- **Resend Email** (TO BE ADDED):
  - Server-side only (API key protected)
  - React Email templates in `emails/` directory
  - Transactional emails only

**Data Boundaries:**

**Database Schema Boundaries:**
- **Per-Project Schema Pattern**:
  ```sql
  CREATE SCHEMA IF NOT EXISTS project_name;
  ```
- **HealthCompanion Tables** (under `health_companion` schema):
  - `threads` table: User conversation threads - REMOVABLE
  - Additional tables as needed per project
- **Supabase Auth Tables** (under `auth` schema):
  - Managed by Supabase, read-only access
  - `auth.users` table for user data

**Data Access Patterns:**
- **Server Components**: Direct database queries via Drizzle
- **Client Components**: Fetch via API routes
- **API Routes**: Database queries + business logic
- **No Direct Client-DB**: All client data fetching through API

**Caching Boundaries:**
- **Next.js Cache**:
  - Server Components: `fetch()` caching by default
  - `revalidatePath()` / `revalidateTag()` for invalidation
- **Edge Cache** (Vercel):
  - Static pages: Cached indefinitely
  - ISR pages: Time-based revalidation
  - API routes: No caching by default
- **Browser Cache**:
  - Static assets: Long-term caching via immutable filenames
  - API responses: No caching (Cache-Control: no-store)

**External Data Integration Points:**
- **Dify API** (REMOVABLE):
  - Endpoint: `DIFY_API_URL` from env
  - Authentication: API key in server-side env
  - Timeout: Configurable (default from config)
- **Supabase**:
  - Endpoint: `NEXT_PUBLIC_SUPABASE_URL` from env
  - Authentication: Anon key (public) + Service key (server)
  - Real-time: Supabase Realtime for live updates (if needed)
- **PostHog** (TO BE ADDED):
  - Endpoint: PostHog cloud or self-hosted
  - Authentication: Project API key
  - Data sent: Analytics events, user properties
- **Resend** (TO BE ADDED):
  - Endpoint: `https://api.resend.com`
  - Authentication: API key (server-side only)
  - Data sent: Email payloads with React Email templates

## Requirements to Structure Mapping

**Feature/Epic Mapping:**

**FR-AUTH: Authentication System**
- **Components**: `src/features/auth/` (SignInForm, SignUpForm)
- **Middleware**: `src/middleware.ts` (session validation, route protection)
- **Supabase Integration**: `src/libs/supabase/` (client, server, middleware)
- **API Routes**: `src/app/api/auth/callback/route.ts` (OAuth callback)
- **Protected Layouts**: `src/app/[locale]/(auth)/layout.tsx`
- **Auth Pages**: `src/app/[locale]/(auth)/(center)/sign-in/`, `sign-up/`, `sign-out/`
- **Types**: `src/types/database.types.ts` (auto-generated from Supabase)

**FR-TEMPLATE: Template Structure**
- **Root Config**: All root-level config files (package.json, tsconfig, etc.)
- **Source Organization**: `src/` directory structure
- **Route Structure**: `src/app/[locale]/` with route groups
- **Component Library**: `src/components/ui/` (shadcn/ui)
- **Documentation**: `docs/` directory with all guides

**FR-DATABASE: Database Management**
- **Schema Definition**: `src/models/Schema.ts` (Drizzle schemas)
- **Migrations**: `migrations/` directory (auto-generated SQL)
- **Configuration**: `drizzle.config.ts` (DB connection, migration path)
- **Per-Project Pattern**: Schema organization (`health_companion`, future projects)

**FR-UI: Component Library**
- **Primitive Components**: `src/components/ui/` (14 shadcn components)
- **Layout Components**: `src/components/layout/` (MainAppShell, NavItem)
- **Shared Components**: `src/components/` (Background, LocaleSwitcher, etc.)
- **Styling**: `src/styles/global.css`, `tailwind.config.ts`

**FR-API: API Structure**
- **API Routes**: `src/app/api/` directory
  - Chat: `api/chat/`, `api/chat/messages/` - REMOVABLE
  - Threads: `api/threads/`, `api/threads/[id]/` - REMOVABLE
  - Auth: `api/auth/callback/`
- **Type Safety**: All routes use Zod validation
- **Error Format**: Consistent `{ error, code, details }` structure

**FR-I18N: Internationalization**
- **Translation Files**: `src/locales/` (en.json, hi.json, bn.json)
- **Configuration**: `src/utils/AppConfig.ts` (locale config)
- **Middleware**: `src/middleware.ts` (locale routing)
- **Layout Integration**: `src/app/[locale]/layout.tsx` (next-intl provider)

**FR-DEPLOY: Deployment Setup**
- **CI/CD**: `.github/workflows/` (ci.yml, e2e.yml, crowdin.yml)
- **Vercel Config**: `next.config.mjs` (production optimizations)
- **Environment**: `.env.example` (template for required vars)
- **Build**: Scripts in `package.json` (build, start, etc.)

**FR-DOCS: Documentation**
- **Project Docs**: `docs/` directory (9 documentation files)
- **README**: `README.md` (setup instructions, overview)
- **AI Instructions**: `CLAUDE.md` (AI assistant guidance)
- **Code Comments**: JSDoc comments for complex logic

**FR-CHAT: Chat Feature** (REMOVABLE - Example Feature)
- **Components**: `src/components/chat/` (12 chat components)
- **Chat Page**: `src/app/[locale]/(chat)/chat/page.tsx`
- **API Integration**: `src/libs/dify/client.ts`
- **API Routes**: `src/app/api/chat/`, `src/app/api/chat/messages/`
- **Thread Management**: `src/app/api/threads/` (CRUD operations)
- **Database**: `threads` table in `src/models/Schema.ts`

**Cross-Cutting Concerns:**

**Authentication & Authorization** (CORE):
- **Middleware**: `src/middleware.ts` (first auth checkpoint)
- **Supabase Clients**: `src/libs/supabase/` (3 client types)
- **Protected Routes**: Route groups `(auth)` and `(chat)`
- **API Protection**: Session validation in all API routes

**Error Handling & Monitoring** (CORE):
- **Global Error Handling**: `src/app/error.tsx` (root error boundary)
- **API Error Format**: Consistent structure across all API routes
- **Sentry Integration**: `sentry.client.config.ts`, `sentry.server.config.ts`
- **Logger**: `src/utils/Logger.ts` (Pino + Logtail)

**Internationalization (i18n)** (CORE):
- **Middleware**: `src/middleware.ts` (locale detection and routing)
- **Translation Files**: `src/locales/` (3 languages)
- **Configuration**: `src/utils/AppConfig.ts` (supported locales)
- **Usage**: `useTranslations()` hook in components

**Analytics & Instrumentation** (TO BE ADDED):
- **Client Integration**: PostHog SDK initialization in root layout
- **Event Tracking**: Custom hook `useAnalytics()` in `src/hooks/`
- **Server Tracking**: PostHog Node SDK for server-side events
- **Event Naming**: `{object}_{action}` pattern

**Responsive Design** (CORE):
- **Tailwind Config**: `tailwind.config.ts` (breakpoints, mobile-first)
- **Global Styles**: `src/styles/global.css` (responsive utilities)
- **Component Patterns**: All UI components responsive by default

**Theme Customization** (CORE):
- **CSS Variables**: `src/styles/global.css` (HSL color system)
- **Theme Provider**: In root layout (if implementing dark mode)
- **Tailwind Integration**: Theme colors mapped to Tailwind

**Accessibility** (CORE):
- **Radix UI Primitives**: `src/components/ui/` (accessible by default)
- **WCAG 2.1 AA**: Target compliance level
- **Testing**: Lighthouse accessibility audits in CI

**Modular Feature Management** (CORE):
- **Feature Organization**: `src/features/` (self-contained modules)
- **Route Groups**: Logical feature grouping in app router
- **Component Isolation**: Feature-specific components in `components/{feature}/`

## Integration Points

**Internal Communication:**

**Server Component → Client Component:**
- Pass data via props (serializable only)
- Server fetches data, renders with client interactivity
- Example: Dashboard page (server) → DashboardStats (client)

**Client Component → API Route:**
- `fetch()` calls from client to `/api/*` endpoints
- Always validate session in API route
- Example: ChatInterface → `/api/chat` (POST)

**API Route → Database:**
- Drizzle ORM queries from API routes
- Server-side only (never client-side)
- Example: `/api/threads` → `db.select().from(threads)`

**API Route → External Service:**
- Server-side integration (API keys protected)
- Proxy pattern for client requests
- Example: `/api/chat` → Dify API

**Component → Component (Same Level):**
- Lift state to common parent
- Pass callbacks for child-to-parent communication
- Use Context for deeply nested state

**Middleware → All Routes:**
- Runs before every request
- Updates Supabase session
- Enforces auth on protected routes
- Handles i18n routing

**External Integrations:**

**Supabase (Auth + Database):**
- **Authentication**: OAuth providers, email/password
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: Subscriptions for live updates (optional)
- **Storage**: File uploads (if needed)
- **Integration**: `src/libs/supabase/` clients

**Dify AI (REMOVABLE):**
- **Chat API**: SSE streaming responses
- **Proxy Pattern**: `/api/chat` → Dify API
- **Session Management**: `conversation_id` tracking
- **Integration**: `src/libs/dify/client.ts`

**PostHog (TO BE ADDED):**
- **Client SDK**: Browser analytics tracking
- **Server SDK**: Backend event tracking
- **Features**: Feature flags, A/B testing, session recording
- **Integration**: Initialize in root layout, `useAnalytics()` hook

**Resend + React Email (TO BE ADDED):**
- **Email API**: Transactional emails
- **Templates**: React components in `emails/` directory
- **Integration**: Server-side only from API routes
- **Use Cases**: Welcome emails, password resets, notifications

**Sentry (Error Monitoring):**
- **Client**: Browser error tracking
- **Server**: API route and server component errors
- **Edge**: Middleware errors
- **Integration**: `sentry.*.config.ts` files

**Vercel (Deployment):**
- **Hosting**: Serverless deployment
- **Edge Runtime**: Middleware and edge functions
- **Preview**: Automatic preview URLs for PRs
- **Analytics**: Web analytics and speed insights

**Crowdin (i18n):**
- **Translation Management**: Sync via GitHub Actions
- **Workflow**: Push to main → Crowdin updates
- **Integration**: `.github/workflows/crowdin.yml`

**Data Flow:**

**User Authentication Flow:**
```
User → Sign In Form (Client)
  → Supabase Auth (External)
  → OAuth Callback (/api/auth/callback)
  → Middleware (Session Validation)
  → Protected Route (Access Granted)
```

**Chat Request Flow (REMOVABLE):**
```
User → ChatInterface (Client)
  → /api/chat (POST with messages)
  → Validate Session (Supabase)
  → Dify API (SSE Stream)
  → Stream to Client (SSE)
  → Display in ChatInterface
```

**Thread Management Flow (REMOVABLE):**
```
User → ThreadListSidebar (Client)
  → /api/threads (GET)
  → Validate Session
  → Query Database (Drizzle)
  → Return { data: Thread[] }
  → Render Thread List
```

**Page Load Flow (Protected Route):**
```
User → Request /dashboard
  → Middleware (Session Check)
  → Authorized? → Continue
  → page.tsx (Server Component)
  → Fetch Data (Drizzle)
  → Render with Data
  → Stream to Browser
```

**API Request with Validation Flow:**
```
Client → POST /api/resource
  → API Route Handler
  → Validate Session (Supabase)
  → Parse Body (JSON)
  → Validate with Zod Schema
  → Invalid? → Return 400 { error, code, details }
  → Valid? → Business Logic
  → Database Operation (Drizzle)
  → Return { data: Result }
```

**Analytics Event Flow (TO BE ADDED):**
```
User Action → Component
  → useAnalytics().track('{object}_{action}', props)
  → PostHog SDK (Client)
  → PostHog API (External)
  → Store Event + User Properties
```

## File Organization Patterns

**Configuration Files:**

**Root Level:**
- `package.json`, `tsconfig.json`, `next.config.mjs`, etc.
- All build/framework config at root
- Environment examples: `.env.example` (committed), `.env.local` (gitignored)

**Hidden Directories:**
- `.github/` for GitHub-specific config
- `.husky/` for git hooks
- `.storybook/` for Storybook config

**Source Organization:**

**Component Organization:**
```
components/
├── ui/              # Primitive components (shadcn/ui)
├── {feature}/       # Feature-specific components
├── layout/          # Layout components
└── *.tsx            # Shared components
```

**Feature Organization:**
```
features/
└── {feature}/       # Self-contained feature modules
    ├── Component.tsx
    ├── hook.ts
    └── utils.ts
```

**Integration Layer:**
```
libs/
└── {service}/       # Third-party service integrations
    ├── client.ts    # Service client wrapper
    └── types.ts     # Service-specific types
```

**App Router Structure:**
```
app/
├── [locale]/        # Locale-based routing
│   ├── (group)/    # Route groups (no URL segment)
│   │   ├── layout.tsx
│   │   └── {route}/
│   │       └── page.tsx
│   └── layout.tsx
└── api/            # API routes (no locale prefix)
    └── {resource}/
        └── route.ts
```

**Test Organization:**

**E2E Tests:**
```
tests/
├── *.spec.ts        # E2E test files (Playwright)
├── *.e2e.ts         # Alternative E2E naming
└── fixtures/        # Test fixtures and helpers
    └── test-user.ts
```

**Unit Tests:**
- Co-located with source files
- Naming: `Component.test.tsx` or `utils.test.ts`
- Location: Same directory as the code being tested
- Environment: jsdom for components, node for utilities

**Asset Organization:**

**Static Assets:**
```
public/
├── favicon.ico      # Browser favicon
├── apple-touch-icon.png  # iOS icon
└── assets/          # Images, icons, etc.
    ├── images/
    └── icons/
```

**Generated Assets:**
- `.next/` directory (build output, gitignored)
- `storybook-static/` (Storybook build, gitignored)
- `coverage/` (test coverage, gitignored)

## Development Workflow Integration

**Development Server Structure:**

**Local Development:**
```bash
npm run dev          # Start Next.js dev server + Spotlight (Sentry)
# Runs on http://localhost:3000
# Hot reload enabled
# Middleware runs on edge runtime
# API routes on serverless
```

**Database Development:**
```bash
npm run db:studio    # Open Drizzle Studio
# Access at https://local.drizzle.studio
# Visual database editor
# Query builder interface
```

**Testing Development:**
```bash
npm test             # Run Vitest unit tests (watch mode)
npm run test:e2e     # Run Playwright E2E tests
# Tests run against dev server (local) or build (CI)
```

**Storybook Development:**
```bash
npm run storybook    # Start Storybook
# Component development in isolation
# Visual testing of UI components
```

**Build Process Structure:**

**Production Build:**
```bash
npm run build        # Next.js production build
# Outputs to .next/ directory
# Server bundles in .next/server/
# Static assets in .next/static/
# ISR/SSG pages in .next/server/pages/
```

**Type Checking:**
```bash
npm run check-types  # TypeScript compilation check
# No output files
# Validates all TypeScript files
# Runs in strict mode
```

**Linting:**
```bash
npm run lint         # ESLint + Prettier
npm run lint:fix     # Auto-fix issues
# Checks code style
# Enforces Antfu config rules
```

**Deployment Structure:**

**Vercel Deployment:**
```
Push to GitHub → Vercel Build
  → Install dependencies (npm ci)
  → Run build (npm run build)
  → Generate .next/ directory
  → Deploy to Vercel Edge Network
  → Serverless functions for API routes
  → Edge middleware deployment
  → Automatic domain + SSL
```

**Environment Variables:**
- Development: `.env.local` (gitignored)
- Production: Vercel dashboard or CLI
- Preview: Inherit from production, override if needed

**Database Migrations:**
- Development: Auto-apply on app start
- Production: Manual run (Edge runtime limitation) or run via API route on first request

**CI/CD Structure:**
```
GitHub PR → GitHub Actions
  → Install dependencies
  → Type check (npm run check-types)
  → Lint (npm run lint)
  → Unit tests (npm test)
  → E2E tests (npm run test:e2e)
  → Build (npm run build)
  → Success → Merge allowed
  → Failure → Block merge
```

**Preview Deployments:**
- Every PR gets unique preview URL
- Isolated environment per PR
- Full production build
- Automatic cleanup on PR close
