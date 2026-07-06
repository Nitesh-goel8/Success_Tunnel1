# Backend Database Setup

This app uses Next.js API routes, Prisma ORM, and PostgreSQL.

## 1. Prerequisites

- Node.js 18 or newer
- Docker Desktop
- Git

## 2. Environment file

Create a local `.env` file from the example:

```bash
copy .env.example .env
```

For local development, keep this database URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/successtunnel?schema=public"
```

Use `localhost` when running Next.js directly on your computer. Use `db` only if the Next.js app itself is running inside Docker on the same compose network.

Change these before real deployment:

```env
ADMIN_EMAIL="admin@successtunnel.in"
ADMIN_PASSWORD="replace_with_strong_password"
JWT_SECRET="replace_with_jwt_secret"
NEXTAUTH_SECRET="change_this_to_a_strong_secret"
```

## 3. Start PostgreSQL

From `successtunnel_app`:

```bash
docker-compose up -d
```

If Docker says it cannot connect to `dockerDesktopLinuxEngine`, open Docker Desktop first and wait until it says the engine is running.

Adminer will be available at:

```text
http://localhost:8080
```

Use these Adminer values:

- System: `PostgreSQL`
- Server: `db`
- Username: `postgres`
- Password: `postgres`
- Database: `successtunnel`

## 4. Install and prepare database

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

If you are still prototyping and do not need migration files yet, you can use:

```bash
npm run prisma:push
npm run seed
```

## 5. Run the website

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 6. Admin workflow

Open:

```text
http://localhost:3000/admin/login
```

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

The admin panel currently supports:

- Services: create/delete service cards
- Properties: create/delete property listings
- Enquiries: view and export leads as CSV

## 7. How services work

Public pages use a mix of static page content and database content:

- `/services` reads services from `Service`
- `/api/services` returns services with subservices
- `/services/[slug]` can show database-backed service detail pages
- Category pages such as `/services/finance` and `/services/consultancy` provide polished landing pages
- Enquiry forms submit to `/api/enquiries`

The enquiry flow is:

1. User fills name, email, phone, service, and message.
2. Frontend posts data to `/api/enquiries`.
3. API validates required fields.
4. Prisma saves the lead in the `Enquiry` table.
5. Admin views leads at `/admin/enquiries`.
6. Admin exports CSV for CRM/follow-up.

## 8. Production checklist

Before launch:

- Use a managed PostgreSQL database.
- Replace all default secrets.
- Use strong admin password.
- Add SMTP email notifications for new enquiries.
- Add rate limiting or CAPTCHA to enquiry forms.
- Add cloud image storage for property photos.
- Run `npm run build` before deployment.
