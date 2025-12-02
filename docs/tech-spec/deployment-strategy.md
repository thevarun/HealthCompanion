# Deployment Strategy

## Deployment Steps

**Production Deployment to Vercel:**

**1. Initial Setup (One-time):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

**2. Configure Environment Variables in Vercel:**
Via Vercel Dashboard or CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add DIFY_API_KEY production
vercel env add DIFY_API_URL production
vercel env add DATABASE_URL production
vercel env add SENTRY_DSN production
```

**3. Database Setup (Supabase):**
- Ensure Supabase project is in production mode
- Run migrations: `npm run db:migrate` against production DB
- Verify database connection from local

**4. Dify Configuration:**
- Ensure knowledge base is uploaded and indexed
- Test workflows in Dify playground
- Configure production API key

**5. Deploy to Vercel:**

**Option A: Automatic (via GitHub):**
```bash
git push origin main
# Vercel auto-deploys from main branch
```

**Option B: Manual (via CLI):**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

**6. Post-Deployment Verification:**
- [ ] Visit production URL, verify site loads
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Send test chat message
- [ ] Trigger test workflow
- [ ] Check Sentry for errors
- [ ] Verify analytics/monitoring active

**7. DNS Configuration (if custom domain):**
```bash
vercel domains add healthcompanion.com
vercel domains verify healthcompanion.com
# Update DNS records as instructed
```

## Rollback Plan

**If deployment fails or critical issues discovered:**

**Immediate Rollback (Vercel):**

**Option 1: Via Vercel Dashboard:**
1. Go to Vercel Dashboard → Project → Deployments
2. Find previous stable deployment
3. Click three dots → "Promote to Production"

**Option 2: Via CLI:**
```bash
# List recent deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

**Database Rollback (if needed):**

**If migrations caused issues:**
```bash
# Connect to production DB
psql $DATABASE_URL

# Rollback last migration
# (Drizzle doesn't have built-in rollback, manual SQL needed)

# Or restore from Supabase snapshot
# Via Supabase Dashboard → Database → Backups
```

**Dify Rollback:**
- Revert to previous knowledge base version (via Dify dashboard)
- Restore previous workflow configurations
- Rollback agent prompts/settings

**Communication Plan:**
- Post status update on status page (if using one)
- Notify users via email (if critical)
- Update team in Slack/Discord

**Investigation:**
- Check Sentry for error patterns
- Review Vercel deployment logs
- Analyze Supabase logs
- Check Dify API status

## Monitoring

**Error Tracking (Sentry):**

**Setup:**
```typescript
// Already configured in boilerplate
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

**Monitored Events:**
- API errors (500, 429, etc.)
- Authentication failures
- Dify API errors
- Database errors
- Client-side exceptions

**Alerts:**
- Email/Slack notification on critical errors
- Threshold alerts (>10 errors in 5 minutes)

**Application Performance (Vercel Analytics):**

**Metrics Tracked:**
- Page load times
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Core Web Vitals scores

**Dashboards:**
- Vercel Analytics dashboard (built-in)
- Custom metrics in Sentry Performance

**Infrastructure Monitoring:**

**Supabase:**
- Database performance (via Supabase dashboard)
- Connection pool usage
- Query performance
- Storage usage

**Dify:**
- API request volume
- Response times
- Error rates
- Knowledge base query performance

**Vercel:**
- Function execution times
- Edge network performance
- Bandwidth usage
- Build times

**Business Metrics:**

**Track via Custom Events:**
```typescript
// Analytics events to track
analytics.track('chat_message_sent', { userId, messageLength })
analytics.track('workflow_triggered', { userId, workflowId })
analytics.track('user_signed_up', { userId })
analytics.track('conversation_started', { userId })
```

**KPIs to Monitor:**
- Daily/Monthly active users
- Chat messages sent per user
- Workflow usage frequency
- Average conversation length
- User retention (7-day, 30-day)
- Sign-up conversion rate

**Logging Strategy:**

**Server-side (Pino):**
```typescript
logger.info('Chat message processed', {
  userId,
  messageLength,
  responseTime,
  difyLatency
})

logger.error('Dify API error', {
  userId,
  error: error.message,
  statusCode: error.response?.status
})
```

**Logs Storage:**
- Vercel logs (retained 7 days free tier)
- Consider log aggregation (Logflare, Datadog) for longer retention

**Alerting Rules:**

**Critical Alerts (Immediate Notification):**
- API error rate > 5% over 5 minutes
- Database connection failures
- Dify API unavailable
- Authentication system down

**Warning Alerts (Email Digest):**
- Response time > 3 seconds (95th percentile)
- High memory usage (> 80%)
- Increased error rates (> 1%)

**On-Call Rotation:**
- Define on-call schedule
- Set up PagerDuty or similar
- Document escalation procedures

---
