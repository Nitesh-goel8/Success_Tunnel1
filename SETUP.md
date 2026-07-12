# Success Tunnel Setup

This guide covers local development and production deployment for the website.

## Requirements

- Node.js 18 or newer
- PostgreSQL database
- Git
- Vercel account for production

## Local Setup

1. Install dependencies from the repo root:

```bash
npm install --prefix successtunnel_app
```

2. Create `successtunnel_app/.env` from `successtunnel_app/.env.example`.

3. Point `DATABASE_URL` at your local PostgreSQL database.

4. Prepare the database:

```bash
npm run prisma:push
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Environment Variables

Set these in Vercel and in your local `.env` as needed:

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

## Production Deployment

1. Set the Vercel Node.js version to `24.x`.
2. Set `NEXT_PUBLIC_SITE_URL` to the live domain.
3. Use a managed PostgreSQL database for `DATABASE_URL`.
4. Add the rest of the environment variables in Vercel Project Settings.
5. Run a production build:

```bash
npm run build
```

6. Deploy to Vercel.
7. Verify the homepage, admin login, sitemap, and robots file.

## Helpful Commands

```bash
npm run prisma:generate
npm run prisma:push
npm run seed
npm run build
npm run dev
```

## Notes

- `vercel.json` already points Vercel at `successtunnel_app`.
- Keep `NEXT_PUBLIC_SITE_URL` aligned with the production domain.
- Re-run `npm run prisma:push` whenever the schema changes in a compatible way.
