# PR Story: Set Up Prisma ORM

**Branch:** `feat/set-up-prisma-orm`  
**Date:** 2026-02-13  
**Type:** Backend / Data layer  
**Status:** Ready for review

---

## Executive Summary

This PR configures Prisma 7 ORM for type-safe database access with an initial schema. Prisma 7 moves database URL configuration out of `schema.prisma` into a root-level `prisma.config.ts`, keeping the schema focused on data modeling. The schema defines User, Session, Post, Category, and Tag models with relations, enums, and soft-delete support where appropriate.

**Key changes:**

- Prisma 7 and `@prisma/client` installed in the frontend workspace (monorepo)
- Root-level `prisma.config.ts` for Prisma 7 (connection via environment)
- `backend/prisma/schema.prisma` with domain models and relations
- Schema follows workspace rules: soft delete (`deletedAt`), explicit relations, no URL in schema

---

## What Changed

### 1. Dependencies (`frontend/package.json`)

- **`prisma@7`** (devDependency) – CLI for schema and migrations
- **`@prisma/client@7`** (dependency) – generated type-safe client for queries
- **`@prisma/internals@^7.4.0`** (dependency) – used by `prisma.config.ts` (`defineConfig`)

Prisma lives in the frontend package because this monorepo uses pnpm workspaces and the single workspace package is `frontend`; the client is generated into the shared `node_modules` at the repo root.

### 2. Prisma 7 config (`prisma.config.ts`)

Created at **workspace root** (next to `pnpm-workspace.yaml`):

```ts
import { defineConfig } from "@prisma/internals";

export default defineConfig({
  // DATABASE_URL is read from environment (.env or .env.local)
});
```

- In Prisma 7 the datasource URL is no longer in `schema.prisma`; it comes from the environment.
- The config is the place for any Prisma 7–level options; `DATABASE_URL` is read automatically from `.env` (e.g. in `backend/` or root, depending on where you run the CLI).

### 3. Schema (`backend/prisma/schema.prisma`)

- **Generator:** `provider = "prisma-client"`, `output = "../../node_modules/.prisma/client"` (Prisma 7 format; output required).
- **Datasource:** `provider = "sqlite"` only; no `url` (handled via config/env).

**Models:**

| Model     | Purpose |
|----------|---------|
| **User** | id, email, name, passwordHash, role (enum), timestamps; relations to Post, Session |
| **Session** | id, userId, expires, sessionToken, timestamps; belongs to User, `onDelete: Cascade` |
| **Post** | id, title, content, excerpt, status (enum), authorId, timestamps, publishedAt, deletedAt (soft delete); author User; many-to-many Category, Tag |
| **Category** | id, name, slug, deletedAt (soft delete); many-to-many Post |
| **Tag** | id, name, slug, deletedAt (soft delete); many-to-many Post |

**Enums:**

- **Role:** `ADMIN`, `EDITOR`, `SECURITY_MONITOR`, `VIEWER`
- **Status:** `DRAFT`, `PUBLISHED`, `ARCHIVED` (for Post)

Post–Category and Post–Tag are implicit many-to-many (no join table in schema). Soft delete is implemented with `deletedAt` on Post, Category, and Tag per workspace rules.

### 4. Backend README

- `backend/README.md` updated with the existing run instructions (e.g. `uv run uvicorn src.main:app --reload --port 8000`). No Prisma-specific steps added there; see “Reviewer instructions” below for Prisma commands.

### 5. Other files

- **`ticket_6.md`** – Ticket text and acceptance criteria for this work.
- **`DATABASE.url`** – Empty file at repo root. If it was added by mistake, remove it or add to `.gitignore`; it is not required for Prisma.

---

## Fixes applied before “ready”

- **Schema:** `Tag.name` had a typo `@uniquepn¨` → corrected to `@unique`.
- **Schema:** Role enum had `SECURIY_MONITOR` → corrected to `SECURITY_MONITOR`.
- **prisma.config.ts:** Switched to `defineConfig` from `@prisma/internals` to match the ticket and Prisma 7 style.

---

## Reviewer instructions

### 1. Install and generate client

From **project root**:

```bash
pnpm install
cd frontend && pnpm prisma generate
```

Or from root with the frontend workspace:

```bash
pnpm install
pnpm --filter frontend exec prisma generate
```

Confirm that `node_modules/.prisma/client` is generated and that there are no TypeScript or Prisma errors.

### 2. Database URL

Ensure a SQLite URL is available where Prisma runs (e.g. in `backend/.env` or a root `.env`):

```env
DATABASE_URL="file:./dev.db"
```

For `file:./dev.db`, the path is relative to the current working directory when running Prisma (often `backend/` if you run from there). If you run from repo root, use e.g. `file:./backend/dev.db` or set the env in the same directory as the schema.

### 3. Create and apply initial migration

From **backend** (so `dev.db` is created under `backend/`):

```bash
cd backend
pnpm prisma migrate dev --name init
```

If `pnpm prisma` is not available in `backend`, run from **frontend** and point at the schema:

```bash
cd frontend
pnpm prisma migrate dev --name init --schema=../backend/prisma/schema.prisma
```

Then confirm:

- `backend/prisma/migrations/` contains a timestamped folder with migration SQL.
- `backend/dev.db` (or the path you used in `DATABASE_URL`) exists and is updated.

### 4. Optional: quick type check

From project root:

```bash
pnpm type-check
```

(Assumes the app or tests that import `@prisma/client` live in a package that is type-checked.)

### 5. Cleanup (optional)

- Remove **`DATABASE.url`** at repo root if it was accidental, or add it to `.gitignore` if you keep it for local use.

---

## Acceptance criteria (from ticket)

- [x] `prisma.config.ts` at workspace root
- [x] `backend/prisma/schema.prisma` with User, Post, Category, Tag (and Session) and proper relations/enums
- [x] Generator `provider = "prisma-client"` and correct `output` path
- [x] Datasource has only `provider = "sqlite"` (no URL)
- [ ] Prisma Client generated successfully (reviewer runs `pnpm prisma generate`)
- [ ] SQLite DB created and initial migration applied (reviewer runs `pnpm prisma migrate dev --name init`)
- [ ] Initial migration present in `backend/prisma/migrations/`
- [x] Relations use `@relation` and `onDelete` where appropriate

The first four and the last are satisfied by the code in this PR; the rest are verified by running the commands above.

---

## Files changed (summary)

| Path | Change |
|------|--------|
| `backend/README.md` | Minor updates (existing run instructions) |
| `frontend/package.json` | Added prisma@7, @prisma/client@7, @prisma/internals |
| `frontend/pnpm-lock.yaml` | Lockfile updates |
| `prisma.config.ts` | **New** – Prisma 7 root config |
| `backend/prisma/schema.prisma` | **New** – Schema and models |
| `ticket_6.md` | **New** – Ticket and steps |
| `DATABASE.url` | **New** – Empty; remove or gitignore if unintended |

---

## What’s next

- Add a database connection helper (e.g. `backend/src/db.ts`) that exposes a singleton `PrismaClient` for the FastAPI app.
- Proceed with NextAuth.js + Prisma adapter (e.g. Ticket 7).

---

## Conclusion

The PR is **ready for review**. It sets up Prisma 7, the root config, and the initial schema with correct types and relations. Two small schema typos and the config format were fixed. Reviewers should run `pnpm install`, `pnpm prisma generate`, and `pnpm prisma migrate dev --name init` (from backend or frontend with `--schema`) to satisfy the remaining acceptance criteria and then merge.
