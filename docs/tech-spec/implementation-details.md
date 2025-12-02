# Implementation Details

## Source Tree Changes

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

## Technical Approach

**1. Authentication Migration (Clerk → Supabase)**

Use `@supabase/ssr` package for Next.js 14 App Router integration:

**Server-side (API routes, Server Components):**
```typescript
// lib/supabase/server.ts
// eslint-disable-next-line simple-import-sort/imports
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );
}
```

**Client-side (Client Components):**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

**Middleware (session refresh):**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: request.cookies,
    },
  );
  await supabase.auth.getUser(); // Refreshes session

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**2. Dify Integration via Backend Proxy**

Backend proxy pattern ensures API keys stay server-side and sessions are validated:

```typescript
// app/api/chat/route.ts
import { DifyClient } from '@/lib/dify/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // 1. Validate Supabase session
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Extract message from request
  const { message, conversationId } = await request.json();

  // 3. Call Dify API with service token
  const dify = new DifyClient(process.env.DIFY_API_KEY!);
  const stream = await dify.chatMessages({
    query: message,
    user: user.id,
    conversation_id: conversationId,
    response_mode: 'streaming',
  });

  // 4. Stream response back to client
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

**3. Assistant-UI Integration**

Use Assistant-UI's React components with custom runtime connecting to our Dify proxy:

```tsx
// components/chat/ChatInterface.tsx
import { Thread, useChat } from '@assistant-ui/react';

export function ChatInterface() {
  const { messages, sendMessage } = useChat({
    api: '/api/chat', // Our Dify proxy endpoint
  });

  return (
    <div className="flex h-screen flex-col">
      <Thread />
    </div>
  );
}
```

**4. Database Schema (Drizzle)**

Minimal app data stored in Supabase Postgres:

```typescript
// models/schema/user-preferences.ts
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  theme: text('theme').default('light'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  preferences: jsonb('preferences'), // Flexible JSON for future needs
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Note:** Chat history, messages, and conversations are stored in Dify Cloud, not our database.

## Existing Patterns to Follow

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

## Integration Points

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
