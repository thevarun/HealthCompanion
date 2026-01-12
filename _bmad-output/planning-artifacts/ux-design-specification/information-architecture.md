# Information Architecture

## Site Map Structure

```
VT SaaS Template Application
│
├── Public (Unauthenticated)
│   ├── Landing Page
│   ├── Sign In
│   ├── Sign Up
│   ├── Password Reset
│   └── Email Verification Confirmation
│
├── Onboarding (Post-signup, one-time)
│   ├── Step 1: Set Username
│   ├── Step 2: Feature Tour
│   └── Step 3: Preferences Setup
│
├── Main Application (Authenticated)
│   ├── Dashboard (Home)
│   │   ├── Welcome Section
│   │   ├── Quick Actions
│   │   ├── Recent Activity
│   │   └── Feature Highlights
│   │
│   ├── [Domain-Specific Features]
│   │   └── (Template users add their features here)
│   │
│   ├── User Menu
│   │   ├── Profile
│   │   ├── Settings
│   │   │   ├── Account Settings
│   │   │   ├── Preferences
│   │   │   └── Language Selection
│   │   ├── Feedback (Quick Access)
│   │   └── Sign Out
│   │
│   └── Global Components
│       ├── Navigation (Sidebar/Header)
│       ├── Feedback Widget (Accessible anywhere)
│       └── Theme Toggle (Light/Dark)
│
└── Admin Panel (Authenticated + Admin Role)
    ├── User Management
    ├── System Stats
    └── Feedback Review
```

## Navigation Patterns

**Primary Navigation:**
- **Desktop:** Persistent sidebar with icon + label navigation
- **Mobile:** Collapsible hamburger menu or bottom tab bar
- **Pattern:** Core features always accessible, clear active state

**Secondary Navigation:**
- **User Menu:** Dropdown from avatar/name in header
- **Contextual:** In-page tabs or segmented controls for related views
- **Breadcrumbs:** For deep hierarchies (if needed)

**Navigation Principles:**
- **Consistency:** Same location and behavior across all pages
- **Clarity:** Labels match user mental models
- **Accessibility:** Keyboard navigable, screen reader friendly
- **Responsiveness:** Adapts to screen size without losing functionality

## Content Hierarchy

**Dashboard Priority:**
1. **Hero/Welcome** - Personalized greeting, primary CTA
2. **Quick Actions** - Most common tasks immediately accessible
3. **Recent Activity** - Context for returning users
4. **Empty States** - Helpful guidance when no data exists
5. **Feature Discovery** - Subtle prompts for unused capabilities

**Settings Priority:**
1. **Profile Information** - Name, email, username (most edited)
2. **Preferences** - Notifications, language, theme
3. **Account Management** - Password change, account deletion
4. **Advanced Options** - Less frequently accessed settings

---
