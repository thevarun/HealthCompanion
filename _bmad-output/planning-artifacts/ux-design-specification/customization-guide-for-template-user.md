# Customization Guide for Template User

## Quick Rebrand Checklist (2 Hour Target)

**1. Brand Colors (30 minutes)**
- Edit `tailwind.config.js` → Update `theme.extend.colors`
- Update primary, secondary, accent colors
- Test light/dark mode variants
- File location: `/tailwind.config.js`

**2. Typography (20 minutes)**
- Choose Google Font or system font
- Update font in `app/layout.tsx` (Next.js font optimization)
- Update Tailwind config if using custom font stack
- Files: `/src/app/layout.tsx`, `/tailwind.config.js`

**3. Logo & Branding Assets (30 minutes)**
- Replace logo in `/public/logo.svg` or `/public/logo.png`
- Update favicon in `/public/favicon.ico`
- Update manifest icons for PWA
- Update metadata in `app/layout.tsx`
- Files: `/public/*`, `/src/app/layout.tsx`

**4. App Name & Metadata (20 minutes)**
- Global search & replace "VT SaaS Template" → "Your App Name"
- Update meta descriptions, titles
- Update environment-specific branding if needed
- Files: Throughout `/src/`, focus on `/src/app/layout.tsx`

**5. Theme Customization (20 minutes)**
- Adjust CSS variables in `app/globals.css` for shadcn/ui theming
- Customize component variants if needed
- File: `/src/app/globals.css`

**Total:** ~2 hours for basic rebrand

## Advanced Customization

**Component Overrides:**
- shadcn/ui components live in `/src/components/ui/`
- Modify base components or create variants
- Use CVA for variant systems

**Layout Customization:**
- Update layouts in `/src/app/[locale]/(auth)/layout.tsx` and similar
- Modify navigation structure
- Adjust responsive breakpoints

**Feature Removal:**
- Remove unwanted features (admin panel, feedback, etc.)
- Clean up routes in `/src/app/[locale]/`
- Remove components and API routes
- Update navigation to exclude removed features

## Documentation for Future You

**README Section:** "Customizing This Template"
1. **Quick Start:** Run through rebrand checklist
2. **Color System:** Where to change colors, how they propagate
3. **Typography:** Font setup, size scale adjustments
4. **Component Library:** Link to shadcn/ui docs, local components
5. **Feature Modules:** What can be removed, what's core
6. **Deployment:** Environment variables, build process

**Code Comments:** Mark customization points
```typescript
// CUSTOMIZE: Update brand colors here
const brandColors = { ... }

// CUSTOMIZE: Replace with your logo
<Image src="/logo.svg" alt="Logo" />
```

---
