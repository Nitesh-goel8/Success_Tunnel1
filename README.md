# Success Tunnel — Public Web Platform & Enterprise ERP

[![Next.js](https://img.shields.io/badge/Next.js-13.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-4.16-teal?logo=prisma)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Tests-278%20Passed-brightgreen)](file:///C:/Users/nites/Downloads/Success_Tunnel1/docs/TESTING.md)
[![Build](https://img.shields.io/badge/Production%20Build-159%20Routes%20Passing-success)](file:///C:/Users/nites/Downloads/Success_Tunnel1/docs/DEPLOYMENT.md)

Welcome to **Success Tunnel**, a unified corporate web application combining a public brand website with an internal **Enterprise Resource Planning (ERP)** and workforce management system.

---

## 📑 Documentation Index

| Guide | Description |
|---|---|
| **[Architecture Documentation](docs/ARCHITECTURE.md)** | Technical stack, data flow, invariants, and server-side RBAC matrix. |
| **[Deployment Guide](docs/DEPLOYMENT.md)** | Vercel deployment, PostgreSQL setup, environment variables, and post-launch smoke tests. |
| **[Testing & QA Guide](docs/TESTING.md)** | Automated test execution (278 passing assertions across 9 test suites). |
| **[Security & Compliance](docs/SECURITY.md)** | Authentication security, rate limiting, hashing, and confidentiality controls. |
| **[Troubleshooting Runbook](docs/TROUBLESHOOTING.md)** | Resolving port conflicts, Prisma locks, and schema push issues. |
| **[Release Notes & Roadmap](docs/RELEASE_NOTES.md)** | Delivered v2.0 capabilities and planned future enhancements. |

---

## 🌟 Core Modules & Capabilities

### 1. Public Web Platform
* **Homepage (`/`) & Services (`/services`):** Multi-sector advisory ecosystem across Consultancy, Finance, Practical Education, Investment, Real Estate, and Rental Space.
* **Public Projects & Case Studies (`/projects`, `/projects/[slug]`):** Public showcase displaying approved initiatives with strict omission of internal budgets, client accounts, or developer identities.
* **Public Enquiry to ERP Pipeline:** Visitor submissions on `/contact` validate, store in database, trigger staff notifications, and push directly to the ERP CRM.
* **SEO & Crawling Safeguards:** Page-specific meta tags, OpenGraph tags, JSON-LD Organization schema, canonical URLs, updated `sitemap.xml`, and strict crawler boundaries in `robots.txt` disallowing `/portal/` and `/admin/`.

### 2. Enterprise ERP Portal (`/portal/*`)
* **Executive Dashboard (`/portal/dashboard`):** 6 data-backed KPI cards, task velocity pipeline, project lifecycle distribution, upcoming deadlines, and live demo environment indicators.
* **Server-Side RBAC:** 5 defined roles (*Super Administrator*, *HR Administrator*, *Project Manager*, *Finance Administrator*, *Employee*).
* **Employee Directory (`/portal/employees`):** Multi-tab profile drawer, manager-subordinate reporting hierarchies, and department budget allocations.
* **Projects & Tasks (`/portal/projects`, `/portal/tasks`):** Mathematical task-linked progress derivation, Kanban board, and task priority states.
* **Engineering Workspace (`/portal/engineering`):** Real-time Git commit ledger reading live repository history, architectural decision records (ADRs), bug tracking, and testing checklists.
* **Sales & CRM Pipeline (`/portal/crm`):** 6-stage sales Kanban pipeline, touchpoint interaction logs, and 1-click customer account promotion.
* **Finance & Cash Flow (`/portal/finance`):** Strict invariant: unpaid invoices are accounts receivable and are **never counted as cash revenue**. Features itemized invoices with 18% GST calculation, received payments ledger, expense claims, and cash flow statements.
* **Workforce Time & Attendance (`/portal/attendance`, `/portal/leaves`):** Biometric punch time clock, attendance regularization requests reviewed by HR, and live leave entitlement balance deduction.
* **Document Governance (`/portal/documents`):** Granular access controls ensuring confidential files are accessible only by HR/Admin or the assigned target employee.
* **Immutable Compliance Audit Trail (`/portal/audit-logs`):** Activity audit log capturing actor, action, module, entity ID, metadata, and IP address with administrative CSV export.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js:** v18.x or v20.x+
* **npm:** v9.x+

### Setup Instructions
```bash
# 1. Clone repository
git clone https://github.com/Nitesh-goel8/Success_Tunnel1.git
cd Success_Tunnel1/successtunnel_app

# 2. Install dependencies
npm install

# 3. Synchronize local SQLite database
npm run db:push:sqlite

# 4. (Optional) Populate seed data
npm run seed

# 5. Run automated test suites (278 passing assertions)
npm run test:all

# 6. Start local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Default Portal Login Credentials

* **URL:** [http://localhost:3000/portal/login](http://localhost:3000/portal/login)
* **Work Email:** `admin@successtunnel.in`
* **Password:** `Demo@2026!`

*(Additional role credentials for HR Admin, Project Manager, and Finance Admin are listed in the [Testing Guide](docs/TESTING.md)).*

---

## 🧪 Automated Testing

```bash
cd successtunnel_app
npm run test:all
```

Runs all 9 test suites:
- `tests/erp-portal.test.ts` (Core ERP Portal)
- `tests/phase-a-auth.test.ts` (Phase A: Authentication & Shell)
- `tests/phase-b-org.test.ts` (Phase B: Organization & Employees)
- `tests/phase-c-projects.test.ts` (Phase C: Projects & Tasks)
- `tests/phase-d-crm.test.ts` (Phase D: CRM & Enquiry Ingestion)
- `tests/phase-e-finance.test.ts` (Phase E: Finance & AR/Cash Separation)
- `tests/phase-f-workforce.test.ts` (Phase F: Workforce & Compliance)
- `tests/phase-g-security.test.ts` (Phase G: Notifications & Security)
- `tests/public-website-crm.test.ts` (Public Website, SEO & CRM Pipeline)

---

## 📄 License
Proprietary & Confidential. All rights reserved by Success Tunnel.
