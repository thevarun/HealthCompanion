# Development Context

## Relevant Existing Code

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

## Dependencies

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

## Internal Modules

**Created for this project:**

```typescript
// Supabase integration
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ChatProvider } from '@/components/chat/ChatProvider';
import { DifyClient } from '@/lib/dify/client';
import type { ChatMessage, Workflow } from '@/lib/dify/types';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { userPreferences } from '@/models/schema/user-preferences';

// Dify integration
// Chat components
// Database schemas
```

**Existing from boilerplate:**

```typescript
// UI components (Shadcn)
// eslint-disable-next-line simple-import-sort/imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Utilities
import { cn } from '@/utils/cn'; // Tailwind class merger
```

## Configuration Changes

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
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**drizzle.config.ts (UPDATE):**

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './models/schema/**/*.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
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

## Existing Conventions (Brownfield)

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
'use client'; // If client component

// Import statements...

type ComponentProps = {
  title: string;
};

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
import logger from '@/lib/logger';

logger.info('User action', { userId, action });
logger.error('Operation failed', { error, context });
```

## Test Framework & Standards

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
// eslint-disable-next-line simple-import-sort/imports
import { describe, expect, it } from 'vitest';
import { createClient } from '@/lib/supabase/client';

describe('Supabase Client', () => {
  it('should create client with correct config', () => {
    const client = createClient();

    expect(client).toBeDefined();
  });
});
```

```typescript
// E2E test example
import { expect, test } from '@playwright/test';

test('user can send chat message', async ({ page }) => {
  await page.goto('/chat');
  await page.fill('[data-testid="chat-input"]', 'Hello');
  await page.click('[data-testid="send-button"]');

  await expect(page.locator('[data-testid="chat-message"]')).toContainText('Hello');
});
```

**Mocking:**
- Mock Supabase client in tests: `vi.mock('@/lib/supabase/client')`
- Mock Dify API calls: Use MSW (Mock Service Worker)
- Mock environment variables: Test setup file

---
