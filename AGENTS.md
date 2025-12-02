# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router routes and API handlers; keep route folders kebab-case.
- `src/components` & `src/features`: Reusable UI primitives and domain-specific bundles; prefer co-locating styles and tests nearby.
- `src/libs`, `src/utils`, `src/hooks`: Shared helpers, client/server SDK wrappers, and custom hooks.
- `src/styles`, `components.json`, `tailwind.config.ts`: Design tokens and Shadcn/Tailwind setup.
- `src/locales`: next-intl translations; update keys alongside feature work.
- `migrations` & `drizzle.config.ts`: Database schema and Drizzle migrations.
- `tests/integration`, `tests/e2e`: Vitest + React Testing Library and Playwright suites. Static assets live in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js with live reload on http://localhost:3000.
- `npm run build` / `npm start`: Production build and serve.
- `npm run lint` / `npm run lint:fix`: ESLint (Antfu + Next + Tailwind rules), optional auto-fix.
- `npm run check-types`: TypeScript noEmit type check.
- `npm test`: Vitest run (unit/integration); fails on console errors by default.
- `npm run test:e2e`: Playwright E2E against the built app; ensure server is running or use `npx playwright install` first.
- `npm run storybook` / `npm run storybook:build`: Isolated component dev and static build.
- `npm run db:generate`, `npm run db:migrate`, `npm run db:studio`: Drizzle schema generation, migrations, and UI studio (requires env vars).
- `npm run clean`: Remove build artifacts (`.next`, `out`, `coverage`).

## Coding Style & Naming Conventions
- Language: TypeScript; prefer functional components and server components when possible.
- Imports: use `@/...` absolute paths; group and sort imports (simple-import-sort). React hooks start with `use*`; components in `PascalCase.tsx`; utilities/helpers in `camelCase.ts`.
- Styling: Tailwind-first; keep component-level styles close to components; favor Shadcn primitives for consistency.
- Formatting: ESLint drives formatting; run `npm run lint:fix` before pushes. Follow 2-space indentation and trailing commas where ESLint applies.

## Testing Guidelines
- Place Vitest specs next to code or under `tests/integration`; name files `*.test.ts(x)`.
- Prefer React Testing Library for components; avoid shallow renders; assert user-visible behavior.
- Playwright specs live in `tests/e2e`; record screenshots when UI changes and note them in PRs.
- Keep new code covered; add regression tests for reported bugs. Use `vitest --coverage` when touching critical paths.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (commitlint enforced). Use `npm run commit` (Commitizen) to stay compliant.
- Pre-commit hooks (husky + lint-staged) run linting/tests on staged files; ensure a clean pass.
- PRs should include: clear summary, linked issue, screenshots/gifs for UI changes, notes on migrations or feature flags, and test results (`npm test`, `npm run test:e2e` when relevant).
- Target `main`; keep PRs small and focused. If adding migrations, mention expected data impacts and rollback steps.

## Security & Configuration Tips
- Secrets live in `.env.local` (never commit); use T3 Env schema for new variables and update `.env.example` if present.
- Sentry and Clerk keys are required for error reporting/auth; provide dummy values for local dev when safe.
- When working with Drizzle migrations, back up data before running `npm run db:migrate` in shared environments.
