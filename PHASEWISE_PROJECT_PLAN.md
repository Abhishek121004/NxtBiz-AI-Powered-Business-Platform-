# NxtBiz Phasewise Build Plan

## Phase 1 - Foundation

Status: Complete

- Created `client/` and `server/` exactly as required by `spec.md`.
- Added package metadata, environment examples, server app bootstrapping, client Vite bootstrapping, and NxtBiz branding.
- Added server syntax/build check and verified it passes.
- Added client production build and verified it passes.

## Phase 2 - Backend Core

Status: Started

- Added MongoDB models for users, customers, emails, meetings, invoices, reports, tickets, agents, workflows, notifications, memory, and CRM activity.
- Added JWT auth, refresh token rotation, cookie auth, role middleware, protected routes, email intelligence, agent orchestration, workflow execution, PDF generation, notifications, and Socket.IO event emission.
- Added seed script for the NxtBiz admin, sample customer, escalation workflow, memory, and agents.

Remaining:

- Add stricter Zod validation across all custom request bodies.
- Expand role checks per route action, especially destructive operations.
- Add automated API tests once test tooling is selected.
- Run runtime verification with MongoDB configured.

## Phase 3 - Frontend Console

Status: Started

- Added protected app layout, sidebar navigation, dark mode, logout, unread alert count, Socket.IO cache invalidation, login/register pages, dashboard charts, resource tables, email processing, customer detail, and AI control center.

Remaining:

- Add full create/edit/delete forms per module.
- Add richer Customer 360 tabs for CRM, invoices, tickets, meetings, and memory.
- Add workflow builder controls and report generation UI.
- Add responsive mobile navigation.

## Phase 4 - Verification

Status: Started

- `server`: `npm run build` passes.
- `client`: `npm run build` passes.
- `server`: production dependency audit passes.
- `client`: production dependency audit passes.

Remaining:

- Start MongoDB, seed data, run the API, and verify `/health`.
- Verify login with `admin@nxtbiz.local` / `Admin12345`.
- Exercise email processing, orchestration execution records, PDF URLs, workflow logs, and Socket.IO updates end to end.

## Local Run Commands

```powershell
npm.cmd install --prefix server
npm.cmd install --prefix client
npm.cmd run seed --prefix server
npm.cmd run dev --prefix server
npm.cmd run dev --prefix client
```

MongoDB must be running and `server/.env` must provide `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` for production-like verification.
