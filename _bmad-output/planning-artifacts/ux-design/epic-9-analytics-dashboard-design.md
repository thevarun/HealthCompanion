# Epic 9: Analytics Dashboard - Design Specification

**Route:** `/admin/analytics` (or `/[locale]/(auth)/admin/analytics`)
**Access:** Admin-only protected
**Date:** 2026-01-28

---

## Component Mapping

| UI Element | shadcn Component | Notes |
|------------|------------------|-------|
| Metric Cards | `Card` (existing) | Extend with trend indicators |
| Trend Arrows | `lucide-react` icons | TrendingUp, TrendingDown, Minus |
| Loading States | `Skeleton` (existing) | Already in project |
| Charts | `chart` (recharts) | **New install required** |
| Progress Bars | `Progress` (existing) | For completion rates |
| Page Layout | Existing admin layout | Reuse sidebar + header |

### Installation Command

```bash
npx shadcn@latest add chart
```

This installs `recharts` and the chart primitives.

---

## Layout Specification

### Desktop (≥1200px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ METRICS ROW (5 cards, equal width)                                  │
│ grid-cols-5 gap-4                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌──────────────────────────────────────────┐ ┌────────────────────┐ │
│ │ CHART SECTION (2/3 width)                │ │ RATES CARD (1/3)   │ │
│ │ Signups Over Time                        │ │                    │ │
│ │ Area/Line chart - 30 days                │ │ Completion Rates   │ │
│ │                                          │ │ • Onboarding: 78%  │ │
│ │                                          │ │ • Activation: 68%  │ │
│ │                                          │ │ • Feedback: 42     │ │
│ └──────────────────────────────────────────┘ └────────────────────┘ │
│ grid-cols-3 (chart spans 2, rates spans 1)                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1199px)

```
┌─────────────────────────────────────────┐
│ METRICS ROW                             │
│ grid-cols-3 (first row)                 │
│ grid-cols-2 (second row)                │
├─────────────────────────────────────────┤
│ CHART (full width)                      │
├─────────────────────────────────────────┤
│ RATES CARD (full width)                 │
└─────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────┐
│ Metric 1            │
├─────────────────────┤
│ Metric 2            │
├─────────────────────┤
│ ... (stacked)       │
├─────────────────────┤
│ Chart (simplified)  │
├─────────────────────┤
│ Rates Card          │
└─────────────────────┘
grid-cols-1
```

---

## Component Specifications

### 1. MetricCard Component

**File:** `src/components/admin/analytics/MetricCard.tsx`

```tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string; // e.g., "+12%" or "No change"
  };
  isLoading?: boolean;
}
```

**Visual States:**

| State | Appearance |
|-------|------------|
| Loading | Skeleton: label (h-4 w-24), value (h-8 w-16), trend (h-4 w-32) |
| Trend Up | Green text + TrendingUp icon |
| Trend Down | Red text + TrendingDown icon |
| Neutral | Gray text + Minus icon |

**Tailwind Classes:**
```
Card: p-6 hover:shadow-md transition-shadow
Label: text-sm text-muted-foreground mb-2
Value: text-3xl font-bold
Trend Up: text-green-600 dark:text-green-400
Trend Down: text-red-600 dark:text-red-400
Trend Neutral: text-muted-foreground
```

### 2. SignupsChart Component

**File:** `src/components/admin/analytics/SignupsChart.tsx`

**Chart Type:** Area chart with gradient fill (matches existing admin theme)

**Data Structure:**
```tsx
interface ChartData {
  date: string;      // "Jan 1", "Jan 2", etc.
  signups: number;
}
```

**Chart Config:**
- X-axis: Dates (last 30 days)
- Y-axis: Signup count (auto-scale)
- Tooltip: Show date + count on hover
- Fill: Gradient from primary-500 to transparent
- Line: primary-500, 2px stroke

**Skeleton State:**
- Card with header skeleton
- Chart area: Single animated skeleton block (h-[300px])

### 3. CompletionRatesCard Component

**File:** `src/components/admin/analytics/CompletionRatesCard.tsx`

**Metrics:**
| Metric | Type | Display |
|--------|------|---------|
| Onboarding Completion | Percentage | Progress bar + "78%" |
| Activation Rate | Percentage | Progress bar + "68%" |
| Feedback Count | Count | Plain number "42 total" |

**Visual:**
```
┌─────────────────────────────────┐
│ Completion Rates                │
├─────────────────────────────────┤
│ Onboarding Completion           │
│ ████████████████░░░░░░░░  78%   │
│                                 │
│ Activation Rate                 │
│ ██████████████░░░░░░░░░░  68%   │
│                                 │
│ ─────────────────────────────── │
│ Feedback Submitted              │
│ 42 total                        │
└─────────────────────────────────┘
```

---

## Data Requirements

### Metrics to Display

| Metric | Source | Calculation |
|--------|--------|-------------|
| Total Users | `users` table | `COUNT(*)` |
| Signups (7d) | `users` table | `COUNT(*) WHERE created_at > NOW() - 7 days` |
| Signups (30d) | `users` table | `COUNT(*) WHERE created_at > NOW() - 30 days` |
| Active Users (7d) | `users` table | `COUNT(*) WHERE last_active_at > NOW() - 7 days` |
| Activation Rate | Calculated | `(activated_users / total_users) * 100` |
| Onboarding Completion | `users` table | `(onboarding_completed / total_users) * 100` |
| Feedback Count | `feedback` table | `COUNT(*)` |

### Trend Calculations

Compare current period vs previous period:
- 7d metrics: Compare to previous 7 days
- 30d metrics: Compare to previous 30 days
- Rates: Compare to previous period

---

## API Endpoint

**Route:** `GET /api/admin/analytics`

**Response:**
```typescript
interface AnalyticsResponse {
  metrics: {
    totalUsers: { value: number; trend: TrendData };
    signups7d: { value: number; trend: TrendData };
    signups30d: { value: number; trend: TrendData };
    activeUsers7d: { value: number; trend: TrendData };
    activationRate: { value: number; trend: TrendData };
    onboardingCompletion: { value: number; trend: TrendData };
    feedbackCount: { value: number; trend: TrendData };
  };
  signupsChart: Array<{ date: string; signups: number }>;
}

interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  value: string;
  percentage: number;
}
```

---

## File Structure

```
src/
├── app/[locale]/(auth)/admin/
│   └── analytics/
│       └── page.tsx              # Main page
├── components/admin/analytics/
│   ├── MetricCard.tsx            # Reusable metric card
│   ├── MetricCardSkeleton.tsx    # Loading state
│   ├── SignupsChart.tsx          # Area chart
│   ├── SignupsChartSkeleton.tsx  # Chart loading
│   ├── CompletionRatesCard.tsx   # Progress bars card
│   └── AnalyticsDashboard.tsx    # Main layout component
└── libs/api/admin/
    └── analytics.ts              # Data fetching logic
```

---

## Responsive Breakpoints

```css
/* Tailwind grid classes */
.metrics-grid {
  @apply grid gap-4;
  @apply grid-cols-1;           /* Mobile */
  @apply sm:grid-cols-2;        /* Small tablets */
  @apply lg:grid-cols-3;        /* Tablets */
  @apply xl:grid-cols-5;        /* Desktop */
}

.chart-grid {
  @apply grid gap-6;
  @apply grid-cols-1;           /* Mobile/Tablet */
  @apply xl:grid-cols-3;        /* Desktop: chart=2, rates=1 */
}

.chart-container {
  @apply xl:col-span-2;
}
```

---

## Color Tokens (from existing theme)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--trend-up` | #16a34a | #22c55e | Positive trends |
| `--trend-down` | #dc2626 | #ef4444 | Negative trends |
| `--trend-neutral` | #64748b | #a1a1aa | No change |
| `--accent-primary` | #2563eb | #3b82f6 | Chart fill, primary actions |

---

## Skeleton Loading Pattern

```tsx
// Usage in page.tsx
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}

// AnalyticsSkeleton.tsx
function AnalyticsSkeleton() {
  return (
    <>
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart + Rates */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-36 mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
```

---

## Implementation Checklist

- [ ] Install shadcn chart component (`npx shadcn@latest add chart`)
- [ ] Create `MetricCard` component with loading state
- [ ] Create `SignupsChart` component with recharts
- [ ] Create `CompletionRatesCard` component
- [ ] Create API endpoint `/api/admin/analytics`
- [ ] Add database queries for metrics
- [ ] Create analytics page at `/admin/analytics`
- [ ] Add "Analytics" nav item to admin sidebar
- [ ] Test responsive behavior
- [ ] Test skeleton loading states
- [ ] Test dark mode

---

## Design Decisions

1. **5 metrics instead of 6**: Combined "Signups 7d" and "Signups 30d" into the same row, dropped "Error Count" (optional per epic)

2. **Area chart over bar chart**: Area charts better show trends over time, matches modern dashboard aesthetics (Linear, Vercel)

3. **Completion rates in separate card**: Groups related conversion metrics together, easier to scan

4. **No sparklines in metric cards**: Keeps metrics clean and focused; the main chart provides trend visualization

5. **Recharts via shadcn**: Consistent with shadcn ecosystem, well-documented, accessible
