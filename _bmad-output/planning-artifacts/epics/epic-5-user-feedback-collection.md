# Epic 5: User Feedback Collection

**Goal:** Users can easily share feedback; admins can review and manage submissions

## Story 5.1: Feedback Database Schema

As a **developer implementing feedback collection**,
I want **a database schema for storing feedback**,
So that **user feedback is persisted and queryable**.

**Acceptance Criteria:**

**Given** the database schema
**When** I review the feedback table definition
**Then** table exists in the project schema (e.g., `vt_saas.feedback`)
**And** table has id (uuid, primary key)
**And** table has message (text, required)
**And** table has type (enum: bug, feature, praise)
**And** table has user_id (uuid, nullable - for anonymous)
**And** table has user_email (text, nullable - for anonymous)
**And** table has status (enum: pending, reviewed, archived)
**And** table has created_at (timestamp)
**And** table has reviewed_at (timestamp, nullable)

**Given** the Drizzle schema
**When** I review `src/models/Schema.ts`
**Then** feedback table is defined with proper types
**And** enums are defined for type and status
**And** relations to users table (optional) are defined

**Given** the migration
**When** I run `npm run db:generate`
**Then** migration is created for feedback table
**And** migration applies successfully
**And** table is created in database

**Given** the feedback schema
**When** I query the table
**Then** indexes exist on user_id, status, created_at
**And** queries are performant

---

## Story 5.2: Feedback Widget Component

As a **user who wants to share feedback**,
I want **an easily accessible feedback widget**,
So that **I can quickly share my thoughts from any page**.

**Acceptance Criteria:**

**Given** any page in the application
**When** I look for feedback option
**Then** I see a floating feedback button (bottom-right corner)
**And** button has a recognizable icon (speech bubble or similar)
**And** button doesn't obstruct important content

**Given** I click the feedback button
**When** the modal opens
**Then** I see a feedback form
**And** form has a message textarea
**And** form has type selection (Bug, Feature Request, Praise)
**And** form has a submit button
**And** modal can be closed with X or clicking outside

**Given** I am logged in
**When** I open the feedback form
**Then** my email is pre-filled (or associated automatically)
**And** I don't need to enter contact info

**Given** I am not logged in
**When** I open the feedback form
**Then** I see an optional email field
**And** I can submit anonymously or with email

**Given** the feedback form
**When** I select a feedback type
**Then** each type has a clear label and optional description
**And** selection is visually indicated
**And** default type is "Feature Request" or none

**Given** the feedback widget on mobile
**When** I view it on small screens
**Then** button is still visible but appropriately sized
**And** modal is full-screen or properly sized for mobile
**And** form is usable with touch keyboard

---

## Story 5.3: Feedback Submission API

As a **user submitting feedback**,
I want **my feedback saved reliably**,
So that **the team receives my input**.

**Acceptance Criteria:**

**Given** a valid feedback submission
**When** I submit the form
**Then** POST request is sent to `/api/feedback`
**And** feedback is saved to database
**And** I see a success message "Thanks for your feedback!"
**And** modal closes automatically

**Given** the feedback API endpoint
**When** I review the implementation
**Then** endpoint validates message (required, max length)
**And** endpoint validates type (must be valid enum)
**And** endpoint accepts optional user_id or email
**And** endpoint returns 201 on success

**Given** an authenticated user submits feedback
**When** the request is processed
**Then** user_id is automatically attached
**And** feedback is linked to their account

**Given** an anonymous user submits feedback
**When** they provide an email
**Then** email is stored with the feedback
**And** email is validated for format

**Given** validation errors
**When** submission is invalid
**Then** 400 response with field-level errors
**And** errors follow standard API error format
**And** user sees helpful error messages

**Given** the feedback submission
**When** I submit the form
**Then** I see loading state on submit button
**And** double-submission is prevented
**And** form resets after successful submission

---

## Story 5.4: Feedback Admin List View

As an **admin reviewing feedback**,
I want **to see all feedback submissions in one place**,
So that **I can understand user needs and issues**.

**Acceptance Criteria:**

**Given** I am an admin user
**When** I navigate to the admin feedback page
**Then** I see a list of all feedback submissions
**And** list is sorted by newest first (default)
**And** list shows: type, message preview, user/email, date, status

**Given** the feedback list
**When** I view it
**Then** I can filter by type (Bug, Feature, Praise, All)
**And** I can filter by status (Pending, Reviewed, Archived, All)
**And** filters update the list without page reload

**Given** a feedback item in the list
**When** I view the preview
**Then** I see the first ~100 characters of the message
**And** I see the feedback type with color coding
**And** I see relative timestamp ("2 hours ago")
**And** I see user email or "Anonymous"

**Given** I click on a feedback item
**When** the detail view opens
**Then** I see the full message
**And** I see all metadata (type, user, date, status)
**And** I can take actions (mark reviewed, delete)

**Given** the admin feedback page
**When** I access it as non-admin
**Then** I am redirected to dashboard
**And** I see "Access denied" or similar message

**Given** the feedback list is empty
**When** no feedback exists
**Then** I see an empty state
**And** message indicates no feedback yet

---

## Story 5.5: Feedback Admin Actions

As an **admin managing feedback**,
I want **to take actions on feedback items**,
So that **I can track what's been reviewed and export data**.

**Acceptance Criteria:**

**Given** a pending feedback item
**When** I click "Mark as Reviewed"
**Then** status changes to "reviewed"
**And** reviewed_at timestamp is set
**And** UI updates to reflect new status
**And** I see confirmation toast

**Given** a feedback item
**When** I click "Delete"
**Then** I see a confirmation dialog
**And** dialog warns about permanent deletion
**And** on confirm, item is deleted from database
**And** list updates to remove the item

**Given** I click "Archive"
**When** I archive a feedback item
**Then** status changes to "archived"
**And** item remains in database but hidden by default
**And** I can filter to see archived items

**Given** the feedback admin page
**When** I click "Export CSV"
**Then** a CSV file is downloaded
**And** file contains: id, type, message, email, status, created_at, reviewed_at
**And** filename includes date (e.g., feedback-2024-01-15.csv)

**Given** filters are active
**When** I export CSV
**Then** only filtered results are exported
**And** export reflects current filter state

**Given** bulk actions
**When** I select multiple feedback items
**Then** I can mark all as reviewed
**And** I can delete all selected
**And** confirmation is required for bulk actions

---
