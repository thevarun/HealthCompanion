# User Feedback Collection Component Strategy

> **CRITICAL: EXTRACT CODE, DO NOT REBUILD**
>
> MagicPatterns designs contain **production-ready React/TypeScript**.
> Use `mcp__magic-patterns__read_files` to extract code directly.
> Only adapt for project patterns (Supabase auth, react-hook-form, API routes, etc.)

## Quick Reference

### 1. Install shadcn Components

```bash
npx shadcn@latest add dialog button textarea input
```

### 2. Extract Code from MagicPatterns

| Design | MagicPatterns URL | Primary File | Key Elements |
|--------|-------------------|--------------|--------------|
| Feedback Modal | [View](https://www.magicpatterns.com/c/ixx6mdxgjkjwkvsjuzybkg) | `FeedbackModal.tsx` | Dialog, segmented control, form, loading state |
| Feedback Trigger | [View](https://www.magicpatterns.com/c/ixx6mdxgjkjwkvsjuzybkg) | `FeedbackTrigger.tsx` | Sidebar button with icon, collapsed state support |

## Component Mapping

| UI Element | Source | Component | Variant/Props | Notes |
|------------|--------|-----------|---------------|-------|
| Modal container | shadcn | `Dialog` | - | Already in project |
| Modal content | shadcn | `DialogContent` | `sm:max-w-[425px]` | Responsive width |
| Modal header | shadcn | `DialogHeader`, `DialogTitle` | - | Standard usage |
| Type selector | Custom | Segmented control | 3-way toggle | Extract from MagicPatterns |
| Message input | shadcn | `Textarea` | `min-h-[120px]` | Already in project |
| Email input | shadcn | `Input` | `type="email"` | Already in project |
| Submit button | shadcn | `Button` | `isLoading` prop | Add loading variant |
| Cancel button | shadcn | `Button` | `variant="ghost"` | Standard usage |
| Sidebar trigger | Custom | `FeedbackTrigger` | `collapsed` prop | New component |
| Success toast | sonner | `toast.success()` | - | Already configured |

## shadcn Components

### Dialog (likely already installed)
- Used for modal container
- Handles focus trapping, keyboard dismissal, overlay
- No customization needed

### Button
- Add `isLoading` prop if not present
- Loading state shows spinner and "Sending..." text
- Disabled when loading or message empty

### Textarea
- Standard usage with `min-h-[120px]`
- Placeholder: "Tell us what's on your mind..."

### Input
- Email type with validation
- Placeholder: "you@example.com"

## Custom Components

### 1. FeedbackModal (`src/components/feedback/FeedbackModal.tsx`)

**Extract from:** MagicPatterns `components/FeedbackModal.tsx`

**Adaptations needed:**
- Replace mock API call with actual `/api/feedback` POST
- Integrate Supabase auth to detect logged-in user
- Hide email field when user is authenticated
- Use `react-hook-form` if project uses it for forms
- Connect to project's toast system (sonner already used)

**Props interface:**
```typescript
interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

### 2. FeedbackTrigger (`src/components/feedback/FeedbackTrigger.tsx`)

**Extract from:** MagicPatterns `components/FeedbackTrigger.tsx`

**Adaptations needed:**
- Match existing sidebar nav item styling
- Support collapsed sidebar state (icon only)
- Add tooltip for collapsed state

**Props interface:**
```typescript
interface FeedbackTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean
}
```

### 3. Segmented Control (inline in FeedbackModal)

**Extract from:** MagicPatterns `components/FeedbackModal.tsx` (the type selector section)

**Design:**
- 3-column grid with Bug, Feature, Praise options
- Icons: `Bug`, `Lightbulb`, `Heart` from lucide-react
- Color coding: red/blue/green for selected states
- Accessible with focus-visible rings

## MagicPatterns Designs

| Component | URL | Status |
|-----------|-----|--------|
| Complete Feedback UI | https://www.magicpatterns.com/c/ixx6mdxgjkjwkvsjuzybkg | Approved |

## What NOT to Do

| Don't | Instead |
|-------|---------|
| Build modal layout from scratch | Extract from MagicPatterns design |
| Create custom segmented control | Extract existing pattern from design |
| Write CSS for feedback types | Extract Tailwind classes (text-red-600, etc.) |
| Guess component structure | Read files with `read_files` tool first |
| Create new toast system | Use existing sonner configuration |

## Implementation Notes

1. **Auth Integration:** Check `supabase.auth.getUser()` to determine if user is logged in. If logged in, automatically attach `user_id` to feedback submission and hide email field.

2. **Form Validation:** Message is required, email is optional but validated for format when provided. Type defaults to 'bug' or can be unselected.

3. **API Endpoint:** POST to `/api/feedback` with body:
   ```typescript
   {
     type: 'bug' | 'feature' | 'praise',
     message: string,
     email?: string  // only for anonymous
   }
   ```

4. **Sidebar Integration:** Add `FeedbackTrigger` to sidebar in a "Support" section below main navigation items.

5. **Mobile:** Modal automatically responsive via `DialogContent`. No additional mobile work needed.

6. **Icons:** Uses `lucide-react` icons already in project: `MessageSquare`, `Bug`, `Lightbulb`, `Heart`

---

*Generated by designer-founder workflow on 2026-01-27*
