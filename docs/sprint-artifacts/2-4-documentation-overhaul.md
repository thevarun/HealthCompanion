# Story 2.4: documentation-overhaul

Status: ready-for-dev

## Story

As a developer joining the HealthCompanion project,
I want accurate, project-specific documentation that reflects the current codebase,
so that I can quickly understand the architecture, set up my environment, and contribute effectively without being misled by generic boilerplate content.

## Acceptance Criteria

### README.md Complete Replacement
1. **Project Overview** - README accurately describes HealthCompanion as an AI-powered health coaching application (not generic SaaS template)
2. **Feature List** - Features section lists actual implemented functionality: AI chat (Dify), Supabase auth, i18n support (en, hi, bn), responsive design
3. **Tech Stack** - Accurate stack documentation: Next.js 14, Supabase, Dify, PostgreSQL, Drizzle ORM, Assistant UI
4. **Prerequisites** - Clear prerequisites list: Node.js 20+, PostgreSQL/PGlite, Supabase account, Dify API key
5. **Installation Steps** - Step-by-step setup instructions specific to HealthCompanion (not generic template)
6. **Environment Variables** - Complete list of required env vars with descriptions: Supabase keys, Dify API, Database URL
7. **Development Commands** - All relevant npm scripts documented: dev, test, test:e2e, db:studio, lint, build
8. **Deployment Guide** - Vercel deployment instructions included
9. **Architecture Link** - Links to docs/architecture.md for detailed system design
10. **Testing Documentation** - How to run tests and coverage requirements
11. **Boilerplate Removal** - All boilerplate content removed: sponsor tables, generic screenshots, template marketing, Creative Designs Guru attribution, react-saas.com links
12. **Conciseness** - README is focused and actionable (target <200 lines vs current 573)

### Tech-Spec Validation
13. **Completeness Check** - Existing tech-spec (docs/tech-spec/) accurately covers Epic 2 scope and all 4 stories
14. **Story Breakdown Accuracy** - All story requirements match actual implementation (Stories 2.1, 2.2, 2.3 complete)
15. **Update if Needed** - If implementation deviated from spec, update tech-spec to reflect reality

### Optional Documentation Updates
16. **Architecture.md Review** - Review docs/architecture.md for accuracy after Story 2.2 removals (organization, todos, Stripe references)
17. **CLAUDE.md Update** - Update CLAUDE.md if significant architecture changes occurred (verify Supabase auth flow, Dify integration, removed features)
18. **Source Tree Analysis** - Consider updating docs/source-tree-analysis.md to reflect deleted files/directories from Story 2.2

### Documentation Quality
19. **No Broken Links** - All internal documentation links work correctly
20. **Consistent Terminology** - Consistent naming: "HealthCompanion" (not "SaaS Template"), "Supabase" (not "Clerk"), "Dify" as AI provider
21. **Developer-First Tone** - Documentation is technical, clear, and actionable (not marketing-focused)
22. **Code Examples** - Where relevant, include accurate code snippets (env var examples, npm commands)

## Tasks / Subtasks

- [ ] **Create New README.md** (AC: #1-12) - ~1.5 hours
  - [ ] Delete existing README.md (save as README.old.md for reference)
  - [ ] Create new README.md with structure:
    - [ ] Project title and tagline
    - [ ] Overview section (what HealthCompanion does)
    - [ ] Features section (AI chat, auth, i18n, responsive design)
    - [ ] Tech Stack table (Frontend: Next.js 14, React 18, TypeScript, Tailwind | Backend: PostgreSQL, Drizzle ORM | Auth: Supabase | AI: Dify | Deployment: Vercel)
    - [ ] Prerequisites section (Node.js 20+, PostgreSQL or PGlite, Supabase account, Dify API key)
  - [ ] Write Installation section:
    - [ ] Clone repository command
    - [ ] npm install
    - [ ] Copy .env.example to .env.local
    - [ ] Configure environment variables (detailed below)
    - [ ] Run database migrations (npm run db:migrate for Edge, auto-applies otherwise)
    - [ ] Start dev server (npm run dev)
  - [ ] Write Environment Variables section:
    - [ ] Table format with Variable | Description | Required/Optional
    - [ ] NEXT_PUBLIC_SUPABASE_URL - Supabase project URL (Required)
    - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon key (Required)
    - [ ] SUPABASE_SERVICE_ROLE_KEY - Admin API access (Required for E2E tests)
    - [ ] DIFY_API_URL - Dify API endpoint (Required, e.g., https://api.dify.ai/v1)
    - [ ] DIFY_API_KEY - Dify API authentication (Required, server-side only)
    - [ ] DATABASE_URL - PostgreSQL connection string (Required for production)
    - [ ] SENTRY_DSN - Error monitoring (Optional)
    - [ ] Note: Never commit .env.local to git
  - [ ] Write Development section:
    - [ ] npm run dev - Start dev server with Spotlight
    - [ ] npm run dev:next - Start Next.js only
    - [ ] npm test - Run unit tests (Vitest)
    - [ ] npm run test:e2e - Run E2E tests (Playwright)
    - [ ] npm run db:studio - Open Drizzle Studio (database GUI)
    - [ ] npm run lint - Run ESLint
    - [ ] npm run lint:fix - Auto-fix linting issues
    - [ ] npm run check-types - TypeScript type checking
    - [ ] npm run build - Production build
    - [ ] npm start - Start production server
  - [ ] Write Deployment section:
    - [ ] Vercel deployment steps (connect GitHub repo, configure env vars, deploy)
    - [ ] Note: Next.js 14 App Router compatible with Vercel
    - [ ] Database: Use Supabase or any PostgreSQL provider
    - [ ] Environment variables must be configured in Vercel dashboard
  - [ ] Write Architecture section:
    - [ ] Brief overview: Monolithic Next.js app with App Router
    - [ ] Key patterns: Server Components for SSR, Client Components for interactivity, Middleware for auth/i18n
    - [ ] Link to docs/architecture.md for detailed system design
  - [ ] Write Testing section:
    - [ ] Unit tests: Vitest (co-located with source files)
    - [ ] E2E tests: Playwright (tests/e2e/)
    - [ ] Test account setup: See tests/e2e/setup.ts for E2E test configuration
    - [ ] Coverage: Critical user flows (auth, chat, landing, dashboard)
  - [ ] Write Contributing section (if applicable):
    - [ ] Use npm run commit for Conventional Commits
    - [ ] Run lint and tests before committing
    - [ ] Husky enforces pre-commit hooks
  - [ ] Write License section (if applicable)
  - [ ] Verify no boilerplate content remains (sponsor tables, screenshots, template links)

- [ ] **Validate Tech-Spec Accuracy** (AC: #13-15) - ~30 minutes
  - [ ] Read complete docs/tech-spec/ directory (all .md files)
  - [ ] Cross-reference with completed stories:
    - [ ] Story 2.1 (UX Enhancements) - Check actual implementation vs spec
    - [ ] Story 2.2 (Architecture Simplification) - Verify all deletions documented
    - [ ] Story 2.3 (E2E Test Suite) - Confirm test coverage matches spec
  - [ ] Identify any deviations between spec and reality
  - [ ] Update tech-spec files if significant discrepancies found:
    - [ ] the-change.md - Story scope accuracy
    - [ ] implementation-guide.md - Implementation steps accuracy
    - [ ] testing-approach.md - E2E test strategy matches Story 2.3 implementation
  - [ ] If no updates needed, document validation in story completion notes

- [ ] **Review and Update Core Documentation** (AC: #16-18) - ~45 minutes
  - [ ] Review docs/architecture.md:
    - [ ] Check for Stripe references (should be removed or marked as "ready but not implemented")
    - [ ] Verify organization/todo table references are accurate (tables removed in Story 2.2)
    - [ ] Confirm database schema section matches current src/models/Schema.ts
    - [ ] Update if outdated, skip if accurate
  - [ ] Review CLAUDE.md:
    - [ ] Verify authentication flow documentation (Supabase patterns)
    - [ ] Check chat/AI integration section (Dify proxy pattern accurate?)
    - [ ] Confirm database section (no organization/todo mentions)
    - [ ] Verify routing structure matches current app structure
    - [ ] Update environment variables section (remove Stripe, keep Dify + Supabase)
    - [ ] Update if needed
  - [ ] Review docs/source-tree-analysis.md:
    - [ ] Check if Story 2.2 deletions are reflected (sponsors/, billing/, etc.)
    - [ ] Consider regenerating if significantly outdated (use document-project workflow)
    - [ ] Update manually if minor corrections needed

- [ ] **Documentation Quality Assurance** (AC: #19-22) - ~30 minutes
  - [ ] Test all internal links in README.md (docs/architecture.md, etc.)
  - [ ] Verify all links in docs/index.md still valid
  - [ ] Search for inconsistent terminology:
    - [ ] "SaaS Template" → should be "HealthCompanion"
    - [ ] "Clerk" → should be "Supabase" (Epic 1 migration)
    - [ ] Any generic boilerplate language
  - [ ] Validate code examples (npm commands, env var syntax)
  - [ ] Ensure developer-first tone (no marketing fluff)
  - [ ] Spell check and grammar review

- [ ] **Validation & Commit** (All ACs) - ~15 minutes
  - [ ] Build project to ensure no documentation errors: npm run build
  - [ ] Run linter: npm run lint
  - [ ] Manual review: Read new README start to finish as if you're a new developer
  - [ ] Commit changes with conventional commit message
  - [ ] Update story status to "review" in sprint-status.yaml (Dev agent responsibility)

## Dev Notes

### Architecture Context

**Documentation Landscape:**
Current state of project documentation (post-Story 2.3):
- **README.md** - 573 lines of boilerplate marketing, generic template instructions (NEEDS COMPLETE REPLACEMENT)
- **docs/tech-spec/** - Comprehensive tech-spec created for Epic 2 (likely accurate, needs validation)
- **docs/architecture.md** - Generated by document-project workflow (may reference removed features)
- **docs/index.md** - Documentation index (comprehensive, likely accurate)
- **docs/project-overview.md, development-guide.md, deployment-guide.md** - Generated docs (should be accurate)
- **CLAUDE.md** - Claude Code integration guide (critical for AI-assisted dev, needs accuracy check)
- **CHANGELOG.md** - Version history (auto-updated by release workflow)

**Documentation Philosophy (from architecture.md):**
- Developer-first: Clear setup, no marketing
- Accuracy over completeness
- Living documents: Easy to update as project evolves

**Story 2.2 Impact on Documentation:**
Major changes that require documentation updates:
1. **Removed Features:** Sponsors, Billing/Stripe, Demo components, Organization/Todo tables
2. **Configuration Changes:** AppConfig name change ("SaaS Template" → "HealthCompanion"), Sentry config updates
3. **File Deletions:** 40+ files removed (sponsor assets, billing components, boilerplate marketing)
4. **Database Schema:** organization + todo tables removed, migration generated

**Story 2.1 Impact:**
1. **Internationalization:** French removed, Hindi + Bengali added (en, hi, bn locales)
2. **UX Changes:** Dashboard personalization, auth page polish, landing page auth state detection

### Project Structure Notes

**Documentation Files to Work With:**
```
HealthCompanion/
├── README.md                    # REPLACE COMPLETELY
├── CLAUDE.md                    # REVIEW & UPDATE
├── CHANGELOG.md                 # Keep as-is (auto-generated)
├── docs/
│   ├── index.md                 # Validate links
│   ├── architecture.md          # REVIEW for removed features
│   ├── project-overview.md      # Validate accuracy
│   ├── development-guide.md     # Likely accurate
│   ├── deployment-guide.md      # Likely accurate
│   ├── source-tree-analysis.md  # REVIEW for deleted files
│   └── tech-spec/               # VALIDATE completeness
│       ├── index.md
│       ├── the-change.md
│       ├── implementation-guide.md
│       └── [other spec files]
```

**README.md Target Structure:**
Based on tech-spec requirements, aim for ~150-200 lines:
1. Title + tagline (3 lines)
2. Overview (5 lines)
3. Features (5 bullets)
4. Tech Stack (table, ~15 lines)
5. Prerequisites (4 items)
6. Installation (8 steps)
7. Environment Variables (table, ~15 lines)
8. Development (10 commands with descriptions)
9. Deployment (5 lines)
10. Architecture (3 lines + link)
11. Testing (5 lines)
12. Contributing (3 lines)
13. License (1 line)

**Key Removals from Current README:**
- Sponsor tables and promotional content (Crowdin, Sentry, Arcjet logos)
- Generic template screenshots
- Boilerplate setup instructions (NextJS Boilerplate specific)
- "Creative Designs Guru" attribution
- Links to react-saas.com and template purchase pages
- Generic "Features" list (multi-tenancy, email templates, etc. - not implemented)
- Stripe setup instructions
- Clerk authentication references (replaced with Supabase in Epic 1)

### Testing Standards Summary

**Documentation Testing Approach:**
- **Link Validation:** All internal links must work (use IDE link checker or manual verification)
- **Code Example Verification:** Test any code snippets or commands (npm run commands, env var examples)
- **Build Validation:** Ensure documentation changes don't break build (unlikely but verify)
- **Terminology Consistency:** Search for old terms (Clerk, SaaS Template, etc.)

**No Automated Tests for Documentation:**
This story does not require test suite expansion. Focus on manual validation and accuracy.

### Learnings from Previous Story

**From Story 2.3 (E2E Test Suite) - Status: review**

**Test Infrastructure Created:**
- `tests/e2e/setup.ts` - Global setup using Supabase signUp (no admin API)
- `tests/e2e/teardown.ts` - Admin API cleanup
- `tests/e2e/helpers/fixtures.ts` - Authenticated page fixture
- 3 Page Object Models: AuthPage.ts, ChatPage.ts, DashboardPage.ts

**Test Coverage (13 E2E tests):**
1. **Auth Tests (5):** Sign-up, sign-in, sign-out, protected route redirects, session persistence
2. **Chat Tests (6):** Message sending, AI streaming (mocked /api/chat), conversation context, error handling, responsive design
3. **Landing Tests (5):** Logged-out/logged-in states, navigation, branding, no sponsor/demo badges
4. **Dashboard Tests (6):** Personalized greeting, clean navigation (no Members/Settings), chat navigation, responsive

**Key Implementation Insights:**
- **Mock Strategy:** Playwright route interception for /api/chat (deterministic SSE responses) - Document in README testing section
- **Auth Fixture:** Sets Supabase session cookies for authenticated tests - Useful for dev guide
- **Test Account:** Created in setup.ts, deleted via admin API in teardown.ts - Document in testing guide

**Architectural Validation from 2.3:**
- Confirmed clean codebase post-Story 2.2 (no sponsor badges, no dead nav links)
- Dashboard shows personalized greeting (user name/email from Supabase)
- Landing page correctly detects auth state (logged-in vs logged-out)
- Chat interface works with mocked Dify responses
- All tests pass: 0 lint errors, 10 warnings (conditional tests - acceptable)

**Documentation Implications:**
1. **README Testing Section:** Document E2E test setup (Supabase test project, no email verification)
2. **Tech-Spec Validation:** Story 2.3 implemented 13 tests (matches spec scope)
3. **CLAUDE.md Testing Patterns:** Add note about Playwright fixtures and mock strategies if relevant
4. **Architecture.md Testing:** E2E coverage is lightweight, pragmatic (not exhaustive)

**Files Modified in Story 2.3:**
- tests/e2e/Auth.e2e.ts (enhanced)
- tests/e2e/chat.spec.ts (rewrote with fixtures & mocks)
- tests/e2e/landing.spec.ts (created)
- tests/e2e/dashboard.spec.ts (created)

**Technical Debt from 2.3:**
- None affecting documentation. Tests are complete and passing.

**Story 2.3 Status Note:**
Currently in "review" status - not yet marked "done". Documentation should reflect current state (test suite exists and passes).

### References

**Primary Source Documents:**
- [Source: docs/tech-spec/the-change.md#Story-4-Documentation-Overhaul] - Complete story scope and requirements
- [Source: docs/tech-spec/index.md] - Tech-spec table of contents for validation
- [Source: docs/index.md] - Current documentation index (validate links)
- [Source: docs/architecture.md] - System architecture (review for removed features)
- [Source: CLAUDE.md] - Claude Code integration guide (review for accuracy)
- [Source: README.md] - Current boilerplate README (reference for what to remove)

**Story Dependencies:**
- **Story 2.1 (UX Enhancements):** Complete ✅ - Document new i18n locales (hi, bn), UX improvements
- **Story 2.2 (Architecture Simplification):** Complete ✅ - Document removed features, verify no boilerplate references remain
- **Story 2.3 (E2E Test Suite):** In Review ✅ - Document E2E test approach, coverage, setup

**Technical References:**
- [Next.js Documentation](https://nextjs.org/docs) - For accurate tech stack descriptions
- [Supabase Documentation](https://supabase.com/docs) - For auth setup instructions
- [Dify Documentation](https://docs.dify.ai) - For AI integration descriptions
- [Drizzle ORM Documentation](https://orm.drizzle.team) - For database migration instructions

**Documentation Standards:**
- [Conventional Commits](https://www.conventionalcommits.org/) - For commit message examples in README
- [Markdown Style Guide](https://google.github.io/styleguide/docguide/style.html) - For consistent formatting

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-12-24** - Story drafted in YOLO mode by SM agent (Bob). Ready for review and marking ready-for-dev.
