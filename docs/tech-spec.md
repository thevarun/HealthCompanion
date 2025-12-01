# HealthCompanion - Technical Specification

**Author:** Varun
**Date:** 2025-12-01
**Project Level:** Quick Flow (5 stories)
**Change Type:** New Feature - AI-Powered Health Coach SaaS MVP
**Development Context:** Greenfield

---

## Context

### Available Documents

**No pre-existing documentation found** - This is a greenfield project starting from scratch.

**What this means:**
- No product brief or research documents to reference
- No brownfield codebase documentation
- Fresh start with clear direction from stakeholder input
- Tech stack and architecture decisions made collaboratively

**Context Source:**
- Direct stakeholder input (health coach practice digitization)
- Chosen starter components and tech stack
- SaaS boilerplate analysis
- Assistant-UI library capabilities

### Project Stack

**Base Framework:**
- Next.js 14 (from SaaS Boilerplate - free version)
- React 18
- TypeScript (strict mode)
- Tailwind CSS v3
- Shadcn UI components

**Authentication & Database:**
- Supabase Auth (replacing Clerk from boilerplate)
- `@supabase/supabase-js` ^2.39.0 - Core Supabase client
- `@supabase/ssr` ^0.1.0 - Next.js server-side auth integration
- Supabase PostgreSQL - App database (user profiles, preferences, metadata)
- Drizzle ORM - Type-safe database operations

**AI & Chat Infrastructure:**
- Dify Cloud - Complete AI orchestration (knowledge base + agentic workflows + chat history)
- `dify-client` - Official Dify SDK for API integration
- Assistant-UI - Composable React chat interface components
- Backend proxy pattern for Dify API security

**Development & Quality:**
- Vitest + React Testing Library - Unit tests
- Playwright - Integration/E2E tests
- ESLint 8 - Code linting
- Prettier - Code formatting
- Pino.js - Logging
- Sentry - Error monitoring

**Hosting & Infrastructure:**
- Vercel - Production hosting (Next.js optimized)
- GitHub - Source control
- Docker - Development environment consistency
- PostgreSQL (via Supabase) - Production database

**Forms & Validation:**
- React Hook Form - Form state management
- Zod - Runtime type validation and schema definition

**Key Architecture Decision:**
- Dify handles ALL AI complexity (knowledge base, workflows, chat memory)
- Supabase handles Auth + minimal app data only
- No vector DB work needed in v1 (Dify manages embeddings)

### Existing Codebase Structure

**Greenfield Project - Starting from SaaS Boilerplate**

The project begins with the [SaaS Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) as foundational scaffolding. Understanding its structure is critical since we're modifying it, not building from scratch.

**Boilerplate Directory Structure:**
```
app/                    # Next.js 14 app directory (routing)
├── [locale]/          # Internationalization support
├── api/               # API routes
└── (auth)/            # Auth-related pages (currently Clerk-based)

components/            # Reusable UI components
├── ui/               # Shadcn UI primitives
└── ...               # Custom components

features/             # Feature-specific code modules
libs/                 # Third-party integrations config
locales/              # i18n translation files
models/               # Database models (Drizzle schemas)
styles/               # Global styles
templates/            # Page templates
types/                # TypeScript type definitions
utils/                # Utility functions

tests/
├── e2e/              # Playwright end-to-end tests
└── integration/      # Integration tests
```

**Key Files We'll Modify:**
- `middleware.ts` - Currently uses Clerk auth, needs Supabase session handling
- `app/api/**/*` - API routes using Clerk's `auth()`, need Supabase SSR client
- `components/**/*` - Components using `useUser()` hook, need Supabase equivalent
- `models/**/*` - Drizzle schemas (extend for user preferences, app metadata)
- `libs/` - Add Supabase client configuration

**What We're Keeping:**
- App directory structure (Next.js 14 routing)
- Shadcn UI components
- Tailwind CSS configuration
- Testing setup (Vitest + Playwright)
- i18n infrastructure
- Drizzle ORM setup

**What We're Replacing:**
- Clerk authentication → Supabase Auth (15-20 files impacted)
- Auth middleware logic
- Session management hooks

**What We're Adding:**
- `lib/supabase/` - Supabase client utilities (client.ts, server.ts)
- `app/api/chat/` - Dify proxy API routes
- `app/[locale]/(chat)/` - Chat interface pages
- `components/chat/` - Assistant-UI integration
- Dify configuration and integration layer

**Conventions to Adopt from Boilerplate:**
- TypeScript strict mode
- ESLint + Prettier formatting (per `.eslintrc.json`, `.prettierrc`)
- Component naming: PascalCase for components, camelCase for utilities
- Test file naming: `*.test.ts` or `*.test.tsx`
- Import aliases: `@/` for root-level imports

---

## The Change

### Problem Statement

Health coaches provide valuable expertise through 1-on-1 sessions, but this model limits reach and requires synchronous availability. Many people need health coaching guidance but cannot access or afford traditional coaching services. The health coach's expertise is currently locked in their individual practice with no way to scale their knowledge and impact.

**Core challenges:**
- Health coach can only serve clients during live sessions (time-bound)
- Knowledge and proven methodologies not accessible 24/7
- No digital offering to complement or scale the practice
- Potential clients seeking health guidance have limited access options
- Coach's specialized workflows and frameworks remain manual

### Proposed Solution

Build **HealthCompanion** - an AI-powered health coaching SaaS application that digitizes the health coach's expertise into an always-available, interactive platform.

**Solution approach:**
1. **AI Chat Interface**: Users interact with an AI health coach powered by the actual coach's knowledge base and methodologies
2. **Knowledge Base**: Capture health coach's expertise, frameworks, and guidance in Dify's knowledge system
3. **Guided Workflows**: Specific health coaching workflows (goal setting, habit tracking, nutrition planning, etc.) that users can initiate through chat
4. **SaaS Model**: Subscription-based access, allowing the coach to scale impact beyond 1-on-1 sessions

**Technical implementation:**
- Start with proven SaaS boilerplate (faster to market)
- Replace Clerk auth with Supabase for unified backend
- Use Dify Cloud to handle all AI complexity (knowledge base, chat, workflows)
- Integrate Assistant-UI for polished chat experience
- Focus on MVP: chat + knowledge base + basic workflows

### Scope

**In Scope:**

✅ **Core MVP Features:**
- User authentication (signup, login, session management via Supabase)
- AI-powered chat interface with health coach persona
- Knowledge base populated with health coach's expertise (managed in Dify)
- User-triggered workflows for common health coaching activities
- Chat history and conversation continuity
- Responsive web application (desktop, tablet, mobile browsers)

✅ **Technical Infrastructure:**
- SaaS boilerplate setup and Clerk → Supabase migration
- Supabase Auth integration with Next.js
- Dify Cloud setup (agent, knowledge base, workflows)
- Backend proxy for secure Dify API access
- Assistant-UI chat component integration
- Basic user profiles and preferences (stored in Supabase DB)
- Development environment with Docker
- Deployment pipeline to Vercel

✅ **5 User Stories:**
1. Replace Clerk authentication with Supabase Auth
2. Create backend proxy for Dify integration
3. Build chat interface with Assistant-UI
4. Set up Dify knowledge base with health coach content
5. Implement user-triggered workflows

**Out of Scope:**

❌ **Future Features (Post-MVP):**
- Journal/diary functionality
- Mobile native apps (iOS, Android)
- Progress tracking and analytics dashboards
- Goal setting and habit tracking modules
- Nutritional logging features
- Integration with wearables or health devices
- Community features or peer connections
- Payment processing and subscription management (beyond basic setup)
- Advanced personalization and user profiling
- Multi-language support (English only for MVP)
- Admin dashboard for the health coach
- Content management system for updating knowledge base

❌ **Technical Items Deferred:**
- Custom RAG implementation with Supabase vector DB (Dify handles this)
- Advanced caching or performance optimization
- Multi-tenancy or white-labeling
- Advanced analytics and monitoring beyond basic Sentry
- Custom AI model training or fine-tuning

---

## Implementation Details

### Source Tree Changes

**Files to CREATE:**

```
lib/supabase/
├── client.ts                    - Browser-side Supabase client
├── server.ts                    - Server-side Supabase client (SSR)
└── middleware.ts                - Session refresh utilities

app/api/chat/
├── route.ts                     - Main chat endpoint (Dify proxy)
├── sessions/route.ts            - Chat session management
└── workflows/route.ts           - Workflow trigger endpoints

app/[locale]/(chat)/
├── page.tsx                     - Main chat interface page
├── layout.tsx                   - Chat layout wrapper
└── components/
    ├── ChatInterface.tsx        - Assistant-UI integration
    ├── WorkflowMenu.tsx         - Workflow trigger UI
    └── ChatHeader.tsx           - Chat page header

components/chat/
├── ChatProvider.tsx             - Chat context provider
├── MessageList.tsx              - Message display component
├── ChatInput.tsx                - User input component
└── WorkflowButton.tsx           - Individual workflow trigger

models/schema/
├── user-preferences.ts          - Drizzle schema for user prefs
└── chat-metadata.ts             - Drizzle schema for chat data (if needed)

lib/dify/
├── client.ts                    - Dify API client wrapper
├── types.ts                     - TypeScript types for Dify
└── config.ts                    - Dify configuration

.env.local.example               - Environment variables template
docker-compose.yml               - Docker setup for dev environment
```

**Files to MODIFY:**

```
middleware.ts                    - REPLACE Clerk auth → Supabase session validation
  • Remove: clerkMiddleware()
  • Add: Supabase session refresh and auth checks
  • Protect routes: /chat, /api/chat/*

app/api/auth/[...nextauth]/route.ts  - REMOVE (Clerk-specific)

app/[locale]/(auth)/
├── sign-in/[[...sign-in]]/page.tsx  - REPLACE Clerk SignIn → Supabase auth UI
├── sign-up/[[...sign-up]]/page.tsx  - REPLACE Clerk SignUp → Supabase auth UI
└── sign-out/page.tsx                - REPLACE Clerk signOut → Supabase signOut

components/
├── UserButton.tsx               - MODIFY to use Supabase user data
├── ProtectedRoute.tsx           - MODIFY to check Supabase session
└── Navigation.tsx               - MODIFY user menu with Supabase data

libs/
└── auth.ts                      - REPLACE Clerk utilities → Supabase utilities

package.json                     - ADD dependencies:
  • @supabase/supabase-js ^2.39.0
  • @supabase/ssr ^0.1.0
  • dify-client (latest)
  • @assistant-ui/react (latest)
  • REMOVE: @clerk/nextjs

.env.local                       - ADD Supabase credentials
  • NEXT_PUBLIC_SUPABASE_URL
  • NEXT_PUBLIC_SUPABASE_ANON_KEY
  • SUPABASE_SERVICE_ROLE_KEY
  • DIFY_API_KEY
  • DIFY_API_URL
  • REMOVE: Clerk keys

drizzle.config.ts               - UPDATE connection to use Supabase DB URL
```

**Estimated Impact:**
- **Create:** ~20 new files
- **Modify:** ~15-20 existing files (Clerk removal)
- **Delete:** ~5 Clerk-specific files

### Technical Approach

**1. Authentication Migration (Clerk → Supabase)**

Use `@supabase/ssr` package for Next.js 14 App Router integration:

**Server-side (API routes, Server Components):**
```typescript
// lib/supabase/server.ts
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

**Client-side (Client Components):**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Middleware (session refresh):**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(...)
  await supabase.auth.getUser() // Refreshes session

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**2. Dify Integration via Backend Proxy**

Backend proxy pattern ensures API keys stay server-side and sessions are validated:

```typescript
// app/api/chat/route.ts
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

**3. Assistant-UI Integration**

Use Assistant-UI's React components with custom runtime connecting to our Dify proxy:

```typescript
// components/chat/ChatInterface.tsx
import { useChat } from '@assistant-ui/react'
import { Thread } from '@assistant-ui/react'

export function ChatInterface() {
  const { messages, sendMessage } = useChat({
    api: '/api/chat', // Our Dify proxy endpoint
  })

  return (
    <div className="h-screen flex flex-col">
      <Thread />
    </div>
  )
}
```

**4. Database Schema (Drizzle)**

Minimal app data stored in Supabase Postgres:

```typescript
// models/schema/user-preferences.ts
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  theme: text('theme').default('light'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  preferences: jsonb('preferences'), // Flexible JSON for future needs
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

**Note:** Chat history, messages, and conversations are stored in Dify Cloud, not our database.

### Existing Patterns to Follow

**From SaaS Boilerplate:**

**Code Organization:**
- Feature-based modules in `features/` directory
- Shared UI components in `components/`
- Business logic separated from presentation
- API routes follow RESTful patterns

**TypeScript Patterns:**
- Strict mode enabled
- Explicit return types for functions
- Interface over type for object shapes
- Zod schemas for runtime validation

**Component Patterns:**
- Server Components by default (Next.js 14 App Router)
- Client Components only when needed ('use client' directive)
- Props interfaces named `[ComponentName]Props`
- Async Server Components for data fetching

**Error Handling:**
- Try/catch blocks in async functions
- User-friendly error messages
- Error boundaries for React component errors
- API routes return proper HTTP status codes

**Styling:**
- Tailwind CSS utility classes
- Shadcn UI for complex components
- CSS modules for component-specific styles
- Responsive design: mobile-first approach

**Testing:**
- Unit tests for utilities and business logic
- Integration tests for API routes
- E2E tests for critical user flows
- Test files colocated with source: `*.test.ts`

**Import Organization:**
- External packages first
- Internal absolute imports (`@/...`)
- Relative imports last
- Grouped by: React, Next.js, third-party, internal

### Integration Points

**1. Supabase Auth ↔ Next.js Application**
- **Server Components**: Use `createClient()` from `lib/supabase/server.ts`
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`
- **Middleware**: Session refresh on every request
- **Auth Pages**: Supabase Auth UI components for login/signup

**2. Next.js API Routes ↔ Dify Cloud**
- **Endpoint**: `/api/chat` proxies to Dify's chat API
- **Authentication**: Validates Supabase session before calling Dify
- **User Identification**: Maps Supabase `user.id` to Dify's user field
- **Streaming**: Maintains SSE stream from Dify to client
- **Error Handling**: Catches Dify API errors, returns appropriate HTTP codes

**3. React UI ↔ Assistant-UI Library**
- **Chat Component**: `<Thread>` component from `@assistant-ui/react`
- **API Integration**: Points to `/api/chat` endpoint
- **Message Handling**: Assistant-UI manages message state
- **Streaming**: Library handles SSE parsing and UI updates

**4. Dify Cloud ↔ Knowledge Base**
- **Content Upload**: Health coach expertise uploaded to Dify's knowledge base UI
- **Embedding**: Dify automatically chunks and embeds content
- **Retrieval**: Dify's RAG pipeline retrieves relevant context for queries
- **No Code Needed**: Managed entirely through Dify dashboard

**5. Dify Cloud ↔ Workflows**
- **Workflow Definition**: Created in Dify's workflow builder UI
- **Trigger Mechanism**: API calls from `/api/chat/workflows` endpoint
- **Parameters**: User selections passed as workflow inputs
- **Execution**: Dify orchestrates workflow steps and returns results

**6. Application ↔ Supabase Database**
- **ORM**: Drizzle ORM for type-safe queries
- **Connection**: Direct PostgreSQL connection via Supabase
- **Migrations**: Drizzle migrations for schema changes
- **Data Access**: Server Components and API routes only (no client-side DB access)

**7. Docker ↔ Development Environment**
- **Database**: Local PostgreSQL container (mirrors Supabase structure)
- **Application**: Next.js dev server runs on host (hot reload)
- **Volumes**: Persist database data across container restarts

---

## Development Context

### Relevant Existing Code

**SaaS Boilerplate Reference Files:**

Since we're replacing Clerk with Supabase, developers should review these boilerplate files to understand current auth implementation:

- `middleware.ts:1-50` - Current Clerk middleware pattern (will be replaced)
- `libs/auth.ts` - Clerk utility functions (replace with Supabase equivalents)
- `app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx` - Clerk SignIn component pattern
- `app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx` - Clerk SignUp component pattern
- `components/UserButton.tsx` - How user data is displayed (adapt for Supabase)

**Testing Patterns:**
- `tests/e2e/auth.spec.ts` - E2E auth flow tests (update for Supabase)
- `tests/integration/api.test.ts` - API integration test patterns

**No existing chat or AI code** - This is net-new functionality.

### Dependencies

**Framework/Libraries:**

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "dify-client": "latest",
    "@assistant-ui/react": "latest",
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0",
    "@tailwindcss/typography": "^0.5.10",
    "tailwindcss": "^3.4.0",
    "shadcn-ui": "latest",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "pino": "^8.16.0",
    "@sentry/nextjs": "^7.90.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "playwright": "^1.40.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "drizzle-kit": "^0.20.0"
  }
}
```

**Remove:**
- `@clerk/nextjs` and all Clerk-related packages

### Internal Modules

**Created for this project:**

```typescript
// Supabase integration
import { createClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'

// Dify integration
import { DifyClient } from '@/lib/dify/client'
import type { ChatMessage, Workflow } from '@/lib/dify/types'

// Chat components
import { ChatInterface } from '@/components/chat/ChatInterface'
import { ChatProvider } from '@/components/chat/ChatProvider'

// Database schemas
import { userPreferences } from '@/models/schema/user-preferences'
```

**Existing from boilerplate:**

```typescript
// UI components (Shadcn)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

// Utilities
import { cn } from '@/utils/cn' // Tailwind class merger
```

### Configuration Changes

**Environment Variables (.env.local):**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (server-side only)

# Dify
DIFY_API_KEY=app-xxxxxxxxxxxxx
DIFY_API_URL=https://api.dify.ai/v1

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Sentry (already in boilerplate)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**docker-compose.yml (NEW):**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: healthcompanion_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**drizzle.config.ts (UPDATE):**

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './models/schema/**/*.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
```

**package.json scripts (ADD):**

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

### Existing Conventions (Brownfield)

**Conventions from SaaS Boilerplate (to follow):**

**Code Style:**
- TypeScript strict mode enabled
- Single quotes for strings
- Semicolons required
- 2-space indentation
- Line length: 100 characters (Prettier default)
- Trailing commas in multiline

**File Naming:**
- Components: PascalCase (`ChatInterface.tsx`)
- Utilities: camelCase (`formatMessage.ts`)
- Constants: SCREAMING_SNAKE_CASE files (`API_ROUTES.ts`)
- Test files: `*.test.ts` or `*.test.tsx`

**Component Structure:**
```typescript
'use client' // If client component

import statements...

interface ComponentProps {
  // Props definition
}

export function ComponentName({ props }: ComponentProps) {
  // Component implementation
}
```

**Error Handling:**
- API routes return JSON errors: `{ error: 'Message', code: 'ERROR_CODE' }`
- Use Zod for input validation
- Catch errors at component boundaries
- Log errors with Pino (server) or Sentry (client)

**Logging:**
```typescript
import logger from '@/lib/logger'

logger.info('User action', { userId, action })
logger.error('Operation failed', { error, context })
```

### Test Framework & Standards

**Testing Stack:**
- **Vitest** - Unit tests (React Testing Library)
- **Playwright** - E2E tests
- **Percy** - Visual regression (optional)

**Test Organization:**
```
tests/
├── unit/
│   └── lib/supabase/client.test.ts
├── integration/
│   └── api/chat.test.ts
└── e2e/
    ├── auth.spec.ts
    └── chat.spec.ts
```

**Naming Convention:**
- Test files: `*.test.ts` (unit/integration) or `*.spec.ts` (E2E)
- Test suites: `describe('ComponentName', () => {})`
- Test cases: `it('should do something', () => {})`

**Coverage Requirements:**
- Target: 80% code coverage for business logic
- Critical paths: 100% coverage (auth, API proxy)
- UI components: Focus on integration over unit tests

**Test Patterns:**

```typescript
// Unit test example
import { describe, it, expect } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('Supabase Client', () => {
  it('should create client with correct config', () => {
    const client = createClient()
    expect(client).toBeDefined()
  })
})

// E2E test example
import { test, expect } from '@playwright/test'

test('user can send chat message', async ({ page }) => {
  await page.goto('/chat')
  await page.fill('[data-testid="chat-input"]', 'Hello')
  await page.click('[data-testid="send-button"]')
  await expect(page.locator('[data-testid="chat-message"]')).toContainText('Hello')
})
```

**Mocking:**
- Mock Supabase client in tests: `vi.mock('@/lib/supabase/client')`
- Mock Dify API calls: Use MSW (Mock Service Worker)
- Mock environment variables: Test setup file

---

## Implementation Stack

**Complete Technology Stack with Exact Versions:**

**Frontend:**
- Next.js 14.x - Full-stack React framework
- React 18.2.0 - UI library
- TypeScript 5.3.0 - Type-safe JavaScript
- Tailwind CSS 3.4.0 - Utility-first CSS
- Shadcn UI (latest) - Pre-built component library
- Assistant-UI (latest) - AI chat components

**Backend & API:**
- Next.js API Routes - Server-side endpoints
- Node.js 20.x (LTS) - Runtime
- Dify Cloud - AI orchestration platform
- dify-client (latest) - Official Dify SDK

**Authentication & Database:**
- Supabase Auth - User authentication and session management
- @supabase/supabase-js ^2.39.0 - Supabase JavaScript client
- @supabase/ssr ^0.1.0 - Next.js SSR integration
- Supabase PostgreSQL - Managed PostgreSQL database
- Drizzle ORM ^0.29.0 - Type-safe database toolkit
- drizzle-kit ^0.20.0 - Schema migrations

**Forms & Validation:**
- React Hook Form ^7.48.0 - Form state management
- Zod ^3.22.0 - Runtime schema validation

**Development Tools:**
- Docker - Development environment
- ESLint ^8.55.0 - Code linting
- Prettier ^3.1.0 - Code formatting
- Husky - Git hooks

**Testing:**
- Vitest ^1.0.0 - Unit test framework
- React Testing Library ^14.1.0 - React component testing
- Playwright ^1.40.0 - E2E testing
- MSW - API mocking

**Logging & Monitoring:**
- Pino ^8.16.0 - Structured logging
- Sentry ^7.90.0 - Error tracking and monitoring

**Deployment & Infrastructure:**
- Vercel - Production hosting and CI/CD
- GitHub - Version control
- Supabase Cloud - Managed PostgreSQL
- Dify Cloud - AI service platform

---

## Technical Details

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
  .limit(1)

// Update preferences
await db
  .update(userPreferences)
  .set({ theme: 'dark', updatedAt: new Date() })
  .where(eq(userPreferences.userId, user.id))
```

**5. Error Handling Strategy**

**API Route Errors:**
```typescript
export async function POST(request: Request) {
  try {
    // Validate session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    // Call Dify
    const response = await difyClient.chat(...)

    return Response.json(response)

  } catch (error) {
    logger.error('Chat API error', { error, userId: user?.id })

    // Dify API errors
    if (error.response?.status === 429) {
      return Response.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
        { status: 429 }
      )
    }

    // Generic error
    return Response.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
```

**Client Error Handling:**
```typescript
// In React components
try {
  const response = await fetch('/api/chat', { method: 'POST', body: ... })

  if (!response.ok) {
    const error = await response.json()
    toast.error(error.message || 'Something went wrong')
    return
  }

  // Handle success
} catch (error) {
  logger.error('Network error', error)
  toast.error('Network error. Please check your connection.')
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

## Development Setup

**Prerequisites:**
- Node.js 20.x LTS
- Docker Desktop (for local database)
- Git
- Supabase account (free tier)
- Dify Cloud account (free tier)

**Initial Setup:**

```bash
# 1. Clone the SaaS boilerplate
git clone https://github.com/ixartz/SaaS-Boilerplate.git healthcompanion
cd healthcompanion

# 2. Remove Clerk and install Supabase
npm uninstall @clerk/nextjs
npm install @supabase/supabase-js@^2.39.0 @supabase/ssr@^0.1.0

# 3. Install new dependencies
npm install dify-client @assistant-ui/react

# 4. Set up local database
docker-compose up -d

# 5. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Dify credentials

# 6. Run database migrations
npm run db:generate
npm run db:migrate

# 7. Start development server
npm run dev
```

**Supabase Setup:**

1. Create new project on Supabase.com
2. Copy Project URL and Anon Key to `.env.local`
3. Enable Email Auth in Supabase Dashboard → Authentication → Providers
4. Configure email templates (optional)
5. Get database connection string for Drizzle

**Dify Setup:**

1. Create account on Dify.ai
2. Create new "Chat App" application
3. Copy API key to `.env.local`
4. Set up knowledge base (upload health coach content)
5. Configure agent persona and prompts
6. Create workflows in Dify workflow builder

**Development Commands:**

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:e2e     # Run Playwright tests
npm run db:studio    # Open Drizzle Studio (DB GUI)
docker-compose up    # Start local Postgres
docker-compose down  # Stop local Postgres
```

---

## Implementation Guide

### Setup Steps

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

### Implementation Steps

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

### Testing Strategy

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

### Acceptance Criteria

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

## Developer Resources

### File Paths Reference

**Complete list of all files involved in this implementation:**

**New Files (to CREATE):**
```
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
lib/dify/client.ts
lib/dify/types.ts
lib/dify/config.ts
app/api/chat/route.ts
app/api/chat/sessions/route.ts
app/api/chat/workflows/route.ts
app/[locale]/(chat)/page.tsx
app/[locale]/(chat)/layout.tsx
app/[locale]/(chat)/components/ChatInterface.tsx
app/[locale]/(chat)/components/WorkflowMenu.tsx
app/[locale]/(chat)/components/ChatHeader.tsx
components/chat/ChatProvider.tsx
components/chat/MessageList.tsx
components/chat/ChatInput.tsx
components/chat/WorkflowButton.tsx
models/schema/user-preferences.ts
models/schema/chat-metadata.ts
docker-compose.yml
.env.local.example
tests/unit/lib/supabase/client.test.ts
tests/unit/lib/dify/client.test.ts
tests/integration/api/chat.test.ts
tests/e2e/chat.spec.ts
tests/e2e/workflows.spec.ts
```

**Modified Files (to UPDATE):**
```
middleware.ts
package.json
.env.local
drizzle.config.ts
app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx
app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx
app/[locale]/(auth)/sign-out/page.tsx
components/UserButton.tsx
components/ProtectedRoute.tsx
components/Navigation.tsx
libs/auth.ts
tests/e2e/auth.spec.ts
```

**Files to DELETE:**
```
app/api/auth/[...nextauth]/route.ts (Clerk-specific)
libs/clerk.ts (if exists)
```

### Key Code Locations

**Authentication:**
- Supabase client creation: `lib/supabase/client.ts:5`
- Supabase server client: `lib/supabase/server.ts:7`
- Session refresh middleware: `middleware.ts:10`
- Sign-in page: `app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx:15`
- User session hook: `lib/supabase/client.ts:20` (client-side)

**Chat & AI:**
- Chat API proxy: `app/api/chat/route.ts:10`
- Dify client wrapper: `lib/dify/client.ts:15`
- Chat interface component: `app/[locale]/(chat)/page.tsx:20`
- Assistant-UI integration: `app/[locale]/(chat)/components/ChatInterface.tsx:25`

**Workflows:**
- Workflow API endpoint: `app/api/chat/workflows/route.ts:10`
- Workflow menu UI: `app/[locale]/(chat)/components/WorkflowMenu.tsx:15`

**Database:**
- User preferences schema: `models/schema/user-preferences.ts:5`
- Drizzle config: `drizzle.config.ts:3`

**Configuration:**
- Environment variables: `.env.local`
- Docker setup: `docker-compose.yml`

### Testing Locations

**Unit Tests:**
```
tests/unit/
├── lib/
│   ├── supabase/
│   │   ├── client.test.ts        - Supabase client creation
│   │   └── server.test.ts        - Supabase SSR client
│   └── dify/
│       └── client.test.ts        - Dify API wrapper
└── utils/
    └── validation.test.ts        - Zod schemas
```

**Integration Tests:**
```
tests/integration/
├── api/
│   ├── chat.test.ts              - Chat API proxy
│   ├── workflows.test.ts         - Workflow API
│   └── auth.test.ts              - Auth endpoints
└── db/
    └── user-preferences.test.ts  - Database operations
```

**E2E Tests:**
```
tests/e2e/
├── auth.spec.ts                  - Sign up, sign in, sign out flows
├── chat.spec.ts                  - Complete chat interaction
├── workflows.spec.ts             - Workflow trigger and execution
└── responsive.spec.ts            - Mobile/tablet/desktop layouts
```

**Test Commands:**
```bash
npm test                          # Run all unit tests
npm run test:integration          # Run integration tests
npm run test:e2e                  # Run E2E tests
npm run test:coverage             # Generate coverage report
npm run test:watch                # Watch mode for development
```

### Documentation to Update

**Technical Documentation:**
- [ ] README.md - Update setup instructions for Supabase/Dify
- [ ] CONTRIBUTING.md - Add authentication flow documentation
- [ ] docs/ARCHITECTURE.md - Document Dify proxy pattern
- [ ] docs/API.md - Document /api/chat and /api/chat/workflows endpoints
- [ ] docs/DEPLOYMENT.md - Add Vercel + Supabase deployment guide

**User Documentation:**
- [ ] docs/USER_GUIDE.md - How to use chat interface and workflows
- [ ] docs/FAQ.md - Common questions about the health coach AI

**Developer Documentation:**
- [ ] docs/DEVELOPMENT.md - Local setup with Docker
- [ ] docs/TESTING.md - Testing strategy and examples
- [ ] docs/ENVIRONMENT.md - Environment variables reference

**Code Documentation:**
- [ ] Add JSDoc comments to all public functions
- [ ] Document Dify client wrapper API
- [ ] Document Supabase client utilities

**Changelog:**
- [ ] CHANGELOG.md - Document all changes for v1.0.0 release

---

## UX/UI Considerations

**This MVP has significant UX/UI impact** - it's a chat application!

**UI Components Affected:**

**CREATE:**
- Chat interface page (full-screen chat layout)
- Message list component (scrollable message history)
- Chat input field (text input with send button)
- Workflow menu (button grid or dropdown)
- Loading indicators (typing animation, skeleton screens)
- Error toast/banner (network errors, API failures)

**MODIFY:**
- Navigation bar (add "Chat" link)
- User profile menu (display user info from Supabase)
- Landing page (add CTA to start chatting)

**UX Flow Changes:**

**New User Journey:**
```
Landing Page → Sign Up → Email Verification
  → Onboarding (optional intro) → Chat Interface
  → First Message Prompt (suggested questions)
```

**Returning User Journey:**
```
Landing Page → Sign In → Chat Interface
  → Load Previous Conversations → Continue Chatting
```

**Chat Interaction Flow:**
```
User types message → Clicks send
  → Loading indicator appears
  → AI response streams in (word-by-word)
  → Message appears in history
  → User can send follow-up
```

**Workflow Trigger Flow:**
```
User clicks "Workflows" button
  → Menu/modal opens with workflow options
  → User selects workflow (e.g., "Goal Setting")
  → Workflow executes (may prompt for inputs)
  → Results display in chat as formatted message
```

**Visual/Interaction Patterns:**

**Design System:**
- Use existing Shadcn UI components (Button, Input, Card, etc.)
- Maintain Tailwind CSS utility-first approach
- Follow boilerplate's existing color palette
- Consistent spacing with existing pages (Tailwind spacing scale)

**Chat-Specific Patterns:**
- User messages: Right-aligned, blue background
- AI messages: Left-aligned, gray background
- Streaming: Show cursor/typing animation during AI response
- Timestamps: Display for each message (subtle, small text)
- Avatar: User avatar on right, AI avatar on left

**Responsive Design:**
- **Mobile** (< 768px): Full-screen chat, hamburger menu, bottom input
- **Tablet** (768-1024px): Sidebar for navigation, main chat area
- **Desktop** (> 1024px): Sidebar + chat + optional info panel

**Accessibility:**

**Keyboard Navigation:**
- Tab through chat input, send button, workflow buttons
- Enter to send message
- Escape to close workflow menu/modals

**Screen Reader:**
- ARIA labels on all interactive elements
- Announce new AI messages as they arrive
- Describe workflow buttons clearly

**Visual Accessibility:**
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators on all interactive elements
- Text resizable up to 200% without breaking layout

**ARIA Attributes:**
```html
<div role="log" aria-live="polite" aria-label="Chat messages">
  <!-- Messages appear here -->
</div>
<input aria-label="Type your message" />
<button aria-label="Send message">Send</button>
```

**User Feedback:**

**Loading States:**
- Skeleton screen while initial chat loads
- Typing indicator while AI generates response
- Button spinner during workflow execution

**Error Messages:**
- Network error: "Connection lost. Please check your internet."
- API error: "Something went wrong. Please try again."
- Validation error: "Please enter a message before sending."

**Success Confirmations:**
- Workflow completed: "Goal setting complete! See results below."
- Account created: "Welcome! Your account is ready."

**Progress Indicators:**
- Multi-step workflows show step count (Step 1 of 3)
- File upload progress bar (if adding file uploads later)

**Empty States:**
- New chat: "Welcome! Ask me anything about health and wellness."
- No conversation history: "Start a new conversation to see it here."

---

## Testing Approach

**Comprehensive Testing Strategy:**

**1. Unit Tests (Vitest + React Testing Library)**

**Coverage Target:** 80% for business logic

**Test Scope:**
- Utility functions (formatters, validators)
- Supabase client utilities
- Dify client wrapper
- React components (isolated)
- Drizzle schema definitions

**Mock Strategy:**
- Mock Supabase client: `vi.mock('@/lib/supabase/client')`
- Mock Dify client: `vi.mock('@/lib/dify/client')`
- Mock Next.js router: `vi.mock('next/navigation')`

**Example Tests:**
```typescript
// Dify client test
describe('DifyClient', () => {
  it('should send chat message with correct format', () => {
    const client = new DifyClient('test-key')
    const message = client.formatMessage('Hello', 'user-123')
    expect(message).toMatchObject({
      query: 'Hello',
      user: 'user-123',
      response_mode: 'streaming'
    })
  })
})

// Component test
describe('ChatInput', () => {
  it('should call onSend with message when submitted', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.submit(screen.getByRole('form'))

    expect(onSend).toHaveBeenCalledWith('Test message')
  })
})
```

**2. Integration Tests (Vitest + MSW)**

**Coverage Target:** All API routes and critical integrations

**Test Scope:**
- API routes (/api/chat, /api/chat/workflows)
- Database operations (Drizzle queries)
- Authentication flow (Supabase integration)
- External API calls (Dify, mocked)

**Mock Strategy:**
- Use MSW (Mock Service Worker) for API mocking
- Mock Supabase Auth responses
- Mock Dify API responses

**Example Tests:**
```typescript
// API route test
describe('POST /api/chat', () => {
  beforeAll(() => {
    server.listen() // MSW server
  })

  it('returns 401 without authentication', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' })
      })
    )
    expect(response.status).toBe(401)
  })
})
```

**3. E2E Tests (Playwright)**

**Coverage Target:** All critical user flows

**Test Scope:**
- Complete authentication flows
- Chat interaction flows
- Workflow execution flows
- Responsive design verification
- Error handling scenarios

**Test Environments:**
- Desktop (Chrome, Firefox, Safari)
- Mobile (iPhone, Android emulators)
- Tablet (iPad simulator)

**Example Tests:**
```typescript
test('user can complete full chat flow', async ({ page }) => {
  // 1. Sign in
  await page.goto('/sign-in')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'Test123!')
  await page.click('button[type="submit"]')

  // 2. Navigate to chat
  await expect(page).toHaveURL('/chat')

  // 3. Send message
  const input = page.locator('[data-testid="chat-input"]')
  await input.fill('What are good protein sources?')
  await page.click('[data-testid="send-button"]')

  // 4. Wait for streaming response
  const aiMessage = page.locator('[data-testid="ai-message"]').last()
  await expect(aiMessage).toBeVisible({ timeout: 10000 })
  await expect(aiMessage).toContainText(/protein/)

  // 5. Verify message in history
  const messages = page.locator('[data-testid="message"]')
  await expect(messages).toHaveCount(2) // User + AI
})

test('workflow trigger works correctly', async ({ page }) => {
  await authenticateUser(page)
  await page.goto('/chat')

  // Open workflow menu
  await page.click('[data-testid="workflows-button"]')

  // Select workflow
  await page.click('[data-testid="workflow-goal-setting"]')

  // Verify workflow execution
  await expect(page.locator('[data-testid="workflow-result"]'))
    .toBeVisible({ timeout: 15000 })
})
```

**4. Visual Regression Tests (Percy - Optional)**

**Test Scope:**
- Chat interface layouts
- Workflow modals
- Auth pages
- Responsive breakpoints

**5. Performance Tests**

**Metrics:**
- Initial page load: < 3 seconds
- Time to interactive: < 2 seconds
- Chat response start: < 1 second
- Streaming latency: < 100ms per chunk

**Tools:**
- Lighthouse CI in GitHub Actions
- Core Web Vitals monitoring
- Custom performance marks in code

**6. Security Tests**

**Test Scope:**
- API authentication checks
- SQL injection prevention (Drizzle)
- XSS prevention (React escapes by default)
- CSRF protection (Supabase tokens)
- Rate limiting verification

**7. Accessibility Tests**

**Tools:**
- axe-core (automated)
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)

**CI/CD Integration:**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Deployment Strategy

### Deployment Steps

**Production Deployment to Vercel:**

**1. Initial Setup (One-time):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

**2. Configure Environment Variables in Vercel:**
Via Vercel Dashboard or CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add DIFY_API_KEY production
vercel env add DIFY_API_URL production
vercel env add DATABASE_URL production
vercel env add SENTRY_DSN production
```

**3. Database Setup (Supabase):**
- Ensure Supabase project is in production mode
- Run migrations: `npm run db:migrate` against production DB
- Verify database connection from local

**4. Dify Configuration:**
- Ensure knowledge base is uploaded and indexed
- Test workflows in Dify playground
- Configure production API key

**5. Deploy to Vercel:**

**Option A: Automatic (via GitHub):**
```bash
git push origin main
# Vercel auto-deploys from main branch
```

**Option B: Manual (via CLI):**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

**6. Post-Deployment Verification:**
- [ ] Visit production URL, verify site loads
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Send test chat message
- [ ] Trigger test workflow
- [ ] Check Sentry for errors
- [ ] Verify analytics/monitoring active

**7. DNS Configuration (if custom domain):**
```bash
vercel domains add healthcompanion.com
vercel domains verify healthcompanion.com
# Update DNS records as instructed
```

### Rollback Plan

**If deployment fails or critical issues discovered:**

**Immediate Rollback (Vercel):**

**Option 1: Via Vercel Dashboard:**
1. Go to Vercel Dashboard → Project → Deployments
2. Find previous stable deployment
3. Click three dots → "Promote to Production"

**Option 2: Via CLI:**
```bash
# List recent deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

**Database Rollback (if needed):**

**If migrations caused issues:**
```bash
# Connect to production DB
psql $DATABASE_URL

# Rollback last migration
# (Drizzle doesn't have built-in rollback, manual SQL needed)

# Or restore from Supabase snapshot
# Via Supabase Dashboard → Database → Backups
```

**Dify Rollback:**
- Revert to previous knowledge base version (via Dify dashboard)
- Restore previous workflow configurations
- Rollback agent prompts/settings

**Communication Plan:**
- Post status update on status page (if using one)
- Notify users via email (if critical)
- Update team in Slack/Discord

**Investigation:**
- Check Sentry for error patterns
- Review Vercel deployment logs
- Analyze Supabase logs
- Check Dify API status

### Monitoring

**Error Tracking (Sentry):**

**Setup:**
```typescript
// Already configured in boilerplate
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

**Monitored Events:**
- API errors (500, 429, etc.)
- Authentication failures
- Dify API errors
- Database errors
- Client-side exceptions

**Alerts:**
- Email/Slack notification on critical errors
- Threshold alerts (>10 errors in 5 minutes)

**Application Performance (Vercel Analytics):**

**Metrics Tracked:**
- Page load times
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Core Web Vitals scores

**Dashboards:**
- Vercel Analytics dashboard (built-in)
- Custom metrics in Sentry Performance

**Infrastructure Monitoring:**

**Supabase:**
- Database performance (via Supabase dashboard)
- Connection pool usage
- Query performance
- Storage usage

**Dify:**
- API request volume
- Response times
- Error rates
- Knowledge base query performance

**Vercel:**
- Function execution times
- Edge network performance
- Bandwidth usage
- Build times

**Business Metrics:**

**Track via Custom Events:**
```typescript
// Analytics events to track
analytics.track('chat_message_sent', { userId, messageLength })
analytics.track('workflow_triggered', { userId, workflowId })
analytics.track('user_signed_up', { userId })
analytics.track('conversation_started', { userId })
```

**KPIs to Monitor:**
- Daily/Monthly active users
- Chat messages sent per user
- Workflow usage frequency
- Average conversation length
- User retention (7-day, 30-day)
- Sign-up conversion rate

**Logging Strategy:**

**Server-side (Pino):**
```typescript
logger.info('Chat message processed', {
  userId,
  messageLength,
  responseTime,
  difyLatency
})

logger.error('Dify API error', {
  userId,
  error: error.message,
  statusCode: error.response?.status
})
```

**Logs Storage:**
- Vercel logs (retained 7 days free tier)
- Consider log aggregation (Logflare, Datadog) for longer retention

**Alerting Rules:**

**Critical Alerts (Immediate Notification):**
- API error rate > 5% over 5 minutes
- Database connection failures
- Dify API unavailable
- Authentication system down

**Warning Alerts (Email Digest):**
- Response time > 3 seconds (95th percentile)
- High memory usage (> 80%)
- Increased error rates (> 1%)

**On-Call Rotation:**
- Define on-call schedule
- Set up PagerDuty or similar
- Document escalation procedures
