# Bash Scripts & Terminal Commands

A comprehensive guide to terminal workflows, shell scripts, and command documentation for this project.

---

## Table of Contents

1. [Project Setup & Installation](#project-setup--installation)
2. [Development Workflows](#development-workflows)
3. [Database & Prisma](#database--prisma)
4. [Testing & Quality](#testing--quality)
5. [Git Workflows](#git-workflows)
6. [Docker & Containers](#docker--containers)
7. [Utility Scripts](#utility-scripts)
8. [Troubleshooting](#troubleshooting)

---

## Project Setup & Installation

### Initialize the project (first-time setup)

```bash
# 1. Clone repository
git clone <repo-url>
cd web_app_react

# 2. Install Node.js dependencies (pnpm workspaces)
pnpm install

# 3. Install Python backend dependencies
cd backend
uv sync

# 4. Set up environment variables
cp .env.example .env
# Edit .env and populate SECRET_KEY, DATABASE_URL, etc.
```

### Generate a secure SECRET_KEY (Python FastAPI)

```bash
# Generate 32-byte hex string for SECRET_KEY
openssl rand -hex 32

# Copy output and paste into backend/.env
# Example: SECRET_KEY=a1b2c3d4e5f6...
```

### Verify installation

```bash
# Check Node version
node --version  # Should be >=20.9.0

# Check pnpm version
pnpm --version  # Should be >=9.0.0

# Check Python version
python3 --version  # Should be >=3.12

# Check uv installation
uv --version
```

---

## Development Workflows

### Start all services (monorepo)

```bash
# From project root: runs dev servers for frontend and backend in parallel
pnpm dev
```

This command uses `pnpm --parallel -r dev` (defined in root `package.json`), which:
- Starts Next.js frontend on `http://localhost:3000`
- Starts FastAPI backend on `http://localhost:8000`

### Frontend only (Next.js)

```bash
# Development server with hot reload
cd frontend
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start
```

### Backend only (FastAPI)

```bash
# Method 1: Using uv (recommended)
cd backend
uv run uvicorn src.main:app --reload --port 8000

# Method 2: Activate venv first, then run
source backend/.venv_backend/bin/activate
uvicorn src.main:app --reload --port 8000

# Method 3: Using pnpm script (from repo root)
pnpm --filter cms-backend dev
```

### Access API documentation

Once backend is running:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`

---

## Database & Prisma

### Generate Prisma Client

```bash
# From frontend directory (where Prisma CLI is installed)
cd frontend
pnpm prisma generate

# Or from backend (pointing to schema)
cd backend
pnpm prisma generate --schema=../backend/prisma/schema.prisma
```

After generation, `@prisma/client` types are available in all packages.

### Create and apply migrations

```bash
# From backend directory (where DATABASE_URL is configured)
cd backend

# Create a new migration based on schema changes
pnpm prisma migrate dev --name <migration-name>

# Example: Add a new field to User model
pnpm prisma migrate dev --name add_user_bio

# Apply migrations without creating new one (production-like)
pnpm prisma migrate deploy

# Rollback last migration (dev only)
pnpm prisma migrate resolve --rolled-back <migration-name>
```

### Inspect database (SQLite)

```bash
# Using Prisma Studio (interactive UI)
cd backend
pnpm prisma studio

# This opens at http://localhost:5555

# Using sqlite3 CLI
sqlite3 backend/dev.db

# Common SQLite commands
.tables                    # List all tables
.schema User              # Show User table schema
SELECT * FROM User;       # Query users
.quit                     # Exit sqlite3
```

### Reset database (dev only)

```bash
# WARNING: Deletes all data
cd backend
pnpm prisma migrate reset

# This will:
# 1. Drop the database
# 2. Recreate schema from migrations
# 3. Seed data (if seed script exists)
```

---

## Testing & Quality

### Run all tests

```bash
# From project root
pnpm test

# This runs:
# - Frontend tests (if any)
# - Backend tests (pytest)
```

### Frontend testing

```bash
cd frontend

# Run tests (Jest/Vitest if configured)
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

### Backend testing (pytest)

```bash
cd backend

# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/test_main.py

# Run with verbose output
uv run pytest -v

# Run with coverage
uv run pytest --cov=src

# Run specific test function
uv run pytest tests/test_main.py::test_root_endpoint

# Watch mode (requires pytest-watch)
uv run ptw
```

### Linting & Code Quality

```bash
# Lint entire project
pnpm lint

# This runs:
# - Frontend: eslint
# - Backend: ruff check

# Frontend linting only
cd frontend
pnpm lint

# Backend linting only (Python)
cd backend
uv run ruff check .

# Auto-fix linting issues
cd backend
uv run ruff check . --fix
uv run ruff format .  # Format code (like prettier)
```

### Type checking

```bash
# Check all types
pnpm type-check

# Frontend only
cd frontend
pnpm type-check

# Backend (mypy or similar - configure as needed)
cd backend
# uv run mypy src/
```

---

## Git Workflows

### Create a feature branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/your-feature-name

# Or shorthand
git checkout -b feat/your-feature-name origin/main
```

### Commit changes

```bash
# See what changed
git status
git diff

# Stage all changes
git add .

# Or stage specific files
git add src/file1.ts backend/src/file2.py

# Commit with message
git commit -m "Brief description of changes"

# Commit with detailed message
git commit -m "$(cat <<'EOF'
Summary of changes here

- First significant change
- Second change
- Additional details

EOF
)"
```

### Push and create PR

```bash
# Push branch to remote
git push -u origin feat/your-feature-name

# Create PR using GitHub CLI
gh pr create --title "Add feature X" --body "Description here"

# Or use template
gh pr create --title "Add feature X" --fill
```

### Keep branch up-to-date

```bash
# Fetch latest main
git fetch origin main

# Rebase onto main (clean history)
git rebase origin/main

# If conflicts occur, resolve them, then:
git rebase --continue

# Or merge (keeps merge commit)
git merge origin/main
```

### Clean up branches

```bash
# Delete local branch
git branch -d feat/old-feature

# Delete remote branch
git push origin --delete feat/old-feature

# List all branches
git branch -a

# Prune deleted remote branches
git fetch -p
```

---

## Docker & Containers

### Build Docker image (when containerization is added)

```bash
# Build entire app
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Run with Docker Compose

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes too
docker-compose down -v
```

---

## Utility Scripts

### Clean dependencies and cache

```bash
# Clean entire project
pnpm clean

# This removes:
# - node_modules (all workspaces)
# - .next, dist, build artifacts

# Then reinstall
pnpm install
```

### Check dependency vulnerabilities

```bash
# Frontend
pnpm audit

# Backend
cd backend
uv pip audit
```

### Update dependencies

```bash
# Check for updates
pnpm outdated

# Update all
pnpm up --latest

# Backend
cd backend
uv sync --upgrade
```

---

## Troubleshooting

### Port already in use

```bash
# Find process using port 3000 (frontend)
lsof -i :3000

# Find process using port 8000 (backend)
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port
# Frontend: pnpm dev -- -p 3001
# Backend: uvicorn src.main:app --port 8001
```

### Clear cache and rebuild

```bash
# Frontend
cd frontend
rm -rf .next node_modules
pnpm install
pnpm build

# Backend
cd backend
rm -rf .venv_backend __pycache__
uv sync
```

### Prisma issues

```bash
# Regenerate client
pnpm prisma generate

# Push schema to database (without migration)
pnpm prisma db push

# Check schema validity
pnpm prisma validate

# Reset entire dev database
pnpm prisma migrate reset
```

### Database connection issues

```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Check if SQLite file exists
ls -la backend/dev.db

# If missing, create with migration
cd backend
pnpm prisma migrate dev --name init
```

### Module not found errors

```bash
# Clear and reinstall
pnpm install --force

# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install
```

---

## Environment Variables Reference

### Backend (backend/.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# API Configuration
API_HOST="0.0.0.0"
API_PORT=8000

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# Security
SECRET_KEY="<generate-with-openssl-rand-hex-32>"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (frontend/.env.local)

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-hex-32>"

# Backend API
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## Resources & Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [uv Package Manager](https://docs.astral.sh/uv/)
- [GitHub CLI (gh)](https://cli.github.com/)

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-13  
**Maintained by:** Development Team
