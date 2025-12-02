# Context

## Available Documents

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

## Project Stack

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

## Existing Codebase Structure

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
