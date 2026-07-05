# Success Tunnel — Next.js + Prisma starter

This repo is a starter scaffold for the custom Success Tunnel website (Next.js frontend + API routes + Prisma + PostgreSQL).

Quick start (local, requires Node 18+, Docker):

1. Copy `.env.example` to `.env` and update secrets.
2. Start Postgres locally with Docker Compose:

```bash
docker-compose up -d
```

3. Install deps:

```bash
npm install
```

4. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

5. Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

What's included:
- Next.js pages for Home, Services, Properties, Blog
- API endpoints for enquiries, services, properties
- Prisma schema and seed script
- Docker Compose for Postgres + Adminer

Next steps:
- Add SMTP integration for enquiry emails
- Add authentication and admin UI for content management
- Add image storage (S3) and optimization pipeline
