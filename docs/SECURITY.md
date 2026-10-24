# Success Tunnel — Security & Compliance Checklist

This document details the security architecture, threat mitigations, and compliance controls enforced in the **Success Tunnel Web Platform & ERP**.

---

## 1. Authentication & Session Security

- **Password Hashing:** Passwords are encrypted using `bcryptjs` with salt rounds set to 10. Plaintext passwords are never logged, stored, or returned in API responses.
- **Session Tokens:** Authentication sessions use JSON Web Tokens (`jsonwebtoken`) signed with a dedicated server-side `JWT_SECRET`.
- **Cookie Security:** In production (`NODE_ENV=production`), session cookies (`st_auth`) are stamped with:
  - `HttpOnly`: Prevents client-side script access, defending against XSS attacks.
  - `Secure`: Transmitted strictly over encrypted HTTPS channels.
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF).
  - `Max-Age=604800`: 7-day session expiration.
- **Brute-Force Rate Limiting:**
  - Login attempts (`/api/portal/auth/login`) are monitored via an in-memory sliding window limiter.
  - Limits each IP address to **10 attempts per 60 seconds**.
  - Excessive attempts trigger HTTP 429 with a calculated `Retry-After` header.

---

## 2. Server-Enforced Role-Based Access Control (RBAC)

Authorization is verified server-side inside every sensitive endpoint using `authenticateApi`:

1. **Super Administrator:** Complete access across all enterprise modules and configurations.
2. **HR Administrator:** Full workforce access (directory, regularizations, leave approvals, documents); view-only access to audit logs and reports; blocked from financial modifications.
3. **Project Manager:** Full project, task, and CRM pipeline management; strictly blocked from viewing company audit logs and company-wide financial accounts.
4. **Finance Administrator:** Full invoicing, payments, and expense review access; financial report exports; view-only audit logs; blocked from employee onboarding.
5. **Employee:** Strictly restricted to self-service portals (personal attendance time clock, leave applications, own expense submissions, public and assigned confidential documents). Blocked from all administrative operations.

---

## 3. Data Privacy & Confidentiality Governance

- **Confidential Document Isolation:** Documents flagged `isConfidential: true` can only be viewed by HR Admins, Super Admins, or the specific target employee assigned (`userId`). Colleague inspection is blocked at the database query level.
- **Public Project Privacy Boundary:** Public projects (`/projects`) strictly query non-sensitive fields. Internal budgets, customer accounts, developer identities, and task logs are excluded from public API responses.
- **Audit Trail Immutability:** Audit logs only expose a `GET` endpoint. No `POST`, `PUT`, `PATCH`, or `DELETE` methods exist for audit logs, ensuring compliance log immutability.
- **Anti-Spam Honeypot:** Public enquiry forms include a hidden honeypot field (`website`) that immediately rejects automated spam bots.

---

## 4. Pre-Launch Security Verification Checklist

- [x] All 278 automated test assertions passing (`npm run test:all`).
- [x] TypeScript compiler strict check passing with zero errors (`npx tsc --noEmit`).
- [x] No plaintext credentials or secrets committed in repository.
- [x] `.env` whitelisted in `.gitignore`; `.env.example` provided.
- [x] Production build generated without errors (`npm run build`).
- [x] Rate limiting verified on login and public enquiry endpoints.
- [x] Robots.txt disallows `/portal/`, `/admin/`, and `/api/` from search indexation.
