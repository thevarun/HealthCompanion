# The Change

## Problem Statement

Health coaches provide valuable expertise through 1-on-1 sessions, but this model limits reach and requires synchronous availability. Many people need health coaching guidance but cannot access or afford traditional coaching services. The health coach's expertise is currently locked in their individual practice with no way to scale their knowledge and impact.

**Core challenges:**
- Health coach can only serve clients during live sessions (time-bound)
- Knowledge and proven methodologies not accessible 24/7
- No digital offering to complement or scale the practice
- Potential clients seeking health guidance have limited access options
- Coach's specialized workflows and frameworks remain manual

## Proposed Solution

Build **HealthCompanion** - an AI-powered health coaching SaaS application that digitizes the health coach's expertise into an always-available, interactive platform.

**Solution approach:**
1. **AI Chat Interface**: Users interact with an AI health coach powered by the actual coach's knowledge base and methodologies
2. **Knowledge Base**: Capture health coach's expertise, frameworks, and guidance in Dify's knowledge system
3. **Guided Workflows**: Specific health coaching workflows (goal setting, habit tracking, nutrition planning, etc.) that users can initiate through chat
4. **SaaS Model**: Subscription-based access, allowing the coach to scale impact beyond 1-on-1 sessions

**Technical implementation:**
- Start with proven SaaS boilerplate (faster to market)
- Replace Clerk auth with Supabase for unified backend
- Use Dify Cloud to handle all AI complexity (knowledge base, chat, workflows)
- Integrate Assistant-UI for polished chat experience
- Focus on MVP: chat + knowledge base + basic workflows

## Scope

**In Scope:**

✅ **Core MVP Features:**
- User authentication (signup, login, session management via Supabase)
- AI-powered chat interface with health coach persona
- Knowledge base populated with health coach's expertise (managed in Dify)
- User-triggered workflows for common health coaching activities
- Chat history and conversation continuity
- Responsive web application (desktop, tablet, mobile browsers)

✅ **Technical Infrastructure:**
- SaaS boilerplate setup and Clerk → Supabase migration
- Supabase Auth integration with Next.js
- Dify Cloud setup (agent, knowledge base, workflows)
- Backend proxy for secure Dify API access
- Assistant-UI chat component integration
- Basic user profiles and preferences (stored in Supabase DB)
- Development environment with Docker
- Deployment pipeline to Vercel

✅ **5 User Stories:**
1. Replace Clerk authentication with Supabase Auth
2. Create backend proxy for Dify integration
3. Build chat interface with Assistant-UI
4. Set up Dify knowledge base with health coach content
5. Implement user-triggered workflows

**Out of Scope:**

❌ **Future Features (Post-MVP):**
- Journal/diary functionality
- Mobile native apps (iOS, Android)
- Progress tracking and analytics dashboards
- Goal setting and habit tracking modules
- Nutritional logging features
- Integration with wearables or health devices
- Community features or peer connections
- Payment processing and subscription management (beyond basic setup)
- Advanced personalization and user profiling
- Multi-language support (English only for MVP)
- Admin dashboard for the health coach
- Content management system for updating knowledge base

❌ **Technical Items Deferred:**
- Custom RAG implementation with Supabase vector DB (Dify handles this)
- Advanced caching or performance optimization
- Multi-tenancy or white-labeling
- Advanced analytics and monitoring beyond basic Sentry
- Custom AI model training or fine-tuning

---
