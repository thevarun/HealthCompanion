# Epic 10: Vercel AI SDK Chat - Component Strategy

## Quick Reference

### 1. No New shadcn Components Needed

All required UI components already exist in the project. The `@assistant-ui/react-ai-sdk` adapter is already installed.

```bash
# Already installed - no action needed
# @assistant-ui/react: ^0.11.56
# @assistant-ui/react-ai-sdk: ^1.1.21
```

### 2. Key Package to Use

```typescript
import { useVercelUseChatRuntime } from '@assistant-ui/react-ai-sdk';
```

## Component Mapping

| UI Element | Action | Source Component | Target Component | Notes |
|------------|--------|------------------|------------------|-------|
| Chat Thread | Reuse | `chat/Thread.tsx` | Same | No changes needed |
| Message List | Reuse | Inside Thread | Same | Handled by @assistant-ui |
| Input Area | Reuse | Inside Thread | Same | Handled by @assistant-ui |
| Typing Indicator | Reuse | `chat/TypingIndicator.tsx` | Same | No changes needed |
| App Shell | Reuse | `chat/AppShell.tsx` | Same | No changes needed |
| Sidebar | Adapt | `chat/ThreadListSidebar.tsx` | `chat/vercel/ConversationListSidebar.tsx` | Different API endpoint |
| Thread Item | Adapt | `chat/ThreadItem.tsx` | `chat/vercel/ConversationItem.tsx` | Different data shape |
| Chat Interface | **Create** | `chat/ChatInterface.tsx` | `chat/vercel/VercelChatInterface.tsx` | New adapter logic |
| Error States | Reuse | `chat/ErrorThreadState.tsx` | Same | No changes needed |
| Empty State | Reuse | `chat/EmptyThreadState.tsx` | Same | No changes needed |
| Skeletons | Reuse | `chat/ThreadListSkeleton.tsx` | Same | No changes needed |

## Reusable Components (No Changes)

These components work with any @assistant-ui runtime:

| Component | Path | Why Reusable |
|-----------|------|--------------|
| `Thread` | `src/components/chat/Thread.tsx` | Uses runtime context, adapter-agnostic |
| `TypingIndicator` | `src/components/chat/TypingIndicator.tsx` | Pure UI component |
| `AppShell` | `src/components/chat/AppShell.tsx` | Layout wrapper only |
| `ErrorThreadState` | `src/components/chat/ErrorThreadState.tsx` | Pure UI component |
| `EmptyThreadState` | `src/components/chat/EmptyThreadState.tsx` | Pure UI component |
| `ThreadListSkeleton` | `src/components/chat/ThreadListSkeleton.tsx` | Pure UI component |

## New Components to Create

### 1. VercelChatInterface.tsx

**Location:** `src/components/chat/vercel/VercelChatInterface.tsx`

**Purpose:** Connects Vercel AI SDK `useChat` to @assistant-ui runtime

```typescript
'use client';

import { useChat } from 'ai/react';
import { useVercelUseChatRuntime } from '@assistant-ui/react-ai-sdk';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { Thread } from '../Thread';

type VercelChatInterfaceProps = {
  conversationId?: string;
};

export function VercelChatInterface({ conversationId }: VercelChatInterfaceProps) {
  const chat = useChat({
    api: '/api/chat/vercel',
    id: conversationId,
    body: { conversationId },
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Thread className="min-h-0 flex-1" />
      </div>
    </AssistantRuntimeProvider>
  );
}
```

**Key Differences from Dify:**
- Uses `useChat` hook instead of custom fetch
- Uses `useVercelUseChatRuntime` instead of `useLocalRuntime`
- No custom SSE parsing needed (handled by Vercel AI SDK)
- Simpler error handling (built into useChat)

### 2. ConversationListSidebar.tsx

**Location:** `src/components/chat/vercel/ConversationListSidebar.tsx`

**Purpose:** Sidebar for Vercel conversations (copy + adapt from ThreadListSidebar)

**Changes from ThreadListSidebar:**
1. Fetch from `/api/chat/vercel/conversations` instead of `/api/threads`
2. Navigate to `/chat/vercel/[conversationId]` instead of `/chat/[threadId]`
3. Use `Conversation` type instead of `Thread` type
4. Archive endpoint: `/api/chat/vercel/conversations/[id]` with DELETE

### 3. ConversationItem.tsx

**Location:** `src/components/chat/vercel/ConversationItem.tsx`

**Purpose:** Individual conversation row in sidebar (copy + adapt from ThreadItem)

**Changes from ThreadItem:**
- Different route: `/chat/vercel/${conversation.id}`
- Different data fields (title from conversation, not thread)

## File Structure

```
src/components/chat/
├── Thread.tsx                    # Shared - reuse
├── TypingIndicator.tsx           # Shared - reuse
├── AppShell.tsx                  # Shared - reuse
├── ErrorThreadState.tsx          # Shared - reuse
├── EmptyThreadState.tsx          # Shared - reuse
├── ThreadListSkeleton.tsx        # Shared - reuse
├── ThreadListSidebar.tsx         # Dify-specific
├── ThreadItem.tsx                # Dify-specific
├── ChatInterface.tsx             # Dify-specific
└── vercel/                       # NEW FOLDER
    ├── VercelChatInterface.tsx   # Create
    ├── ConversationListSidebar.tsx  # Create (adapt from ThreadListSidebar)
    └── ConversationItem.tsx      # Create (adapt from ThreadItem)
```

## Route Structure

```
src/app/[locale]/(auth)/chat/
├── page.tsx                      # Chat selection or redirect
├── dify/
│   ├── page.tsx                  # Move existing chat here
│   └── [threadId]/page.tsx       # Move existing thread view
└── vercel/
    ├── page.tsx                  # New - uses VercelChatInterface
    └── [conversationId]/page.tsx # New - uses VercelChatInterface with ID
```

## Implementation Notes

### Adapter Pattern Comparison

| Aspect | Dify (Current) | Vercel (New) |
|--------|----------------|--------------|
| Hook | `useLocalRuntime` | `useVercelUseChatRuntime` |
| Adapter | Custom `ChatModelAdapter` | Built-in via `useChat` |
| SSE Parsing | Manual in adapter | Automatic by AI SDK |
| History | Custom `ThreadHistoryAdapter` | Built into useChat |
| API Format | Dify's format | Vercel AI SDK format |

### What NOT to Build

| Don't | Instead |
|-------|---------|
| New message bubble components | Reuse Thread component |
| Custom streaming logic | Use Vercel AI SDK's built-in |
| New input component | Reuse Thread's composer |
| Custom layout | Reuse AppShell |

### Testing Checklist

- [ ] `VercelChatInterface` renders without errors
- [ ] Messages stream correctly with typing indicator
- [ ] Conversation list loads from API
- [ ] New conversation creates database record
- [ ] Existing conversation loads message history
- [ ] Navigation between conversations works
- [ ] Mobile responsive behavior matches Dify chat

---

*Generated by designer-founder workflow on 2026-01-28*
