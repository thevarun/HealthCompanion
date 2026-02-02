# ShareWidget Component Strategy (Story 8.1)

> **CRITICAL: EXTRACT CODE, DO NOT REBUILD**
>
> MagicPatterns designs contain **production-ready React/TypeScript**.
> Use `mcp__magic-patterns__read_files` to extract code directly.
> Only adapt for project patterns (shadcn, semantic tokens, no framer-motion, etc.)

## Quick Reference

### 1. Install shadcn Components

```bash
npx shadcn@latest add popover
```

**Note:** `button`, `tooltip` are already installed.

### 2. Extract Code from MagicPatterns

| Design | MagicPatterns URL | Primary File | Key Elements |
|--------|-------------------|--------------|--------------|
| ShareWidget | [View](https://www.magicpatterns.com/c/34p4xdfkgkybb9o4pxpwaw) | `ShareWidget.tsx` | 3 variants (inline, popup, minimal), platform config, clipboard API |
| ShareWidgetDemo | [View](https://www.magicpatterns.com/c/34p4xdfkgkybb9o4pxpwaw) | `ShareWidgetDemo.tsx` | Demo page (reference only, not for extraction) |

## Component Mapping

| UI Element | Source | Component | Variant/Props | Notes |
|------------|--------|-----------|---------------|-------|
| Share buttons (inline) | shadcn | `Button` | `variant="outline"`, `size="sm"` | Replace `motion.button` |
| Popup trigger | shadcn | `Popover` + `PopoverTrigger` | - | Replace custom popup div |
| Popup menu | shadcn | `PopoverContent` | `align="start"`, `className="w-[180px] p-2"` | Replace AnimatePresence menu |
| Tooltip (minimal) | shadcn | `Tooltip` + `TooltipTrigger` + `TooltipContent` | - | Platform name on hover |
| Copy feedback | sonner | `toast.success("Link copied!")` | - | Replace in-button "Copied!" text |
| Platform icons | lucide-react | N/A | Twitter/X uses custom SVG (no lucide equivalent) | See Icons section |

## Icons

| Platform | Icon Source | Notes |
|----------|-----------|-------|
| Twitter/X | Custom inline SVG (keep from MagicPatterns) | No official lucide icon for X |
| LinkedIn | Custom inline SVG (keep from MagicPatterns) | Brand icon not in lucide |
| Facebook | Custom inline SVG (keep from MagicPatterns) | Brand icon not in lucide |
| Copy Link | `Link` from lucide-react | Replace inline SVG |
| Copied | `Check` from lucide-react | Replace inline SVG |
| Share (popup trigger) | `Share2` from lucide-react | Replace inline SVG |

**Decision:** Social platform brand icons must stay as custom SVGs since lucide-react doesn't include brand logos. Extract them from MagicPatterns but move to a `platformIcons.tsx` helper or keep inline.

## Adaptations from MagicPatterns Code

| What | Before (MagicPatterns) | After (Project) |
|------|----------------------|------------------|
| Animation | `motion.button`, `whileHover`, `whileTap`, `AnimatePresence` | `transition-colors duration-200` on buttons, CSS `scale` on `:active` |
| Popup | Custom div with `AnimatePresence` + backdrop | shadcn `Popover` component |
| Colors | `bg-neutral-100 dark:bg-neutral-800`, `text-neutral-700` | `bg-muted`, `text-foreground`, `text-muted-foreground` |
| Copy feedback | In-button "Copied!" text with animation | `toast.success("Link copied!")` via sonner + icon swap with CSS transition |
| Class merging | String concatenation | `cn()` from `@/utils/Helpers` |
| Component import | None | `'use client'` directive |

### New Props (per Acceptance Criteria)

Add these to the MagicPatterns `ShareWidgetProps`:

```typescript
interface ShareWidgetProps {
  url: string
  title: string
  description?: string       // NEW: used in share text for platforms that support it
  platforms?: Platform[]
  variant?: 'inline' | 'popup' | 'minimal'
  className?: string
}
```

### Native Web Share API (Mobile)

Per AC: "native share API is used if available" on mobile.

```typescript
const handleShare = async (platform: Platform) => {
  // TODO: Analytics — event: "share_clicked", properties: { platform, url, page: window.location.pathname }

  // Native Web Share API for mobile (all platforms except 'copy')
  if (platform !== 'copy' && navigator.share) {
    try {
      await navigator.share({ title, text: description, url })
      return
    } catch {
      // User cancelled or API failed — fall through to platform URL
    }
  }

  if (platform === 'copy') {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied!')
    return
  }

  const shareUrl = platformConfig[platform].getUrl(url, title)
  window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
}
```

### Analytics Hook Points

```typescript
// In handleShare():
// TODO: Analytics — event: "share_clicked", properties: { platform, url, page: window.location.pathname }

// In popup open:
// TODO: Analytics — event: "share_menu_opened", properties: { variant, page: window.location.pathname }
```

## File Locations

```
src/components/share/
├── ShareWidget.tsx          # Main component
├── platformIcons.tsx        # Brand SVG icons (X, LinkedIn, Facebook)
└── index.ts                 # Barrel export
```

## Props Interface (Final)

```typescript
type Platform = 'twitter' | 'linkedin' | 'facebook' | 'copy'

interface ShareWidgetProps {
  /** URL to share */
  url: string
  /** Pre-filled share title/text */
  title: string
  /** Optional description for platforms that support it + Web Share API */
  description?: string
  /** Which platforms to show (default: all four) */
  platforms?: Platform[]
  /** Visual variant */
  variant?: 'inline' | 'popup' | 'minimal'
  /** Additional CSS classes */
  className?: string
}
```

## Platform Config

Reuse from MagicPatterns with semantic color updates:

```typescript
const platformConfig = {
  twitter: {
    label: 'X',
    icon: XIcon,
    hoverClass: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: LinkedInIcon,
    hoverClass: 'hover:bg-[#0A66C2] hover:text-white',
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    label: 'Facebook',
    icon: FacebookIcon,
    hoverClass: 'hover:bg-[#1877F2] hover:text-white',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  copy: {
    label: 'Copy Link',
    icon: Link,  // from lucide-react
    hoverClass: 'hover:bg-emerald-500 hover:text-white',
    getUrl: () => '',
  },
}
```

## Acceptance Criteria Coverage

| AC | Covered In |
|----|-----------|
| Share buttons for Twitter/X, LinkedIn, Facebook, Copy Link | `platformConfig` + `Platform` type |
| Recognizable platform icons | Brand SVGs in `platformIcons.tsx` |
| Platform share dialog opens with pre-filled text | `getUrl()` functions in config |
| Copy Link copies to clipboard with "Copied!" feedback | `handleShare` with `toast.success()` |
| Feedback auto-dismisses after 2 seconds | sonner toast default behavior |
| Props: url, title, description, platforms, variant | `ShareWidgetProps` interface |
| Native share API on mobile | `navigator.share` check in `handleShare` |
| Touch-friendly buttons | `min-h-[44px]` from MagicPatterns preserved |
| Analytics hook points documented | TODO comments in `handleShare` |

---

*Generated by designer-founder workflow on 2026-02-02*
