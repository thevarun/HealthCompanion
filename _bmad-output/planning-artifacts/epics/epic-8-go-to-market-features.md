# Epic 8: Go-To-Market Features

**Goal:** Pre-launch and growth infrastructure ready for product launches

## Story 8.1: Share/Referral Widget Component

As a **user who wants to share the product**,
I want **an easy way to share on social platforms**,
So that **I can spread the word with minimal effort**.

**Acceptance Criteria:**

**Given** the ShareWidget component
**When** I use it in any page
**Then** it displays share buttons for major platforms
**And** platforms include: Twitter/X, LinkedIn, Facebook, Copy Link
**And** buttons have recognizable platform icons

**Given** I click a social share button
**When** the share action triggers
**Then** platform's share dialog opens
**And** pre-filled text includes page title/description
**And** URL being shared is the current page (or specified URL)

**Given** I click "Copy Link"
**When** the action completes
**Then** URL is copied to clipboard
**And** I see confirmation feedback ("Copied!")
**And** feedback auto-dismisses after 2 seconds

**Given** the ShareWidget component props
**When** I review the API
**Then** component accepts: url, title, description (optional)
**And** component accepts: platforms (array to customize which buttons)
**And** component accepts: variant (inline, popup, minimal)

**Given** referral tracking needs
**When** share links are generated
**Then** optional referral code can be appended to URL
**And** format is ?ref=USER_CODE or similar
**And** referral tracking is opt-in per implementation

**Given** the ShareWidget on mobile
**When** I view on small screens
**Then** native share API is used if available
**And** fallback to platform buttons if not
**And** buttons are touch-friendly

---

## Story 8.2: Private Shareable URLs

As a **user who wants to share private content**,
I want **to generate secure, shareable links**,
So that **I can share content with specific people**.

**Acceptance Criteria:**

**Given** shareable content (e.g., a report, document)
**When** I click "Create Share Link"
**Then** a unique URL is generated
**And** URL contains a random, unguessable token
**And** URL is displayed with copy button

**Given** the shareable URL schema
**When** I review the database
**Then** table exists: shareable_links
**And** fields include: id, token, resource_type, resource_id, created_by
**And** fields include: expires_at, access_count, max_access, is_active

**Given** I create a share link
**When** I configure options
**Then** I can set expiration (never, 1 day, 7 days, 30 days)
**And** I can set max access count (optional)
**And** I can revoke the link later

**Given** someone accesses a share link
**When** the link is valid
**Then** they see the shared content
**And** access_count is incremented
**And** no authentication required (unless configured)

**Given** an expired or revoked link
**When** someone tries to access it
**Then** they see "This link has expired" message
**And** content is not displayed
**And** they may see option to request new link

**Given** share link management
**When** I view my shared links
**Then** I see list of links I've created
**And** I see access count, expiration status
**And** I can revoke any active link

---

## Story 8.3: Pre-Launch Landing Page & Waitlist

As a **product owner preparing to launch**,
I want **a landing page to capture interest**,
So that **I can build an audience before launch**.

**Acceptance Criteria:**

**Given** the pre-launch landing page
**When** I visit the root URL (before launch mode)
**Then** I see a compelling landing page
**And** page has headline, value proposition, visuals
**And** page has email capture form prominently displayed

**Given** the waitlist signup form
**When** I enter my email and submit
**Then** my email is saved to waitlist table
**And** I see confirmation "You're on the list!"
**And** optional: confirmation email is sent

**Given** the waitlist form
**When** I submit an invalid email
**Then** I see validation error
**And** form does not submit
**When** I submit an already-registered email
**Then** I see friendly message "You're already on the list!"

**Given** the waitlist database schema
**When** I review the table
**Then** waitlist table exists with: id, email, created_at
**And** optional fields: name, interests, referral_source
**And** email has unique constraint

**Given** admin access to waitlist
**When** I view admin waitlist page
**Then** I see list of all signups
**And** I see total count
**And** I can export to CSV
**And** I can see signup trends over time

**Given** launch mode toggle
**When** LAUNCH_MODE env var is set to "live"
**Then** landing page redirects to main app
**And** waitlist functionality is bypassed
**And** existing users can sign in normally

---

## Story 8.4: Social Proof Widgets

As a **visitor evaluating the product**,
I want **to see evidence of traction and trust**,
So that **I feel confident signing up**.

**Acceptance Criteria:**

**Given** the StatsCounter component
**When** I use it on landing page
**Then** it displays metrics like "500+ users", "10k+ messages"
**And** numbers can be static or fetched dynamically
**And** display includes labels and optional icons

**Given** the Testimonials component
**When** I use it on landing page
**Then** it displays customer quotes
**And** each testimonial shows: quote, name, title/company, avatar
**And** component supports carousel or grid layout

**Given** testimonial data
**When** I configure testimonials
**Then** data comes from config file or CMS
**And** format is: { quote, author, role, company, avatar }
**And** easy to add/edit testimonials

**Given** the TrustBadges component
**When** I use it on landing page
**Then** it displays trust indicators
**And** examples: "SOC 2 Compliant", "GDPR Ready", "99.9% Uptime"
**And** badges are visually consistent

**Given** social proof components
**When** I review the component library
**Then** components are in `src/components/marketing/`
**And** components are well-documented
**And** components follow design system

**Given** social proof on mobile
**When** I view on small screens
**Then** layouts adapt appropriately
**And** testimonial carousel is swipeable
**And** content remains readable

---

## Story 8.5: Changelog-to-Content Automation

As a **product owner releasing updates**,
I want **releases to automatically generate content**,
So that **I can communicate updates without manual effort**.

**Acceptance Criteria:**

**Given** a GitHub release is published
**When** the release event triggers
**Then** GitHub Action workflow runs
**And** workflow extracts release notes
**And** workflow prepares content for publishing

**Given** the changelog workflow
**When** I review .github/workflows/changelog.yml
**Then** workflow triggers on: release published
**And** workflow extracts: version, date, notes
**And** workflow formats content appropriately

**Given** release content generation
**When** workflow processes a release
**Then** content is formatted as markdown
**And** content includes: version number, date, changes
**And** content is suitable for blog/changelog page

**Given** content output options
**When** workflow completes
**Then** content is saved to docs/changelog/ or similar
**And** optionally: webhook is called (for n8n/Zapier)
**And** optionally: PR is created with new content

**Given** the changelog page
**When** I visit /changelog
**Then** I see list of releases
**And** releases are sorted newest first
**And** each entry shows version, date, changes
**And** page is auto-updated when new releases happen

**Given** minimal initial implementation
**When** I review the scope
**Then** basic workflow is functional
**And** LLM transformation is optional/future
**And** n8n integration is documented but not required

---

## Story 8.6: Programmatic SEO Infrastructure

As a **growth-focused product owner**,
I want **to generate SEO pages from data**,
So that **I can capture long-tail search traffic**.

**Acceptance Criteria:**

**Given** programmatic SEO needs
**When** I want to create data-driven pages
**Then** there is a pattern for dynamic route generation
**And** pattern uses Next.js dynamic routes
**And** pattern is documented with examples

**Given** a pSEO page template
**When** I create pages from data
**Then** route structure is /[category]/[slug] or similar
**And** pages are statically generated at build time
**And** pages have proper metadata (title, description, OG)

**Given** the pSEO data source
**When** I configure pages
**Then** data comes from JSON files in /data directory
**And** or data comes from API/database
**And** generateStaticParams is used for static generation

**Given** an example pSEO implementation
**When** I review the code
**Then** example exists in src/app/[locale]/(pseo)/
**And** example demonstrates: data loading, template, metadata
**And** example is well-commented for learning

**Given** pSEO pages in sitemap
**When** sitemap is generated
**Then** all pSEO pages are included
**And** pages have proper URLs and metadata
**And** sitemap scales to hundreds/thousands of pages

**Given** pSEO page content
**When** I view a generated page
**Then** content is unique and valuable (not thin)
**And** page passes basic SEO checks
**And** internal linking connects related pages

**Given** customization needs
**When** I want to create my own pSEO pages
**Then** documentation explains the pattern
**And** example template is easy to copy/modify
**And** data format is clearly specified

---
