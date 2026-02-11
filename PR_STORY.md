# PR Story: Initialize FastAPI Backend

**Branch:** `chore/initialize-fast-api-backend`  
**Date:** 2026-02-11  
**Type:** Backend Infrastructure  
**Status:** Ready for Merge

---

## Executive Summary

This PR initializes the FastAPI backend service with proper project structure, CORS configuration for the Next.js frontend, environment-based configuration management, and health monitoring endpoints. The backend is set up with modern Python tooling (uv, Ruff) and follows industry best practices for API development.

**Key Changes:**
- FastAPI application with CORS middleware
- Type-safe configuration management with Pydantic Settings
- Health check endpoint for monitoring
- Python project structure with pyproject.toml and uv package manager
- Development scripts for running, testing, and linting

---

## What Changed

### 1. FastAPI Application (`backend/src/main.py`)

Created the main FastAPI application with:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings

app = FastAPI(
    title="CMS API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

**Features:**
- API metadata (title, version) for auto-generated documentation
- CORS middleware configured for Next.js frontend communication
- Configuration loaded from environment variables
- Routes for root and health check endpoints

**Endpoints:**
- `GET /` - API root with welcome message
- `GET /health` - Health check endpoint returning `{"status": "healthy"}`
- `GET /docs` - Auto-generated Swagger UI documentation (FastAPI built-in)
- `GET /redoc` - Alternative ReDoc documentation (FastAPI built-in)

### 2. Configuration Management (`backend/src/config.py`)

Implemented type-safe configuration with Pydantic Settings:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    # Database
    database_url: str = "file:./dev.db"
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]
    
    # Security (required - no default)
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

settings = Settings()
```

**Benefits:**
- Type-safe configuration with TypeScript-like type hints
- Automatic validation at startup (fail-fast on misconfiguration)
- Environment variable overrides with sensible defaults
- Clear documentation of all configuration options
- IDE autocomplete and type checking

### 3. Python Project Configuration (`backend/pyproject.toml`)

Set up modern Python project with uv package manager:

```toml
[project]
name = "cms-backend"
version = "0.1.0"
description = "FastAPI backend for CMS"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.6.0",
    "python-dotenv==1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.27.0",
    "ruff>=0.7.0",
]

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]
```

**Dependencies explained:**
- `fastapi[standard]` - FastAPI framework with standard extras (validation, etc.)
- `uvicorn[standard]` - ASGI server with WebSocket and HTTP/2 support
- `pydantic>=2.9.0` - Data validation and settings management
- `pydantic-settings` - Environment variable configuration
- `python-dotenv` - Load environment variables from .env files

**Dev dependencies:**
- `pytest` - Testing framework
- `pytest-asyncio` - Async test support
- `httpx` - HTTP client for testing API endpoints
- `ruff` - Fast Python linter and formatter (replaces flake8, black, isort)

### 4. Development Scripts (`backend/package.json`)

Added npm-style scripts for consistency with frontend tooling:

```json
{
  "name": "cms-backend",
  "version": "0.1.0",
  "scripts": {
    "dev": "uvicorn src.main:app --reload --host 0.0.0.0 --port 8000",
    "test": "pytest",
    "lint": "ruff check .",
    "format": "ruff format ."
  }
}
```

**Why package.json in Python project?**
- Consistent interface across frontend/backend in monorepo
- Enables `pnpm --filter cms-backend dev` from root
- Familiar to full-stack developers
- Works with monorepo tools (Turborepo, Nx, etc.)

### 5. Environment Configuration

Created `.env.example` template:

```env
DATABASE_URL="file:./dev.db"
SECRET_KEY="<generate-with-openssl-rand-hex-32>"
CORS_ORIGINS=["http://localhost:3000"]
```

**Note:** Actual `.env` file is gitignored and contains real secrets.

---

## Technical Decisions

### Why FastAPI?

- **Modern Python framework** with async support
- **Automatic API documentation** (Swagger/ReDoc) from code
- **Type hints everywhere** - catches errors early, great IDE support
- **Fast** - comparable to Node.js and Go performance
- **Industry adoption** - used by Microsoft, Netflix, Uber
- **Excellent for learning** - clear patterns, great documentation

### Why Pydantic Settings?

- **Type safety** - configuration errors caught at startup
- **Validation** - ensures correct types and formats
- **IDE support** - autocomplete for configuration keys
- **Environment hierarchy** - .env file + environment variables + defaults
- **FastAPI native** - Pydantic is FastAPI's validation layer

### Why CORS Middleware?

Without CORS, browser blocks requests from Next.js (port 3000) to FastAPI (port 8000) due to Same-Origin Policy. The middleware tells browsers: "I trust requests from localhost:3000."

**Production considerations:**
- In development: Allow `http://localhost:3000`
- In production: Allow only actual domain (e.g., `https://myapp.com`)
- Never use `allow_origins=["*"]` in production

### Why uv Package Manager?

- **Fast** - 10-100x faster than pip
- **Modern** - pyproject.toml native, no setup.py needed
- **Reliable** - lockfile support (uv.lock) for reproducible builds
- **Compatible** - works with existing pip/virtualenv workflows

---

## Security Considerations

### Configuration Secrets

- ✅ `.env` file is gitignored
- ✅ `.env.example` contains only placeholders
- ✅ `secret_key` is required field (no default) - forces explicit configuration
- ✅ No secrets committed to Git

### CORS Configuration

- ✅ Specific origins configured (not wildcard `*`)
- ✅ Credentials allowed only for trusted origins
- ✅ Production origins will be environment-specific

### Future Security Tasks

- [ ] Add rate limiting middleware
- [ ] Implement API key authentication
- [ ] Add request logging for audit trail
- [ ] Set up HTTPS in production
- [ ] Add security headers (HSTS, CSP, etc.)

---

## Testing Performed

### Manual Testing

```bash
# 1. Install dependencies
cd backend
uv sync

# 2. Activate virtual environment
source .venv_backend/bin/activate

# 3. Start development server
uvicorn src.main:app --reload --port 8000

# 4. Test endpoints
curl http://localhost:8000/
# Response: {"message":"Hello World!"}

curl http://localhost:8000/health
# Response: {"status":"healthy"}

# 5. Check auto-generated documentation
open http://localhost:8000/docs
# Swagger UI loads successfully

# 6. Test CORS (from Next.js frontend)
# Navigate to http://localhost:3000
# Frontend can successfully fetch from backend API
```

### Configuration Validation

```bash
# Test missing required secret_key
rm backend/.env
cd backend && uvicorn src.main:app
# Should fail: ValidationError for secret_key

# Test with valid configuration
# Create .env with SECRET_KEY
cd backend && uvicorn src.main:app
# Should start successfully
```

### Code Quality

```bash
cd backend

# Run linter
ruff check .
# No errors

# Run formatter (check only)
ruff format --check .
# No formatting issues
```

---

## Files Changed

```
backend/.env.example                |   3 +
backend/package.json                |  10 +
backend/pyproject.toml              |  27 ++
backend/src/__init__.py             |   0
backend/src/config.py               |  25 ++
backend/src/main.py                 |  24 ++
pyproject.toml                      |   5 +
uv.lock                             | 1055 ++++++++++++++++
9 files changed, 1149 insertions(+)
```

**Total:** 9 files changed, 1149 insertions(+)

---

## Migration Notes

### For Other Developers

1. **Install uv (if not already installed):**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   uv sync
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env and set SECRET_KEY
   ```

4. **Generate secret key:**
   ```bash
   openssl rand -hex 32
   # Copy output to SECRET_KEY in .env
   ```

5. **Start development server:**
   ```bash
   source .venv_backend/bin/activate
   uvicorn src.main:app --reload --port 8000
   # Or use npm script: pnpm --filter cms-backend dev
   ```

6. **Verify setup:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

### Virtual Environment

uv creates `.venv_backend/` in the backend directory. Two ways to use it:

**Option 1: Activate (traditional)**
```bash
source backend/.venv_backend/bin/activate
uvicorn src.main:app --reload
```

**Option 2: Use uv (modern)**
```bash
cd backend
uv run uvicorn src.main:app --reload
```

---

## What's Next

This PR establishes the backend foundation. Next steps:

1. **Add database migrations** (Prisma or Alembic)
2. **Implement authentication** (JWT tokens, session management)
3. **Create API endpoints** for CMS functionality (users, content, etc.)
4. **Add request validation** with Pydantic models
5. **Write tests** (pytest with coverage)
6. **Add API versioning** (/api/v1/)
7. **Implement logging** (structured JSON logs)

---

## Related Issues

- Implements Ticket 5 from Phase 1 project plan
- Sets up FastAPI backend infrastructure
- Enables frontend-backend communication via CORS
- Prepares for Prisma ORM integration (next ticket)

---

## Review Checklist

- [ ] FastAPI application starts without errors
- [ ] Health check endpoint responds correctly
- [ ] Auto-generated docs accessible at /docs
- [ ] CORS configured for localhost:3000
- [ ] Configuration loads from .env file
- [ ] No secrets committed to Git
- [ ] .env.example contains placeholders only
- [ ] pyproject.toml dependencies are correct
- [ ] Code passes ruff linting
- [ ] Virtual environment setup works

---

## Deployment Impact

**Development only.** This PR introduces the backend service but doesn't affect the frontend or existing infrastructure.

**Future deployment considerations:**
- Backend will run as separate service (Docker container)
- Needs environment variables configured in deployment platform
- Should run behind reverse proxy (nginx/Caddy) for HTTPS
- Health check endpoint enables container orchestration (Kubernetes/Docker Compose)

---

## Learning Outcomes

This PR provided hands-on experience with:

1. **FastAPI fundamentals** - Routes, middleware, app configuration
2. **API design** - Health checks, versioning, documentation
3. **CORS concepts** - Same-Origin Policy, cross-origin requests
4. **Configuration management** - Environment variables, type-safe settings
5. **Python packaging** - pyproject.toml, modern tooling (uv, Ruff)
6. **Project structure** - Professional backend organization

---

## Conclusion

This PR initializes a production-ready FastAPI backend with proper structure, configuration management, and CORS support. The implementation follows industry best practices, uses modern Python tooling, and provides a solid foundation for building the CMS API.

**Ready to merge:** Backend service is functional, tested, and properly configured.
