# Success Tunnel — Testing & Quality Assurance Guide

This guide describes the automated testing suite, execution commands, and verification procedures for the **Success Tunnel Public Website and Enterprise ERP Platform**.

---

## 1. Test Architecture Overview

All tests are written in TypeScript and executed directly against the application data model using `ts-node`. Test suites perform end-to-end integration checks, verifying:

- Cryptographic token generation, expiration, and tampering rejection.
- Password hashing and verification via `bcryptjs`.
- Server-side RBAC matrix enforcement across all 5 roles and 11 modules.
- Employee CRUD operations, manager reporting hierarchies, and department allocation.
- Mathematical task-linked project progress derivation (0% decorative percentages).
- Public contact form enquiry normalization and CRM lead conversion.
- Financial revenue invariants: strict isolation of accounts receivable from realized cash payments.
- Workforce attendance clocking, regularization requests, and leave policy balance deduction.
- Confidential document access control restricting sensitive records to target employees.
- Immutable activity audit log persistence and administrative-only CSV export.
- Public project confidentiality boundaries omitting internal budgets, tasks, and client IDs.

---

## 2. Test Commands

Run from the `successtunnel_app` directory:

```bash
cd successtunnel_app

# Run all test suites across the platform (278 assertions)
npm run test:all

# Run individual module test suites:
npm run test:phase-a    # Authentication, JWT, Rate Limiting, RBAC Shell
npm run test:phase-b    # Employee Directory, Profile Drawer, Reporting Hierarchy
npm run test:phase-c    # Projects, Tasks, Engineering Workspace, Git Ledger
npm run test:phase-d    # CRM Sales Pipeline, Lead Ingestion, Customer Promotion
npm run test:phase-e    # Finance, Invoicing (18% GST), Payments, Cash Flow Statement
npm run test:phase-f    # Workforce Attendance, Leave Balances, Confidential Documents
npm run test:phase-g    # Notifications Engine, Audit Trail, Executive Dashboard
npm run test:public     # Public Website, Projects Filtering, Technical SEO & CRM Pipeline
```

---

## 3. Test Suite Breakdown

| Suite | File | Passing Assertions | Verified Capabilities |
|---|---|:---:|---|
| **Core ERP Portal** | `tests/erp-portal.test.ts` | 23 | Token signing, password security, department CRUD, unique check-ins, leave state transitions. |
| **Phase A: Auth & Shell** | `tests/phase-a-auth.test.ts` | 39 | Tamper detection, salt prefixing, brute-force rate limiter backoff, notifications lifecycle. |
| **Phase B: Org & Personnel** | `tests/phase-b-org.test.ts` | 15 | Employee profile creation, manager assignment, department budget, emergency contacts. |
| **Phase C: Projects & Tasks** | `tests/phase-c-projects.test.ts` | 15 | Dynamic task-linked progress derivation (0%, 25%, 50%, 100%), task comments, audit logging. |
| **Phase D: CRM Pipeline** | `tests/phase-d-crm.test.ts` | 39 | Lead creation, Kanban stage transitions, touchpoint logging, 1-click customer promotion. |
| **Phase E: Finance Ledger** | `tests/phase-e-finance.test.ts` | 37 | Unpaid invoice AR vs realized cash invariant, 18% GST tax calculation, expense review flow. |
| **Phase F: Workforce & Compliance** | `tests/phase-f-workforce.test.ts` | 36 | Punch clocking, duplicate prevention, attendance regularization review, leave deduction, doc confidentiality. |
| **Phase G: Notifications & Security** | `tests/phase-g-security.test.ts` | 56 | RBAC matrix completeness, audit log immutability, notification broadcasts, dashboard metrics derivation. |
| **Public Website & CRM** | `tests/public-website-crm.test.ts` | 18 | Public projects non-sensitive field filtering, enquiry-to-CRM conversion, SEO crawler boundaries. |
| **Total Automated Assertions** | | **278** | **100% Passing (0 Failures)** |

---

## 4. Build & Static Analysis Checks

Before any commit or deployment:

```bash
# 1. Typecheck entire application
npx tsc --noEmit

# 2. Run all tests
npm run test:all

# 3. Production build check (compiles all 159 routes)
npm run build
```
