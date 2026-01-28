# Admin Panel Component Strategy

## Quick Reference

### 1. Install shadcn Components

```bash
npx shadcn@latest add button card badge table checkbox input dialog alert-dialog dropdown-menu select textarea tabs avatar tooltip sheet separator skeleton
```

### 2. Design Source

N/A - Design created with SuperDesign (HTML/CSS). Reference prototypes at `.superdesign/design_iterations/`.

## Component Mapping

| UI Element | Source | Component | Variant/Props | Notes |
|------------|--------|-----------|---------------|-------|
| Primary button | shadcn | Button | `variant="default"` | Blue background |
| Secondary button | shadcn | Button | `variant="outline"` | Border only |
| Ghost button | shadcn | Button | `variant="ghost"` | No border |
| Danger button | shadcn | Button | `variant="destructive"` | Red for delete actions |
| Content card | shadcn | Card | default | With CardHeader, CardContent |
| Metric card | Custom | MetricCard | - | Extends Card with trend display |
| Status badge | shadcn | Badge | custom variants | Active/Suspended/Pending |
| Feedback type badge | shadcn | Badge | custom variants | Bug/Feature/Praise |
| Data table | shadcn | Table | - | With custom DataTable wrapper |
| Row checkbox | shadcn | Checkbox | - | For bulk selection |
| Search input | shadcn | Input | - | With search icon |
| User detail modal | shadcn | Dialog | - | Slide-over panel style |
| Delete confirm | shadcn | AlertDialog | - | Type-to-confirm pattern |
| Filter dropdown | shadcn | DropdownMenu | - | Status filter |
| Template selector | shadcn | Select | - | Email templates |
| Feedback tabs | shadcn | Tabs | - | All/Unread/Bug/Feature/Praise |
| User avatar | shadcn | Avatar | - | Initials fallback |
| Icon tooltips | shadcn | Tooltip | - | Action button hints |
| Mobile sidebar | shadcn | Sheet | `side="left"` | Overlay navigation |
| Section divider | shadcn | Separator | - | Between nav groups |
| Loading state | shadcn | Skeleton | - | Table rows, cards |

## shadcn Components

### Button
Standard shadcn button with project variants.

```tsx
// Variants used in admin
<Button>Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon">Icon Only</Button>
```

### Card
Container for dashboard sections.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badge
Status indicators. Extend with custom variants for admin statuses.

```tsx
// Add to badge variants in components/ui/badge.tsx
const badgeVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        // Admin status variants
        active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        // Feedback type variants
        bug: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        feature: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        praise: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      }
    }
  }
)
```

### Table
Data display for users and audit logs.

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12"><Checkbox /></TableHead>
      <TableHead>User</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* Rows */}
  </TableBody>
</Table>
```

### Dialog
User detail panel (slide-over style).

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="ghost" size="icon">
      <Eye className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>User Details</DialogTitle>
    </DialogHeader>
    {/* User info */}
  </DialogContent>
</Dialog>
```

### AlertDialog
Dangerous action confirmation with type-to-confirm.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete User</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete User?</AlertDialogTitle>
      <AlertDialogDescription>
        Type "delete" to confirm this action.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <Input placeholder="Type 'delete' to confirm" />
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction disabled={!isConfirmed}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Tabs
Feedback filtering.

```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="unread">Unread</TabsTrigger>
    <TabsTrigger value="bug">Bug</TabsTrigger>
    <TabsTrigger value="feature">Feature</TabsTrigger>
    <TabsTrigger value="praise">Praise</TabsTrigger>
  </TabsList>
  <TabsContent value="all">{/* Content */}</TabsContent>
</Tabs>
```

### Sheet
Mobile sidebar navigation.

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64 p-0">
    <AdminSidebar />
  </SheetContent>
</Sheet>
```

## Custom Components

### AdminLayout
Main layout shell wrapping all admin pages.

**Build approach:** Compose with shadcn Sheet for mobile, custom sidebar for desktop.

```tsx
// src/components/admin/AdminLayout.tsx
interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent side="left">
          <AdminSidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AdminHeader onMenuClick={/* sheet trigger */} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### AdminSidebar
Collapsible navigation sidebar with grouped links.

**Build approach:** Custom component with cn() utility for collapse states.

```tsx
// src/components/admin/AdminSidebar.tsx
interface AdminSidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onToggle?: () => void;
}

// Nav items config
const navItems = [
  { group: "Overview", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard }
  ]},
  { group: "Management", items: [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Feedback", href: "/admin/feedback", icon: MessageSquareText }
  ]},
  { group: "System", items: [
    { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
    { label: "Email Testing", href: "/admin/email", icon: Mail },
    { label: "Settings", href: "/admin/settings", icon: Settings }
  ]}
];
```

### AdminHeader
Top header bar with sidebar toggle, admin badge, theme toggle, user menu.

**Build approach:** Flexbox layout with DropdownMenu for user menu.

```tsx
// src/components/admin/AdminHeader.tsx
interface AdminHeaderProps {
  onSidebarToggle?: () => void;
}
```

### MetricCard
Dashboard statistic card with trend indicator.

**Build approach:** Extend Card with custom content structure.

```tsx
// src/components/admin/MetricCard.tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "neutral";
    text: string;
  };
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm mt-2",
            trend.direction === "up" && "text-green-600",
            trend.direction === "down" && "text-red-600",
            trend.direction === "neutral" && "text-muted-foreground"
          )}>
            {trend.direction === "up" && <TrendingUp className="h-4 w-4" />}
            {trend.direction === "down" && <TrendingDown className="h-4 w-4" />}
            {trend.direction === "neutral" && <Minus className="h-4 w-4" />}
            <span>{trend.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### DataTable (wrapper)
Sortable, selectable table with pagination.

**Build approach:** Wrap shadcn Table with sorting/selection state, use TanStack Table for complex needs.

### FeedbackCard
Card for displaying feedback items with type badge and actions.

**Build approach:** Card with custom layout for feedback display.

### EmailPreview
Live preview panel for email templates.

**Build approach:** iframe or dangerouslySetInnerHTML for HTML preview with sandbox.

## Implementation Notes

### Theme Integration
The prototype uses CSS custom properties. Map these to Tailwind CSS classes:

| CSS Variable | Tailwind Equivalent |
|--------------|-------------------|
| `--text-heading` | `text-foreground` |
| `--text-body` | `text-foreground` |
| `--text-muted` | `text-muted-foreground` |
| `--card-bg` | `bg-card` |
| `--border-color` | `border-border` |
| `--accent-primary` | `bg-primary` / `text-primary` |

### Animation Classes
Add to `globals.css` or use Tailwind animate plugin:

```css
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-card-enter {
  animation: card-enter 0.3s ease-out forwards;
}
```

### Responsive Breakpoints
Follow Tailwind defaults:
- Mobile: default (< 768px)
- Tablet: `md:` (>= 768px)
- Desktop: `lg:` (>= 1024px)

### File Structure
```
src/
  app/[locale]/(auth)/admin/
    layout.tsx          # AdminLayout wrapper
    page.tsx            # Dashboard
    users/
      page.tsx          # User management
    feedback/
      page.tsx          # Feedback management
    audit/
      page.tsx          # Audit log
    email/
      page.tsx          # Email testing
  components/admin/
    AdminLayout.tsx
    AdminSidebar.tsx
    AdminHeader.tsx
    MetricCard.tsx
    DataTable.tsx
    UserDetailDialog.tsx
    FeedbackCard.tsx
    EmailPreview.tsx
```

---

*Generated by designer-founder workflow on 2026-01-27*
