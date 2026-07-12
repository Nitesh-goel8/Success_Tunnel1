# Success Tunnel Main Website

Success Tunnel is a Next.js + Prisma website for services, properties, blog content, education content, client accounts, and admin lead management.

## What's Included
- Public site with home, about, services, properties, blog, resources, contact, privacy, and terms pages
- Admin area for managing services, properties, blogs, education content, settings, enquiries, and payments
- API routes for enquiries, authentication, services, properties, payments, and admin analytics
- Prisma schema backed by PostgreSQL
- Vercel-ready deployment config at the repository root

## Quick Start

```bash
npm install --prefix successtunnel_app
npm run prisma:push
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## Production

- Run `npm run build` from the repository root before deploying.
- Vercel uses `vercel.json` to auto-detect whether it is running from the repo root or `successtunnel_app/`.
- The project targets Node.js `24.x`; set that in Vercel Project Settings as well.
- Set the production environment variables in Vercel before promoting the deployment.
- After deployment, verify `/`, `/admin/login`, `/sitemap.xml`, and `/robots.txt`.

## Setup Guide

Use `SETUP.md` for the full local, database, and deployment checklist.

## Environment Variables

The app expects values such as:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `ENQUIRY_NOTIFICATION_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
