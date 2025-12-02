# Development Setup

**Prerequisites:**
- Node.js 20.x LTS
- Docker Desktop (for local database)
- Git
- Supabase account (free tier)
- Dify Cloud account (free tier)

**Initial Setup:**

```bash
# 1. Clone the SaaS boilerplate
git clone https://github.com/ixartz/SaaS-Boilerplate.git healthcompanion
cd healthcompanion

# 2. Remove Clerk and install Supabase
npm uninstall @clerk/nextjs
npm install @supabase/supabase-js@^2.39.0 @supabase/ssr@^0.1.0

# 3. Install new dependencies
npm install dify-client @assistant-ui/react

# 4. Set up local database
docker-compose up -d

# 5. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Dify credentials

# 6. Run database migrations
npm run db:generate
npm run db:migrate

# 7. Start development server
npm run dev
```

**Supabase Setup:**

1. Create new project on Supabase.com
2. Copy Project URL and Anon Key to `.env.local`
3. Enable Email Auth in Supabase Dashboard → Authentication → Providers
4. Configure email templates (optional)
5. Get database connection string for Drizzle

**Dify Setup:**

1. Create account on Dify.ai
2. Create new "Chat App" application
3. Copy API key to `.env.local`
4. Set up knowledge base (upload health coach content)
5. Configure agent persona and prompts
6. Create workflows in Dify workflow builder

**Development Commands:**

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:e2e     # Run Playwright tests
npm run db:studio    # Open Drizzle Studio (DB GUI)
docker-compose up    # Start local Postgres
docker-compose down  # Stop local Postgres
```

---
