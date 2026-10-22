# Success Tunnel ERP & Corporate Portal Setup Guide

This guide covers local development, automated testing, demo environment data, and production deployment on Vercel for the **Success Tunnel ERP Management Portal**.

---

## 🚀 Quick Start (Zero-Setup Local Dev)

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.19.0)
- **npm**: v9+ (tested on npm 11.x)
- **Git**

### 2. Installation
From the repository root:
```bash
npm install --prefix successtunnel_app
```

### 3. Database Configuration
Copy the environment template:
```bash
cp successtunnel_app/.env.example successtunnel_app/.env
```

For **zero-dependency local development and automated testing**, the system supports a local SQLite database or PostgreSQL:
- **Local SQLite mode (default local test runner)**:
  ```bash
  npm run db:push:sqlite --prefix successtunnel_app
  ```
- **PostgreSQL mode (Docker or Remote Managed Postgres/Neon/Supabase)**:
  ```bash
  npm run prisma:push --prefix successtunnel_app
  ```

### 4. Seed Demo Data
Populate realistic, fictional demo records across all modules (departments, staff, projects, Kanban tasks, attendance, leave requests, policies, and documents):
```bash
npm run seed --prefix successtunnel_app
```

### 5. Run Automated Tests
Execute the end-to-end automated test suite:
```bash
npm test --prefix successtunnel_app
```

### 6. Start the Local Server
```bash
npm run dev --prefix successtunnel_app
```
- **Public Portal**: `http://localhost:3000`
- **ERP Management Portal**: `http://localhost:3000/portal/login`
- **Website CMS Admin**: `http://localhost:3000/admin/login`

---

## 👥 Seeded Demo Accounts (Role-Based Access Control)

All seeded demo credentials use the standard password: `Demo@2026!`

| Role | Email Address | Focus Module & Access Scope |
| :--- | :--- | :--- |
| **Super Administrator** | `admin@successtunnel.in` | Unrestricted system-wide control, role assignment, audit logs |
| **HR Administrator** | `priya.sharma@example.com` | Personnel directory, departments, leave approvals, HR docs |
| **Project Manager** | `rohit.verma@example.com` | Project roadmap, milestone progress, Kanban task assignments |
| **Finance Administrator**| `sneha.patel@example.com` | Expense claims review, budget authorizations, financial ledger |
| **Employee (Staff)** | `amit.kumar@example.com` | Personal dashboard, time clock punch-in/out, leave applications |

*Note: The `/portal/login` screen includes a one-click Quick Demo Role Switcher for instant testing.*

---

## 📂 ERP Module Routes

- **Authentication**: `/portal/login`
- **Executive Dashboard**: `/portal/dashboard`
- **Employee Directory**: `/portal/employees`
- **Departments & Org**: `/portal/departments`
- **Project Roadmaps**: `/portal/projects`
- **Task Kanban Board**: `/portal/tasks`
- **Workforce Attendance**: `/portal/attendance`
- **Leaves & Holidays**: `/portal/leaves`
- **Document Center**: `/portal/documents`
- **Expense Claims**: `/portal/finance`
- **Analytics & Reports**: `/portal/reports`
- **Compliance Audit Trail**: `/portal/audit-logs`

---

## 🌐 Production Vercel Deployment

1. **Database**: Provision a PostgreSQL instance (e.g., Neon, Supabase, AWS RDS, or Vercel Postgres).
2. **Environment Variables**: Configure the following in Vercel Project Settings:
   - `DATABASE_URL`: `postgresql://user:password@host:5432/db?sslmode=require`
   - `JWT_SECRET`: Random 32+ character cryptographic secret
   - `ADMIN_EMAIL`: Initial administrator email
   - `ADMIN_PASSWORD`: Strong initial administrative password
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_APP_URL`: Your live domain (e.g. `https://erp.successtunnel.in`)
3. **Build & Schema Sync**:
   - `vercel.json` automatically runs `prisma generate` and builds `successtunnel_app`.
   - Run `npx prisma db push` or migrations against the production database.
   - Run `npm run seed` to initialize baseline policies and departments.
4. **Smoke Testing**:
   - Verify login with administrative credentials.
   - Verify employee creation, attendance punch, and CSV report downloads.
