# Success Tunnel Main Website

This repository contains the Success Tunnel website project. The main application lives in `successtunnel_app/` and is built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Current Project Status

### What is already built
- Public marketing site with pages for home, about, contact, services, blog, properties, resources, privacy, and terms.
- Dynamic service, property, and blog detail routes.
- Admin login and admin dashboard pages.
- Admin CRUD APIs for services, subservices, properties, blogs, enquiries, payments, and site settings.
- Education video CMS for publishing direct-file learning videos from the admin dashboard.
- Prisma schema with models for users, services, subservices, blog posts, properties, enquiries, rental payments, and site settings.
- Lead capture flow that validates and stores enquiries in the database.
- Rental payment flow wired to Razorpay order creation and signature verification.
- Basic client portal routes for signup, login, dashboard, and invoice pages.
- Seed data and fallback content so the app can render even when the database is incomplete.

### What is partially implemented
- Premium homepage and main service experience are more polished than the rest of the site.
- Admin dashboard statistics and charts are present, but depend on real data quality.
- Chat assistant exists as a simple keyword-based knowledge API, not a real AI-backed assistant.
- Settings management exists, but many brand and business values are still placeholders.

### What is still missing or should be improved
- Real business content has not fully replaced sample content and fallback data.
- SMTP/email notifications for enquiries are not implemented yet.
- Spam protection, rate limiting, and stronger cookie/security hardening are still needed.
- SEO essentials like sitemap, robots, structured data, and page-level metadata need a proper pass.
- Blog, property, and some service pages still need visual consistency and content cleanup.
- `.env.example` previously contained sensitive-looking values and has been sanitized.

## Repo Structure

```text
successtunnel_mainwebsite/
|-- successtunnel_app/           # Actual Next.js application
|   |-- components/             # Shared UI components
|   |-- lib/                    # Prisma client, auth helpers, fallback data, chatbot knowledge
|   |-- pages/                  # Public pages, admin pages, client pages, API routes
|   |-- prisma/                 # Prisma schema and seed script
|   |-- public/                 # Static assets
|   |-- styles/                 # Global styling
|   |-- .env.example            # Safe environment template
|   |-- docker-compose.yml      # Local PostgreSQL/Adminer stack
|   |-- package.json            # App scripts and dependencies
|-- BRANCHING.md                # Git workflow notes
|-- CUSTOMIZATION_REQUIREMENTS.md
|-- PROJECT_BRIEF.md
|-- README.md                   # Main project source of truth
```

## Key Implementation Notes

### Public site
- Homepage, service catalogue, service detail, properties, blog, resources, and contact flows exist.
- Several pages merge database content with `sampleData.ts`, which means placeholders can appear until real records are added.

### Admin side
- Admin authentication uses a JWT stored in the `st_auth` cookie.
- Admin APIs currently support create, read, update, and delete for core content areas.
- Enquiries can be viewed and exported from the admin area.

### Payments
- Razorpay order creation and payment verification routes are present.
- Payment records are stored in the `RentalPayment` table.
- Status naming should be reviewed because stats expect `captured` while verification currently saves `paid`.

### Data layer
- Prisma is set up correctly for PostgreSQL.
- Seed scripts create initial admin/content data from `lib/sampleData.ts`.
- The current app depends on seed/fallback content more than a production-ready CMS usually should.

## Implementation Plan

### Work Codex can do in this project
1. Replace fallback/sample content with structured real content once you provide it.
2. Refactor pages that still use inconsistent layouts or too much inline styling.
3. Finish SMTP/email notifications for enquiry submissions.
4. Add spam protection, validation hardening, and safer auth cookie settings.
5. Fix data inconsistencies such as payment status mismatches and placeholder dependencies.
6. Improve SEO with metadata, sitemap, robots, and structured data.
7. Improve accessibility, responsive polish, and cross-page design consistency.
8. Clean admin workflows and expand fields where your business process needs more data.
9. Prepare deployment configuration and production-readiness checks.
10. Expand the education video library, homepage promo behavior, and media storage strategy if you want true uploaded files later.

### Work you should do
1. Provide final business content for homepage, about, services, blog, privacy, terms, and contact pages.
2. Share real brand assets: logo, colors, fonts, photos, and any style references.
3. Confirm the final service list and subservice details.
4. Provide real property listings, blog posts, FAQs, downloads, and calculator requirements.
5. Decide production credentials and keep secrets only in `.env`, hosting dashboards, or password managers.
6. Confirm third-party integrations: Razorpay, email provider, WhatsApp, analytics, maps, and CRM.
7. Review legal/compliance copy before launch.
8. Approve final deployment target and domain setup.

## Recommended Next Execution Order

1. Finalize business content and brand inputs.
2. Remove dependency on placeholder/sample content.
3. Complete enquiry email delivery and anti-spam protection.
4. Fix production logic gaps in payments, auth, and settings.
5. Finish design consistency across blog, properties, resources, and remaining service pages.
6. Add SEO, analytics, accessibility, and launch checks.
7. Run full QA, build, and deployment verification.

## Local Development

From the app directory:

```bash
cd successtunnel_app
npm install
docker-compose up -d
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `successtunnel_app/.env` from `successtunnel_app/.env.example` and fill in:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

## Cleanup Done

- Consolidated the main project documentation into this root README.
- Sanitized the environment template to remove real-looking credentials.
- Identified the root-level Node install as unnecessary because the actual app dependencies belong in `successtunnel_app/`.

## Important Risks To Address

- Fallback sample content is still mixed into production pages.
- Enquiry submission does not send email notifications yet.
- Authentication is custom and should be hardened before production use.
- SEO and anti-spam protections are not complete.
- Payment flow status handling should be normalized before go-live.
