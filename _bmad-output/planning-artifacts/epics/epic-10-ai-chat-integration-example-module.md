# Epic 10: AI Chat Integration (Example Module)

**Goal:** Template users see production-quality streaming patterns they can learn from or remove

## Story 10.1: Clean Up Existing Chat Code

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

## Story 10.2: Document SSE Streaming Patterns

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

## Story 10.3: Document API Proxy Pattern

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

## Story 10.4: Feature Removal Guide

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
