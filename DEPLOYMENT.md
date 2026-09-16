# Deployment Guide — Agently Homeflow

## Architecture
- Frontend: Vercel (React + Vite)
- Backend: Cloudflare Workers (Hono)
- DB: Cloudflare D1
- Storage: Cloudflare R2
- Cache: Cloudflare KV

## Prerequisites
- Node.js 20+
- Wrangler CLI: `npm install -g wrangler` or `npx wrangler`
- Cloudflare account
- Vercel account

## 1. Cloudflare Setup

### Login
```bash
npx wrangler login
```

### Create D1 Database
```bash
npx wrangler d1 create agently-homeflow-db --location=weur
```
Copy `database_id` to `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "agently-homeflow-db"
database_id = "<your-id>"
```

### Create R2 Bucket
```bash
npx wrangler r2 bucket create agently-homeflow-storage
```

### Create KV Namespace
```bash
npx wrangler kv namespace create CACHE
# And for preview:
npx wrangler kv namespace create CACHE --preview
```
Copy IDs to `wrangler.toml`.

### Set Secrets / Variables
Via dashboard (Workers → agently-homeflow-api → Settings → Variables):
- `JWT_SECRET`: 32+ char random (e.g., `openssl rand -hex 32`)
- `ENVIRONMENT`: `production`
- `FRONTEND_URL`: `https://agently-homeflow.vercel.app`

Or via CLI:
```bash
npx wrangler secret put JWT_SECRET
```

### Run Migrations
```bash
# Local
npx wrangler d1 execute agently-homeflow-db --local --file=./worker/schema.sql

# Production
npx wrangler d1 execute agently-homeflow-db --remote --file=./worker/schema.sql
```

### Deploy Worker
```bash
npm run deploy:worker
# or
npx wrangler deploy
```

### Verify
```bash
curl https://agently-homeflow-api.<subdomain>.workers.dev/api/health
```

### Seed (Production)
```bash
curl -X POST https://agently-homeflow-api.<subdomain>.workers.dev/api/seed -H "X-Seed-Secret: <JWT_SECRET>"
```

## 2. Vercel Setup

### Link Project
```bash
vercel link
```

### Environment Variables (Vercel Dashboard)
- `VITE_API_URL`: `https://agently-homeflow-api.<subdomain>.workers.dev`
- `VITE_ENVIRONMENT`: `production`

### Deploy
```bash
vercel --prod
# or
npm run deploy:frontend
```

### SPA Routing
`vercel.json` already configured with rewrites to `index.html`.

## 3. Local Development (Full Stack)

```bash
# Install
npm install

# Env
cp .env.example .env
# VITE_API_URL=http://localhost:8787

# Terminal 1: Worker
npm run dev:api
# → http://localhost:8787

# Terminal 2: Frontend
npm run dev
# → http://localhost:8080

# Seed local
npm run db:migrate
npm run db:seed
# or curl
curl -X POST http://localhost:8787/api/seed -H "X-Seed-Secret: agently-super-secret-jwt-key-change-in-production-32chars!"
```

## 4. Testing

### Backend
```bash
curl http://localhost:8787/api/health
curl -X POST http://localhost:8787/api/auth/login -H "Content-Type: application/json" -d '{"email":"owner@agently.com","password":"owner123"}'
```

### Frontend
- Open http://localhost:8080
- Login as owner@agently.com / owner123
- Test Properties, Tenants, Payments, etc.

## 5. Production Checklist

- [ ] D1 database created and migrated
- [ ] R2 bucket created
- [ ] KV namespace created
- [ ] JWT_SECRET set (32+ chars, not default)
- [ ] Worker deployed and health check passes
- [ ] Production seed run
- [ ] Vercel env vars set (VITE_API_URL)
- [ ] Frontend deployed and can login
- [ ] CORS: FRONTEND_URL matches Vercel URL
- [ ] Test all roles: owner, manager, tenant, realtor, contractor, accountant, admin
- [ ] Test file uploads (R2)
- [ ] Check analytics endpoints
- [ ] Verify robots.txt and sitemap.xml accessible

## 6. Rollback

### Worker
```bash
npx wrangler deployments list
npx wrangler rollback <deployment-id>
```

### Frontend
Vercel Dashboard → Deployments → Rollback

### Database
D1 has no automatic rollback — backup via:
```bash
npx wrangler d1 export agently-homeflow-db --remote --output=backup.sql
```

## 7. Monitoring

- Cloudflare Dashboard → Workers → Metrics (requests, errors, CPU)
- Vercel Dashboard → Analytics (Web Vitals, traffic)
- D1 Dashboard → Metrics (queries, storage)
- R2 Dashboard → Metrics (storage, requests)

## 8. Cost Awareness

- Workers: 100k requests/day free, then $5 per 10M
- D1: 5GB storage, 5M reads/day free
- R2: 10GB storage, 10M reads/month free
- KV: 1GB, 100k reads/day free
- Vercel: 100GB bandwidth free

Optimize:
- Cache analytics in KV (5min TTL)
- Use R2 for images, not D1
- Batch D1 queries where possible
- Frontend: code splitting, lazy charts

## 9. Troubleshooting

**API 401 Unauthorized:**
- Check token in localStorage.agently_token
- Verify JWT_SECRET same across deploys
- Token expiry 7 days — re-login

**CORS error:**
- Check FRONTEND_URL in Worker env
- Check VITE_API_URL in frontend env
- Worker CORS allows vercel.app, e2b.app, localhost

**D1 table not found:**
- Run migrations: `npx wrangler d1 execute ... --file=./worker/schema.sql --remote`

**R2 upload fails:**
- Check bucket binding in wrangler.toml
- Check file size <10MB

**Frontend blank:**
- Check VITE_API_URL reachable
- Check browser console for API_UNAVAILABLE fallback

## 10. Future Enhancements (Queues, Durable Objects)

- **Queues:** For email notifications, report generation
  ```toml
  [[queues.producers]]
  binding = "NOTIFICATION_QUEUE"
  queue = "notifications"
  ```
- **Durable Objects:** For real-time collaboration (property editing)
- **Cron:** For daily rent reminders, overdue checks
  ```toml
  [triggers]
  crons = ["0 9 * * *"] # Daily 9am
  ```
