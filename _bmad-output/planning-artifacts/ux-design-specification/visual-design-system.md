# Visual Design System

## Design Approach

**Foundation:** Tailwind CSS + shadcn/ui component system
**Philosophy:** Modern, professional, adaptable

**Design Tokens Strategy:**
- **Tailwind Config:** Primary source of truth for theme customization
- **CSS Variables:** shadcn/ui's color system for light/dark mode
- **Single File Updates:** Customize entire look from `tailwind.config.js`

## Color System

**Customization Points:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* Brand primary color */ },
      secondary: { /* Brand secondary color */ },
      accent: { /* Accent/CTA color */ },
      // shadcn/ui semantic colors
      background, foreground, card, popover, etc.
    }
  }
}
```

**Light/Dark Mode:**
- Automatic system preference detection
- Manual toggle available
- Consistent color palette across themes
- High contrast ratios maintained (WCAG AA minimum)

## Typography

**Font Strategy:**
- **System:** Inter or similar modern sans-serif (default)
- **Customization:** Update font family in Tailwind config + Next.js font optimization
- **Scale:** Tailwind's default type scale (text-xs through text-9xl)
- **Hierarchy:** Clear heading levels (H1-H6) with appropriate sizing

**Typography Principles:**
- **Readability:** Line height 1.5+ for body text
- **Hierarchy:** Clear visual distinction between heading levels
- **Consistency:** Same styles applied to same elements across app
- **Responsiveness:** Font sizes adapt for mobile readability

## Spacing & Layout

**Grid System:** Tailwind's 4px-based spacing scale
- **Container:** max-w-7xl for main content areas
- **Padding:** Consistent p-4, p-6, p-8 for different contexts
- **Gaps:** gap-4, gap-6 for flexbox/grid layouts

**Responsive Breakpoints:**
- **Mobile:** < 768px (sm)
- **Tablet:** 768px - 1024px (md, lg)
- **Desktop:** > 1024px (xl, 2xl)

## Component Styling

**shadcn/ui Components (38+ available):**
- Button variants: default, destructive, outline, ghost, link
- Form components: Input, Textarea, Select, Checkbox, Radio
- Feedback: Toast, Alert, Dialog, Popover
- Navigation: Dropdown Menu, Navigation Menu, Tabs
- Data Display: Table, Card, Badge, Avatar

**Customization Approach:**
- Base styles in `components/ui/`
- Variant system via CVA (Class Variance Authority)
- Override via Tailwind classes as needed

## Iconography

**Icon System:**
- **Library:** Lucide React (recommended) or Heroicons
- **Size:** 16px, 20px, 24px standard sizes
- **Usage:** Consistent icon + label pairing for clarity
- **Accessibility:** aria-label for icon-only buttons

---
