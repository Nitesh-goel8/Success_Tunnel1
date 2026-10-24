# Success Tunnel — Production & Vercel Deployment Guide

This guide describes how to deploy the Success Tunnel application to **Vercel** with a production **PostgreSQL** database (e.g., Neon, Supabase, AWS RDS, or standard PostgreSQL).

---

## 1. Prerequisites

1. A Vercel account ([vercel.com](https://vercel.com))
2. A managed PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres)
3. GitHub repository access to `Nitesh-goel8/Success_Tunnel1`

---

## 2. Environment Variables Checklist

Configure these environment variables in your Vercel Project Settings (**Settings → Environment Variables**):

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `DATABASE_URL` | Production PostgreSQL connection URL with SSL enabled | `postgresql://user:pass@ep-xyz.neon.tech/successtunnel?sslmode=require` |
| `JWT_SECRET` | 32+ byte cryptographic random secret for signing sessions | Generate via `openssl rand -base64 32` |
| `ADMIN_NAME` | Initial Super Administrator display name | `Super Administrator` |
| `ADMIN_EMAIL` | Super Administrator login email | `admin@successtunnel.in` |
| `ADMIN_PASSWORD` | Strong initial admin password | Strong random password (12+ chars) |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_SITE_URL` | Primary production domain | `https://successtunnel.in` |
| `NEXT_PUBLIC_APP_URL` | Public base application URL | `https://successtunnel.in` |
| `NEXT_PUBLIC_APP_NAME` | Application title | `Success Tunnel ERP` |
| `ENQUIRY_NOTIFICATION_EMAIL`| Destination inbox for website enquiries | `admin@successtunnel.in` |

---

## 3. Database Migration for Production (PostgreSQL)

Before triggering the first production build on Vercel, push the schema to your PostgreSQL database:

```bash
cd successtunnel_app

# 1. Ensure DATABASE_URL in your local or deployment terminal points to your production PostgreSQL
export DATABASE_URL="postgresql://user:pass@ep-xyz.neon.tech/successtunnel?sslmode=require"

# 2. Push PostgreSQL schema
npx prisma db push --schema=prisma/schema.prisma

# 3. Generate Prisma client
npx prisma generate --schema=prisma/schema.prisma

# 4. (Optional) Run initial seed
npm run seed
```

---

## 4. Vercel Project Build Configuration

In Vercel **Project Settings → General**:

- **Framework Preset:** `Next.js`
- **Root Directory:** `successtunnel_app`
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 5. Security & Cookie Hardening

In production (`NODE_ENV=production`):
- All session cookies (`st_auth`) are stamped with `HttpOnly; Path=/; SameSite=Lax; Secure`.
- In-memory rate limiting throttles authentication endpoints (`/api/portal/auth/login`) to 10 attempts per minute per IP.
- Public contact form (`/api/enquiries`) is protected by honeypot verification and 5 submissions per 15 minutes rate limit.
- Administrative portals (`/portal/audit-logs`, `/portal/finance`) are guarded by strict role-based authorization.

---

## 6. Post-Deployment Smoke Test Checklist

- [ ] Open `https://successtunnel.in` and verify Homepage renders without console errors.
- [ ] Visit `https://successtunnel.in/services` and verify all 6 service hubs load.
- [ ] Visit `https://successtunnel.in/projects` and check that public project case studies render without exposing internal budgets or client IDs.
- [ ] Submit a test enquiry at `https://successtunnel.in/contact` and verify it responds with HTTP 201.
- [ ] Log in at `https://successtunnel.in/portal/login` with your administrator credentials.
- [ ] Check `https://successtunnel.in/portal/crm` to confirm the test enquiry appears in the CRM lead pipeline.
- [ ] Inspect `https://successtunnel.in/portal/dashboard` to verify KPI cards and task velocity charts reflect database aggregates.
- [ ] Test CSV export at `https://successtunnel.in/portal/reports`.
- [ ] Verify `https://successtunnel.in/robots.txt` disallows `/portal/` and `/admin/`.
- [ ] Verify `https://successtunnel.in/sitemap.xml` is accessible and valid XML.
