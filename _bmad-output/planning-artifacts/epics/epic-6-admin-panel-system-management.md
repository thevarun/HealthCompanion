# Epic 6: Admin Panel & System Management

**Goal:** Admins can manage users and monitor system health

## Story 6.1: Admin Role & Access Control

As a **product owner**,
I want **admin access controlled by a simple flag**,
So that **only authorized users can access admin features**.

**Acceptance Criteria:**

**Given** user roles
**When** I check if a user is admin
**Then** admin status is determined by user_metadata.isAdmin flag
**Or** admin status is determined by ADMIN_EMAILS env var list

**Given** the admin check implementation
**When** I review the code
**Then** there is a utility function `isAdmin(user)` or similar
**And** function checks both DB flag and env var fallback
**And** function is used consistently across admin features

**Given** a non-admin user
**When** they try to access `/admin/*` routes
**Then** middleware blocks the request
**And** user is redirected to dashboard
**And** they see "Access denied" message

**Given** an admin user
**When** they access `/admin/*` routes
**Then** access is granted
**And** admin content is displayed
**And** admin-specific navigation is visible

**Given** the environment variable approach
**When** ADMIN_EMAILS is set (e.g., "admin@example.com,owner@example.com")
**Then** users with those emails are treated as admins
**And** this works without database changes
**And** useful for initial setup before DB-based roles

**Given** the middleware protection
**When** admin routes are accessed
**Then** check happens at edge (middleware.ts)
**And** unauthorized requests never reach route handlers
**And** performance impact is minimal

---

## Story 6.2: Admin Layout & Navigation

As an **admin user**,
I want **a dedicated admin interface**,
So that **I can easily navigate admin features**.

**Acceptance Criteria:**

**Given** I am an admin accessing admin section
**When** I view any admin page
**Then** I see an admin-specific layout
**And** layout is distinct from regular user layout
**And** admin navigation is visible

**Given** the admin navigation
**When** I view the sidebar/menu
**Then** I see links to: Dashboard, Users, Feedback, Settings
**And** current page is highlighted
**And** navigation is collapsible on mobile

**Given** the admin header
**When** I view admin pages
**Then** I see "Admin" indicator clearly
**And** I can navigate back to main app
**And** my user avatar/menu is accessible

**Given** admin pages
**When** I navigate between them
**Then** transitions are smooth
**And** active state updates correctly
**And** breadcrumbs show current location (optional)

**Given** the admin layout on mobile
**When** I view on small screens
**Then** navigation collapses to hamburger menu
**And** content is properly responsive
**And** all features remain accessible

**Given** the admin route structure
**When** I review the code
**Then** admin routes are under `src/app/[locale]/(admin)/`
**And** layout is defined at route group level
**And** layout is self-contained (modular)

---

## Story 6.3: User Management List

As an **admin**,
I want **to see all users in the system**,
So that **I can find and manage user accounts**.

**Acceptance Criteria:**

**Given** I am on the admin users page
**When** the page loads
**Then** I see a list of all users
**And** list shows: email, username, signup date, status
**And** list is paginated (20 per page default)

**Given** the user list
**When** I look for search
**Then** I see a search input
**And** I can search by email or username
**And** search filters results in real-time or on submit

**Given** the user list
**When** I want to sort
**Then** I can sort by signup date (newest/oldest)
**And** I can sort by email alphabetically
**And** current sort is indicated visually

**Given** a user row in the list
**When** I view the row
**Then** I see their email
**And** I see their username (or "Not set")
**And** I see signup date (relative or formatted)
**And** I see status indicator (active, suspended)
**And** I see quick action buttons

**Given** pagination
**When** there are more than 20 users
**Then** I see pagination controls
**And** I can navigate between pages
**And** current page is indicated
**And** total user count is shown

**Given** the user list is empty
**When** no users exist (unlikely)
**Then** I see an appropriate empty state

---

## Story 6.4: User Detail & Actions

As an **admin**,
I want **to view user details and take actions**,
So that **I can manage individual accounts**.

**Acceptance Criteria:**

**Given** I click on a user in the list
**When** the detail view opens
**Then** I see full user information
**And** I see: email, username, display name, signup date
**And** I see: last login, email verified status
**And** I see: account status (active/suspended)

**Given** user detail view
**When** I look for actions
**Then** I see action buttons: Suspend, Delete, Reset Password
**And** actions are clearly labeled
**And** dangerous actions are visually distinct (red)

**Given** I click "Suspend User"
**When** user is currently active
**Then** I see confirmation dialog
**And** on confirm, user status changes to suspended
**And** suspended users cannot log in
**And** I see success confirmation

**Given** I click "Unsuspend User"
**When** user is currently suspended
**Then** I see confirmation dialog
**And** on confirm, user status changes to active
**And** user can log in again
**And** I see success confirmation

**Given** I click "Delete User"
**When** I confirm the action
**Then** I see a strong warning about permanence
**And** I must type user email to confirm
**And** on confirm, user and their data are deleted
**And** I am redirected to user list

**Given** I click "Reset Password"
**When** I confirm the action
**Then** password reset email is sent to user
**And** I see confirmation that email was sent
**And** user can use reset link to set new password

**Given** I am viewing my own admin account
**When** I look at actions
**Then** I cannot suspend or delete my own account
**And** self-destructive actions are disabled

---

## Story 6.5: System Metrics Dashboard

As an **admin**,
I want **to see key system metrics at a glance**,
So that **I can monitor the health of the application**.

**Acceptance Criteria:**

**Given** I am on the admin dashboard
**When** the page loads
**Then** I see key metrics displayed as cards
**And** metrics include: Total Users, New Signups (7d), Active Users (7d)
**And** metrics include: Pending Feedback, Error Count (if available)

**Given** each metric card
**When** I view it
**Then** I see the metric name
**And** I see the current value (large, prominent)
**And** I see trend indicator if applicable (+5% this week)
**And** design is clean and scannable

**Given** the Total Users metric
**When** I view it
**Then** I see count of all registered users
**And** count is accurate and real-time

**Given** the New Signups metric
**When** I view it
**Then** I see count of users registered in last 7 days
**And** I can optionally see daily breakdown

**Given** the Active Users metric
**When** I view it
**Then** I see count of users who logged in last 7 days
**And** metric is based on session/login data

**Given** the Pending Feedback metric
**When** I view it
**Then** I see count of unreviewed feedback
**And** clicking navigates to feedback page

**Given** the admin dashboard
**When** data is loading
**Then** I see skeleton loaders for each metric
**And** dashboard remains usable during loading

**Given** the dashboard layout
**When** I view on different screen sizes
**Then** metric cards reflow appropriately
**And** 4 columns on desktop, 2 on tablet, 1 on mobile

---

## Story 6.6: Admin Audit Logging

As a **product owner**,
I want **admin actions to be logged**,
So that **I have accountability and can troubleshoot issues**.

**Acceptance Criteria:**

**Given** an admin performs an action
**When** the action is: suspend user, delete user, reset password
**Then** an audit log entry is created
**And** entry includes: admin_id, action, target_user_id, timestamp
**And** entry includes: metadata (reason if provided)

**Given** the audit log schema
**When** I review the database
**Then** admin_audit_log table exists
**And** table has: id, admin_id, action, target_type, target_id, metadata, created_at
**And** appropriate indexes exist

**Given** the admin panel
**When** I look for audit log
**Then** I can access audit log from admin settings
**And** I see a list of recent admin actions
**And** list shows: action, admin, target, timestamp

**Given** the audit log list
**When** I view entries
**Then** I can filter by action type
**And** I can filter by date range
**And** I can filter by admin user

**Given** audit log entries
**When** I review them
**Then** entries are tamper-resistant (no edit/delete in UI)
**And** entries are retained for compliance period
**And** sensitive data is appropriately logged (no passwords)

**Given** the audit logging implementation
**When** I review the code
**Then** logging is done server-side only
**And** logging function is reusable: `logAdminAction(action, target, metadata)`
**And** logging failures don't break admin actions (graceful)

---
