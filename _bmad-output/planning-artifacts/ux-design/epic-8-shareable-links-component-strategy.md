# Shareable Links Component Strategy (Story 8.2)

> **CRITICAL: EXTRACT CODE, DO NOT REBUILD**
>
> MagicPatterns designs contain **production-ready React/TypeScript**.
> Use `mcp__magic-patterns__read_files` to extract code directly.
> Only adapt for project patterns (shadcn, Supabase auth, Drizzle ORM, etc.)

## Quick Reference

### 1. Install shadcn Components

```bash
# No new components needed — all are already installed:
# dialog, button, input, select, table, badge, form, label
```

### 2. Extract Code from MagicPatterns

| Design | MagicPatterns URL | Primary File | Key Elements |
|--------|-------------------|--------------|--------------|
| Share Link Modal | [View](https://www.magicpatterns.com/c/rcyosbx5s9dfvmc4jdmytw) | `ShareLinkModal.tsx` | Generated link display, copy button |
| Share Links Table | [View](https://www.magicpatterns.com/c/rcyosbx5s9dfvmc4jdmytw) | `ShareLinksTable.tsx` | Table with status badges, copy/toggle/delete actions, empty state |

## Component Mapping

| UI Element | MagicPatterns Source | Project Component | Notes |
|------------|---------------------|-------------------|-------|
| Modal container | Custom `Modal.tsx` | shadcn `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` | Replace entirely |
| Modal close button | Custom in `Modal.tsx` | Built into shadcn `DialogContent` | Automatic |
| Expiration select | Custom `Select.tsx` | shadcn `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Replace entirely |
| Create/Done buttons | Custom `Button.tsx` | shadcn `Button` | Replace entirely |
| Copy button | Custom `Button.tsx` | shadcn `Button` with `variant="outline"` + `size="icon"` | Replace entirely |
| Links table | HTML `<table>` | shadcn `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` | Replace entirely |
| Status badge | Custom `Badge.tsx` | shadcn `Badge` | Map variants: active→default, expired→secondary, revoked→destructive |
| Empty state | Inline div | Project's `EmptyState` component | Already exists in `src/components/ui/EmptyState.tsx` |
| Copy feedback | framer-motion icon swap | CSS `transition-opacity` + sonner toast | No framer-motion |
| Animations | framer-motion throughout | CSS `transition-all duration-200` | No framer-motion |

## Adaptations from MagicPatterns Code

| What | Before (MagicPatterns) | After (Project) |
|------|----------------------|------------------|
| Modal | Custom `Modal` with framer-motion | shadcn `Dialog` |
| Button | Custom `Button` component | shadcn `Button` |
| Badge | Custom `Badge` (active/expired/revoked/default) | shadcn `Badge` (default/secondary/destructive/outline) |
| Input | Custom `Input` with label | shadcn `Input` + `Label` |
| Select | Custom `Select` with chevron | shadcn `Select` component |
| Colors | `slate-*` hardcoded | Semantic tokens (`bg-muted`, `text-foreground`, `border-border`) |
| Animations | framer-motion `AnimatePresence` | CSS transitions |
| Icons | lucide-react (keep as-is) | lucide-react (already compatible) |
| Form validation | None | Zod schema + react-hook-form |
| API calls | Mock `onCreateLink` callback | `fetch('/api/share', ...)` |
| Auth | None | Supabase `getUser()` for `created_by` |
| Link status | `public`/`private` toggle | `is_active` boolean + `expires_at` timestamp |

## Form Validation (Zod)

```typescript
import { z } from 'zod'

const createShareLinkSchema = z.object({
  resourceType: z.string().min(1),
  resourceId: z.string().uuid(),
})
```

## Database Schema

Add to `src/models/Schema.ts`:

```typescript
export const shareableLinkStatusEnum = pgEnum('shareable_link_status', ['active', 'expired', 'revoked'])

export const shareableLinks = healthCompanionSchema.table(
  'shareable_links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),        // crypto.randomUUID() or nanoid
    resourceType: text('resource_type').notNull(),   // e.g., 'report', 'document', 'dashboard'
    resourceId: uuid('resource_id').notNull(),
    createdBy: uuid('created_by').notNull(),         // Supabase user ID
    expiresAt: timestamp('expires_at', { withTimezone: true }), // null = never expires
    accessCount: integer('access_count').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokenIdx: index('idx_shareable_links_token').on(table.token),
    createdByIdx: index('idx_shareable_links_created_by').on(table.createdBy),
    resourceIdx: index('idx_shareable_links_resource').on(
      table.resourceType,
      table.resourceId,
    ),
  }),
)
```

**Note:** Import `integer` from `drizzle-orm/pg-core` (not currently imported in Schema.ts).

## API Routes

### POST `/api/share` — Create a share link

```typescript
// src/app/api/share/route.ts
// Auth: required (Supabase session)
// Body: { resourceType, resourceId }
// Returns: { token, url, expiresAt }
```

### GET `/api/share/[token]` — Access a shared resource

```typescript
// src/app/api/share/[token]/route.ts
// Auth: NOT required (public)
// Returns: { resourceType, resourceId, data } or 410 Gone if expired/revoked
// Side effect: increments access_count
```

### PATCH `/api/share/[token]` — Revoke a share link

```typescript
// src/app/api/share/[token]/route.ts
// Auth: required (must be created_by user)
// Body: { isActive: false }
// Returns: { success: true }
```

### GET `/api/share` — List user's share links

```typescript
// src/app/api/share/route.ts (GET handler)
// Auth: required
// Returns: ShareLink[] for current user
```

## File Locations

```
src/components/share/
├── ShareLinkModal.tsx       # Create share link dialog
├── ShareLinksTable.tsx      # Table of user's share links
├── ShareWidget.tsx          # From Story 8.1
├── platformIcons.tsx        # From Story 8.1
└── index.ts                 # Barrel export

src/app/api/share/
├── route.ts                 # POST (create) + GET (list)
└── [token]/
    └── route.ts             # GET (access) + PATCH (revoke)
```

## Props Interfaces

### ShareLinkModal

```typescript
interface ShareLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceType: string
  resourceId: string
  onLinkCreated?: (link: ShareLink) => void
}
```

### ShareLinksTable

```typescript
interface ShareLink {
  id: string
  token: string
  resourceType: string
  resourceId: string
  url: string
  isActive: boolean
  expiresAt: string | null
  accessCount: number
  createdAt: string
}

interface ShareLinksTableProps {
  links: ShareLink[]
  onRevoke: (token: string) => void
  onCopy: (url: string) => void
  isLoading?: boolean
}
```

## Analytics Hook Points

```typescript
// In ShareLinkModal handleCreate:
// TODO: Analytics — event: "share_link_created", properties: { resourceType }

// In ShareLinksTable handleRevoke:
// TODO: Analytics — event: "share_link_revoked", properties: { resourceType, token }

// In ShareLinksTable handleCopy:
// TODO: Analytics — event: "share_link_copied", properties: { resourceType }

// In GET /api/share/[token]:
// TODO: Analytics — event: "share_link_accessed", properties: { resourceType, token }
```

## Acceptance Criteria Coverage

| AC | Covered In |
|----|-----------|
| Click "Publish" generates unique URL with unguessable token | `POST /api/share` route + `crypto.randomUUID()` |
| URL displayed with copy button | `ShareLinkModal` generated link section |
| DB schema: shareable_links with all required fields | Drizzle schema definition above |
| Can revoke link later | `PATCH /api/share/[token]` + revoke button in table |
| Valid link shows shared content, increments access_count | `GET /api/share/[token]` route |
| No auth required for viewing | Public GET endpoint |
| Expired/revoked shows "This link has expired" | 410 response + client-side expired page |
| Option to request new link on expired page | Link/button in expired state UI |
| Share link management: list + revoke | `ShareLinksTable` + `GET /api/share` |

---

*Generated by designer-founder workflow on 2026-02-02*
