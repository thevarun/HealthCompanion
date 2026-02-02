# Programmatic SEO Template Component Strategy (Story 8.5)

> **CRITICAL: EXTRACT CODE, DO NOT REBUILD**
>
> MagicPatterns designs contain **production-ready React/TypeScript**.
> Use `mcp__magic-patterns__read_files` to extract code directly.
> Only adapt for project patterns (semantic tokens, Next.js App Router, data-driven props, etc.)

## Quick Reference

### 1. Install shadcn Components

```bash
# No new components needed — accordion, card, badge, button all exist
```

### 2. Extract Code from MagicPatterns

| Design | MagicPatterns URL | Primary File | Key Elements |
|--------|-------------------|--------------|--------------|
| Full Template | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `PseoTemplate.tsx` | Page composition with nav + footer |
| Hero Section | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `HeroSection.tsx` | Badge, heading with placeholders, CTAs, trust badges |
| Stats Bar | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `StatsBar.tsx` | 4-column stat cards |
| Content Area | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `ContentArea.tsx` | 8/4 grid with article + sidebar |
| Feature Grid | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `FeatureGrid.tsx` | 3-column feature cards |
| FAQ Section | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `FaqSection.tsx` | Accordion FAQ |
| CTA Footer | [View](https://www.magicpatterns.com/c/o9a8d4f3rkxfpuuv5zy3pl) | `CtaFooter.tsx` | Dark CTA section |

## Component Mapping

| UI Element | MagicPatterns Source | Project Component | Notes |
|------------|---------------------|-------------------|-------|
| FAQ accordion | Custom `useState` toggle | shadcn `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Replace custom implementation |
| Feature cards | Custom div | shadcn `Card`, `CardHeader`, `CardTitle`, `CardDescription` | Optional — raw divs are fine too |
| CTA buttons | HTML `<button>` | shadcn `Button` | Use `variant="default"` and `variant="outline"` |
| Badges (hero) | Inline `<span>` | shadcn `Badge` | "Updated for 2024" badge |
| Stats icons | lucide-react | lucide-react | Already compatible |
| Navigation | Inline nav in template | **Remove** — use project layout or minimal standalone nav | pSEO pages are public, may not need app nav |
| Footer | Inline footer in template | **Remove** — use project footer or minimal standalone footer | Same rationale |

## Adaptations from MagicPatterns Code

| What | Before (MagicPatterns) | After (Project) |
|------|----------------------|------------------|
| Colors | `indigo-600`, `indigo-50`, `slate-*` hardcoded | `primary`, `primary-foreground`, `bg-muted`, `text-foreground`, `text-muted-foreground` |
| Placeholders | String literals `{Category}`, `{Location}` | Props: `category: string`, `location: string`, `slug: string` |
| Content | Hardcoded article text | Data-driven via props from JSON data source |
| FAQ | Custom `useState` accordion | shadcn `Accordion` component |
| Nav/Footer | Inline in `PseoTemplate.tsx` | Remove — standalone public layout or project layout |
| `'use client'` | Not present | Add to `FaqSection.tsx` (interactive accordion) |
| Static generation | Not present | `generateStaticParams` + `generateMetadata` in page.tsx |
| Breadcrumbs | Not present | **Add** per AC — `Home > {Category} > {Page Title}` |
| Related Pages | Not present | **Add** per AC — links to same-category pages from data model |
| Sitemap | Not present | **Add** pSEO routes to `sitemap.ts` |

### Data-Driven Props Pattern

All hardcoded content becomes props. The page route loads data from JSON and passes to components:

```typescript
// Data type for a pSEO page
interface PseoPageData {
  category: string
  slug: string
  location?: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroBadge: string
  stats: Array<{ label: string; value: string; icon: string }>
  content: {
    heading: string
    body: string          // markdown or HTML
    features: string[]
    proTip?: string
  }
  features: Array<{ title: string; description: string; icon: string }>
  faqs: Array<{ question: string; answer: string }>
  cta: { heading: string; description: string; primaryLabel: string; secondaryLabel: string }
  relatedCategories: Array<{ label: string; slug: string }>
}
```

### Breadcrumb Navigation (New — per AC)

```typescript
// src/components/pseo/Breadcrumbs.tsx
interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>
}

// Usage:
<Breadcrumbs items={[
  { label: 'Home', href: '/' },
  { label: data.category, href: `/${locale}/${data.category}` },
  { label: data.title },
]} />
```

### Related Pages Section (New — per AC)

```typescript
// src/components/pseo/RelatedPages.tsx
interface RelatedPagesProps {
  pages: Array<{ title: string; slug: string; description: string }>
  category: string
  locale: string
}

// Renders a grid of cards linking to same-category pages
// Data sourced from JSON data files, not hardcoded
```

### Static Generation

```typescript
// src/app/[locale]/(pseo)/[category]/[slug]/page.tsx

export async function generateStaticParams() {
  const pages = await loadAllPseoPages()
  return pages.map((page) => ({
    category: page.category,
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params
  const data = await loadPseoPage(category, slug)
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'article',
    },
  }
}
```

## Route Structure

```
src/app/[locale]/(pseo)/
├── layout.tsx                    # Minimal public layout (no auth sidebar)
└── [category]/
    └── [slug]/
        └── page.tsx              # Server component, loads data, renders template
```

## Data Source

```
data/pseo/
├── categories.json               # List of categories with metadata
└── pages/
    ├── marketing-automation/
    │   ├── best-tools-new-york.json
    │   └── best-tools-san-francisco.json
    └── crm-software/
        └── best-tools-chicago.json
```

## File Locations

```
src/components/pseo/
├── HeroSection.tsx               # Hero with data-driven title, badge, CTAs
├── StatsBar.tsx                  # Stats row with configurable items
├── ContentArea.tsx               # Main content + sidebar
├── FeatureGrid.tsx               # Feature cards grid
├── FaqSection.tsx                # 'use client' — shadcn Accordion FAQ
├── CtaFooter.tsx                 # Dark CTA section
├── Breadcrumbs.tsx               # NEW — breadcrumb navigation
├── RelatedPages.tsx              # NEW — related pages grid
└── index.ts                      # Barrel export
```

## Sitemap Integration

Add pSEO routes to the project's `sitemap.ts`:

```typescript
// In src/app/sitemap.ts or a nested sitemap for pSEO
import { loadAllPseoPages } from '@/libs/pseo/data'

// Generate sitemap entries for all pSEO pages
const pseoPages = await loadAllPseoPages()
const pseoEntries = pseoPages.map((page) => ({
  url: `${baseUrl}/${page.locale}/${page.category}/${page.slug}`,
  lastModified: page.updatedAt || new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.7,
}))
```

## Analytics Hook Points

```typescript
// In page.tsx (server component, add TODO for client wrapper):
// TODO: Analytics — event: "pseo_page_viewed", properties: { category, slug, location }

// In CtaFooter.tsx CTA buttons:
// TODO: Analytics — event: "pseo_cta_clicked", properties: { category, slug, ctaType: "primary" | "secondary" }

// In RelatedPages.tsx link clicks:
// TODO: Analytics — event: "pseo_related_page_clicked", properties: { fromSlug, toSlug, category }

// In ContentArea.tsx sidebar links:
// TODO: Analytics — event: "pseo_sidebar_link_clicked", properties: { category, linkType: "toc" | "related_category" | "promo" }
```

## Acceptance Criteria Coverage

| AC | Covered In |
|----|-----------|
| Pattern for dynamic route generation | `[category]/[slug]/page.tsx` route structure |
| Next.js dynamic routes | App Router `(pseo)` route group |
| Pattern documented with examples | Data types, file structure, JSON examples |
| Route structure /[category]/[slug] | Route structure section |
| Statically generated at build time | `generateStaticParams` |
| Proper metadata (title, description, OG) | `generateMetadata` |
| Data from JSON files | `data/pseo/` directory structure |
| `generateStaticParams` used | Explicit in page.tsx |
| Example in `src/app/[locale]/(pseo)/` | Route structure section |
| Demonstrates data loading, template, metadata | Full page.tsx pattern |
| Nested sitemap for pSEO routes | Sitemap integration section |
| Sitemap auto-updates with new data | Dynamic sitemap generation from data files |
| Breadcrumb navigation | `Breadcrumbs.tsx` component |
| Related Pages section | `RelatedPages.tsx` component |
| Related links from data model (not hardcoded) | `relatedCategories` in `PseoPageData` |
| Analytics hook points documented | TODO comments throughout |
| Content is unique/valuable (not thin) | Data-driven content from JSON, article-style layout |
| Template easy to copy/modify | Component-per-section architecture |
| Data format clearly specified | `PseoPageData` TypeScript interface |

---

*Generated by designer-founder workflow on 2026-02-02*
