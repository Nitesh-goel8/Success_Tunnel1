# Success Tunnel — Architecture & System Design Documentation

This document describes the architectural principles, component structure, data flows, and security model of the **Success Tunnel Public Website and Enterprise ERP Platform**.

---

## 1. High-Level System Architecture

Success Tunnel is implemented as a unified, full-stack Next.js web application built with the Pages Router, React 18, TypeScript, and Prisma ORM.

```
                              ┌────────────────────────────────────────┐
                              │           Public Internet              │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Next.js Application Server                              │
├───────────────────────────────────┬────────────────────────────────────────────────────┤
│           Public Website          │                  ERP Portal Suite                  │
│  - Homepage (`/`)                 │  - Shell & Global Search (`/portal/dashboard`)     │
│  - Services Hub (`/services`)     │  - Employee Directory (`/portal/employees`)        │
│  - Public Projects (`/projects`)  │  - Projects & Engineering (`/portal/projects`)     │
│  - Resources & Tools (`/resources`)│  - Sales & CRM Pipeline (`/portal/crm`)            │
│  - Contact & Enquiries (`/contact`)│  - Finance & Ledger (`/portal/finance`)           │
│  - SEO (`sitemap.xml`, `robots`)  │  - Attendance & Leaves (`/portal/attendance`)      │
│                                   │  - Document Governance (`/portal/documents`)       │
│                                   │  - Compliance Audit (`/portal/audit-logs`)         │
├───────────────────────────────────┴────────────────────────────────────────────────────┤
│                                      API Layer                                         │
│  - Public Contact API: `/api/enquiries` (Rate-limited, spam protected)                 │
│  - Internal ERP APIs: `/api/portal/*` (JWT authentication, RBAC enforced)             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                     Data Layer                                         │
│  - Prisma ORM (Dual schema: SQLite for local dev, PostgreSQL for production)           │
│  - In-memory sliding window rate limiting engine                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Invariants & Architectural Rules

1. **Revenue vs. Accounts Receivable Invariant:**
   - Unpaid invoices are accounts receivable claims and are **strictly never counted as realized cash revenue**.
   - Realized revenue is calculated exclusively from verified `Payment` records in `COMPLETED` status.
   - Cash flow statements separate invoiced billing totals from realized cash inflow and approved expense cash outflow.

2. **Public Project Non-Sensitive Exposure:**
   - Only projects explicitly approved (`isPublic: true`) and assigned a `publicSlug` are accessible on `/projects`.
   - Public projections strictly select non-sensitive fields (`name`, `description`, `businessObjective`, `status`, `progress`, `startDate`, `endDate`).
   - Customer IDs, budgets, employee profiles, internal task logs, and financials are excluded at the database query level.

3. **Public Enquiry to ERP CRM Pipeline:**
   - Public contact form submissions at `/contact` send to `/api/enquiries`.
   - Input is normalized and stored as an `Enquiry` record.
   - An associated `Lead` is automatically created in the ERP CRM with status `NEW`.
   - Touchpoint activity (`WEBSITE_ENQUIRY`) is written to the audit log.
   - In-app notification is broadcast to authorized staff (`super_admin`, `project_manager`).

4. **Task-Linked Progress Derivation:**
   - Project progress percentages are derived directly from task completion states ($\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\%$).
   - Decorative or fabricated percentages are forbidden.

5. **Confidential Document Access Control:**
   - Documents flagged `isConfidential: true` are restricted to Super Admin, HR Admin, or the assigned target employee (`userId`).
   - Non-confidential documents are viewable across the authenticated organization.

---

## 3. Server-Side Role-Based Access Control (RBAC)

All sensitive routes and operations verify tokens server-side via `authenticateApi(req, res, allowedRoles)`. Fine-grained permissions are governed by `checkModulePermission`:

| Module | Super Admin | HR Admin | Project Manager | Finance Admin | Employee |
|---|:---:|:---:|:---:|:---:|:---:|
| **ORGANIZATION** | Full | Full | View | View | View |
| **EMPLOYEES** | Full | Full | View | View | View |
| **PROJECTS** | Full | View | Full | View | View |
| **TASKS** | Full | View | Full | View | Edit Assigned |
| **CRM** | Full | View | Full | View | View |
| **FINANCE** | Full | Own Expense | Own Expense | Full | Own Expense |
| **ATTENDANCE** | Full | Full | Punch/View | Punch/View | Self Punch |
| **LEAVES** | Full | Full | Self/View | Self/View | Self Apply |
| **DOCUMENTS** | Full | Full | View Public | View Public | View Target |
| **AUDIT_LOGS** | Full (View) | View Only | Blocked | View Only | Blocked |
| **REPORTS** | Full | View Only | View Only | Full | Blocked |

---

## 4. Dual Database Architecture

- **Local Development & Fast CI Testing:** `prisma/schema.sqlite.prisma` using SQLite (`file:./dev.db`).
- **Production Cloud Deployment:** `prisma/schema.prisma` using PostgreSQL with connection pooling.
- Both schemas share identical model definitions, field mappings, unique constraints, and referential relationships.
