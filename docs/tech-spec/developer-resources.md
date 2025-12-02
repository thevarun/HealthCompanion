# Developer Resources

## File Paths Reference

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

## Key Code Locations

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

## Testing Locations

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

## Documentation to Update

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
