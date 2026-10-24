# Success Tunnel — Troubleshooting & Operational Runbook

This runbook provides diagnostic and recovery procedures for common development and operational issues.

---

## 1. Port 3000 In Use (`EADDRINUSE`)

**Symptom:**
`Error: listen EADDRINUSE: address already in use :::3000`

**Cause:**
A previous Next.js server instance or background task is already listening on port 3000.

**Resolution:**
In PowerShell, locate and terminate the process holding port 3000:
```powershell
# Stop the process running on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# Start a fresh server instance
cd successtunnel_app
npm start
```

---

## 2. Prisma Engine DLL Lock (`EPERM: operation not permitted, unlink query_engine-windows.dll.node`)

**Symptom:**
`Error: EPERM: operation not permitted, unlink '.../query_engine-windows.dll.node'` during `npx prisma generate`.

**Cause:**
A running Node.js process has loaded the Prisma native binary DLL into memory on Windows.

**Resolution:**
1. Stop the running Node server holding port 3000.
2. Run `npx prisma generate --schema=prisma/schema.sqlite.prisma`.
3. Restart the server.

---

## 3. SQLite Database Locked (`SQLITE_BUSY: database is locked`)

**Symptom:**
`Error: SQLITE_BUSY: database is locked` during concurrent writes in local development.

**Cause:**
SQLite file locks during simultaneous multi-process operations (e.g. running seed scripts while running the Next.js server).

**Resolution:**
1. Pause test runs or scripts before rerunning `npm run seed`.
2. For multi-user concurrent production workloads, deploy to **PostgreSQL** (`prisma/schema.prisma`), which supports connection pooling and row-level locking natively.

---

## 4. Prisma Dual Schema Target Mismatch (`P1012`)

**Symptom:**
Prisma complains about datasource URL mismatch when running `npx prisma db push`.

**Cause:**
By default, Prisma CLI reads `prisma/schema.prisma` (which expects PostgreSQL `postgresql://`). In local development with SQLite (`dev.db`), you must specify the schema flag.

**Resolution:**
Always use the dedicated npm scripts:
```bash
# Push SQLite schema (local)
npm run db:push:sqlite

# Push PostgreSQL schema (production)
npm run db:push:pg
```
