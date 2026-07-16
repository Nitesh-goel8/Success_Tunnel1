# Success Tunnel Web Application

Welcome to the **Success Tunnel** main repository. This Next.js application serves as the central hub for the Success Tunnel business, providing access to our diverse range of services including Consultancy, Finance, Real Estate, Investment, and the Education Hub.

## 🚀 Project Overview

Success Tunnel is a Next.js (React) application designed with a premium, responsive UI. It features a scalable architecture powered by Prisma (SQLite/PostgreSQL) for backend data management.

### Key Features
- **Modern UI/UX**: Built with custom CSS (`globals.css`) emphasizing a sleek, corporate, and dynamic aesthetic with smooth micro-animations.
- **Service Hub**: Centralized access to Consultancy, Finance, Real Estate, and more.
- **Education Hub**: A dedicated section (`/education`) containing professional courses and learning materials.
- **Secure Admin Panel**: A protected dashboard (`/admin`) for content management, requiring authenticated access.
- **Advanced SEO**: Pre-configured with Schema.org JSON-LD structured data and Open Graph tags to maximize search engine visibility.

---

## 📂 Project Structure

```text
successtunnel_mainwebsite/
├── successtunnel_app/
│   ├── components/       # Reusable UI components (Cards, Nav, Forms, etc.)
│   ├── lib/              # Utilities, Prisma client, and seed data
│   ├── pages/            # Next.js file-based routing
│   │   ├── admin/        # Secure admin dashboard (protected by middleware)
│   │   ├── api/          # Next.js API routes (backend endpoints)
│   │   ├── education/    # Success Tunnel Education Hub flows
│   │   └── services/     # Individual service pages
│   ├── prisma/           # Database schema and migrations
│   ├── public/           # Static assets (images, logos)
│   ├── styles/           # Global stylesheets and CSS modules
│   └── middleware.ts     # Edge middleware (handles Admin Auth Security)
```

---

## 🛡️ Security & Authentication

The `/admin` routes are protected by Next.js `middleware.ts`. 
- Accessing any route under `/admin/*` without a valid `st_auth` cookie will automatically redirect the user to `/admin/login`.
- The login endpoint (`/api/admin/login`) uses `bcryptjs` to verify credentials against the database.
- It is impossible to bypass the login screen to access the admin dashboard.

---

## 🌿 Branching Strategy

To keep the repository clean and organized, we follow a strict branching model:

- **`main`**: The production-ready base branch. All stable features are merged here.
- **`feature/service-*`**: Branches dedicated to specific service areas (e.g., `feature/service-properties`, `feature/service-education`).
- **`feature/admin-security`**: Branches used for core administrative or security updates.

*Note: All legacy or stale branches (like `production-polish`, `codex/professional-ui-redesign`) have been pruned to maintain clarity.*

---

## 🛠️ Local Development Setup

To run the project locally, follow these steps:

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
Navigate into the application directory and install dependencies:
```bash
cd successtunnel_app
npm install
```

### 3. Database Setup
The project uses Prisma. Push the schema to your local database (SQLite by default):
```bash
npx prisma db push
```
*(Optional)* Seed the database with initial data (like the admin user and sample services):
```bash
npm run seed
```

### 4. Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 📈 Future Scaling (Advanced Features)
As Success Tunnel expands into international markets, consider implementing:
1. **Internationalization (i18n)**: Adding multi-language support in Next.js to cater to a global audience.
2. **Automated CRM Routing**: Hooking the `GuidedEnquiry` form directly into Salesforce or HubSpot via API.
3. **Advanced Analytics**: Integrating Vercel Web Analytics and custom event tracking to monitor user flows through the Education Hub.
