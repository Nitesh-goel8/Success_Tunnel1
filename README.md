# Success Tunnel — Production Website

Success Tunnel is a premium enterprise professional service portal built to showcase core advisory services (Consultancy, Finance, Education, Investment, Real Estate, and Rental Space), capture customer leads, offer downloadable learning materials, and manage real estate listings.

It is implemented as a modern **Next.js** application integrated with **Prisma ORM**, powered by a **PostgreSQL** database (hosted on **Supabase**), styled using custom **Vanilla CSS** for luxury brand aesthetics, and deployed on **Vercel**.

---

## Technical Stack
- **Framework:** Next.js 13 (Pages Router)
- **Database ORM:** Prisma ORM
- **Database Provider:** PostgreSQL (Supabase)
- **Language:** TypeScript
- **Styling:** Custom CSS (scoped and global variables)
- **State/Auth:** JWT-based custom session token authentication for Admin

---

## Directory Structure
```text
successtunnel_mainwebsite/
├── successtunnel_app/        # Core Next.js Application
│   ├── components/           # Reusable React components (Nav, Footer, EnquiryForm, Chatbot)
│   ├── data/                 # Static / Fallback data
│   ├── lib/                  # Database connections, authentication utilities, and helper scripts
│   ├── pages/                # Next.js Pages (Client Pages & API Endpoints)
│   │   ├── admin/            # Protected Admin Dashboard Pages (Services, Properties, Blogs, Enquiries)
│   │   ├── api/              # API Route endpoints for Enquiries, Admin operations, and Services
│   │   ├── blog/             # Thought leadership blog section
│   │   ├── properties/       # Property showcase listings and details
│   │   └── services/         # Service hub pages (consultancy, finance, education, etc.)
│   ├── prisma/               # Database Schema (`schema.prisma`) and Seed scripts
│   ├── public/               # Static assets (logos, icons, illustrations)
│   ├── styles/               # Global CSS variables and responsive design tokens
│   ├── package.json          # Node dependencies & npm commands
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # Project Documentation (This file)
```

---

## Latency Optimization (CDN Caching)
To achieve sub-50ms Time-to-First-Byte (TTFB) and optimal performance under load, all main customer-facing landing pages have been optimized to use **Incremental Static Regeneration (ISR)** instead of Server-Side Rendering (SSR).
- Pages are statically compiled at build time.
- They are served instantly from the Vercel Edge CDN without waiting for a database roundtrip.
- Next.js automatically revalidates pages in the background (configured for a maximum of every **60 seconds** per page) whenever new database entries (blogs, properties, or services) are added or updated in the Admin Dashboard.

---

## Local Setup & Development

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **Git:** Installed

### 2. Environment Configuration
Navigate to the application folder and copy the environment template:
```bash
cd successtunnel_app
cp .env.example .env
```
Open `.env` and fill in the configuration details:
```env
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>"
NEXTAUTH_SECRET="your-32-character-random-secret"
JWT_SECRET="your-32-character-random-jwt-secret"
ADMIN_EMAIL="admin@successtunnel.in"
ADMIN_PASSWORD="ChooseAStrongPassword"
```

### 3. Install Dependencies
Run the install command inside the application directory:
```bash
npm install
```

### 4. Database Setup & Seeding
Push the database schema to your local or remote database and populate the initial seed data (default admin account, sample blogs, properties, and services):
```bash
# Generate Prisma Client
npm run prisma:generate

# Sync schema and push to database
npm run prisma:push

# Populate seed content
npm run seed
```

### 5. Running the Local Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Step-by-Step Supabase Deployment Guide

Supabase provides the hosted PostgreSQL database that powers Success Tunnel.

1. **Sign Up & Create Project:**
   - Go to [Supabase](https://supabase.com) and sign in.
   - Click **New Project** and select your Organization.
   - Choose a project Name (e.g., `success-tunnel`), set a secure **Database Password** (save this password!), and pick the nearest regional server.

2. **Obtain Connection String:**
   - Navigate to **Project Settings** (gear icon) > **Database**.
   - Under the **Connection String** section, copy the **URI** connection string.
   - Choose the **Transaction** tab (port `5432` or pooler connection on port `6543`) for production use.
   - Replace `[YOUR-PASSWORD]` in the connection string with the database password you chose.

3. **Initialize Database Schema:**
   - Locally, update the `DATABASE_URL` in your `.env` file to this new Supabase URI.
   - Execute the schema migration and seed scripts:
     ```bash
     npx prisma db push
     npx prisma db seed
     ```
   - Verify in your Supabase project dashboard (Table Editor) that the `User`, `Service`, `Subservice`, `BlogPost`, `Property`, and `Enquiry` tables are created and seeded with baseline data.

---

## Step-by-Step Vercel Deployment Guide

Vercel hosts the Next.js frontend application with serverless edge functions.

1. **Import Repository:**
   - Log in to your [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project**.
   - Select and import your GitHub repository containing the codebase.

2. **Configure Build & Directory Options:**
   - **Root Directory:** Since the Next.js application lives inside a subfolder, edit the **Root Directory** setting and select `successtunnel_app`.
   - **Framework Preset:** Verify it is set to **Next.js**.
   - **Build Command:** The default build command will run:
     `prisma db push && ts-node --project tsconfig.seed.json prisma/seed.ts && next build`
     *Note: During build time, Vercel will automatically generate the Prisma Client and verify the database is up-to-date.*

3. **Add Environment Variables:**
   Expand the **Environment Variables** section and add the following keys matching your `.env` configuration:
   - `DATABASE_URL` (Supabase Connection URI)
   - `NEXTAUTH_SECRET` (Generate a random security string)
   - `JWT_SECRET` (Generate a random JWT verification string)
   - `ADMIN_EMAIL` (Your admin email for admin panel login)
   - `ADMIN_PASSWORD` (Your admin password for admin panel login)

4. **Deploy:**
   - Click the **Deploy** button.
   - Vercel will build the static pages, bundle functions, and deploy the application.
   - Once completed, you will receive a public production URL (e.g., `https://success-tunnel.vercel.app` or a custom domain if connected).

---

## Verification & Production Validation

Before handing over to the client, perform the following validation checklist:
1. **Type Safety:** Run `npx tsc --noEmit` inside `successtunnel_app` to verify zero TypeScript errors.
2. **Build Test:** Run `npm run build` locally to confirm Next.js can generate optimized static files without issues.
3. **Form Integrity:** Submit a lead inquiry on the Contact page and verify it appears immediately in the database (accessible via `https://<your-domain>/admin/enquiries`).
4. **Admin Console:** Navigate to `/admin/login` and verify you can successfully log in, view current enquiries, and perform CRUD operations on services, properties, and blogs.
