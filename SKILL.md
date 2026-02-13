---
name: react-cms-learning-project
description: React 19 + Next.js 15 learning project with security-first approach. Building a Content Management System to refresh React knowledge and learn modern patterns, Server Components security, and professional development workflows.
version: 1.0.0
created: 2026-02-08
---

# React CMS Learning Project

## Project Context

This is a **learning-oriented but professionally structured** project to refresh React knowledge (from React 18/19 era) and learn current best practices in 2026. The focus is on understanding modern React patterns, Server Components security, and professional development workflows.

**Important:** This is a portfolio project. All code must be human-written, explainable, and production-minded. No AI-generated slop.

## Learning Objectives

### Primary Goals

1. **React 19 & Next.js 15 App Router** - Modern patterns, Server Components, Client Components
2. **Security-first development** - Learn from recent CVEs, implement proper authorization
3. **Professional workflows** - Docker, CI/CD, testing, clean Git history
4. **Full-stack integration** - React frontend + Python backend + PostgreSQL

### Secondary Goals

1. Modern state management (TanStack Query, Zustand)
2. Authentication with NextAuth.js v5
3. Type-safe development with TypeScript
4. Component architecture with shadcn/ui
5. Comprehensive testing (unit, integration, E2E, security)

## Technology Stack

### Frontend

- **React 19.2+** (patched for security vulnerabilities)
- **Next.js 15.5.7+ / 16.0.7+** (App Router, patched for CVE-2025-66478)
- **TypeScript** (strict mode)
- **TanStack Query v5** (server state management)
- **Zustand** (client UI state)
- **Tailwind CSS + shadcn/ui** (styling and components)
- **NextAuth.js v5** (authentication)

### Backend (Phase 1)

- **Python + FastAPI** (primary backend)
- **Prisma** (ORM with type generation)
- **PostgreSQL** (production) / **SQLite** (development)
- **Pydantic** (validation)

### Backend (Phase 2 - Optional)

- **Go + Fiber/Chi** (learning opportunity, built after Python backend)

### Infrastructure

- **Monorepo** structure (frontend + backend in same repo)
- **Docker + docker-compose** (containerization)
- **GitHub Actions** (CI/CD with security scanning)
- **VPS deployment** (Docker + Hetzner/DigitalOcean)

## Application: Content Management System

### Core Features

- **CRUD operations** - Create, read, update, delete content
- **Categories & tags** - Organize content
- **Search functionality** - Full-text search
- **Media management** - Upload and manage images/files

### Rich Editor

- **Markdown/WYSIWYG** editor
- **Media upload** integration
- **Draft/Publish workflow**

### Multi-user Collaboration

- **Roles:** Admin, Editor, Viewer
- **Permissions system** - Role-based access control (RBAC)
- **Content sharing** - Collaborative editing

## Security Focus

### Critical Vulnerabilities to Learn From

1. **CVE-2025-66478** (CVSS 10.0) - Remote Code Execution in Server Components
2. **CVE-2025-55184** (High) - Denial of Service
3. **CVE-2025-55183** (Medium) - Source Code Exposure
4. **CVE-2026-23864** (CVSS 7.5) - DoS via excessive CPU usage

### Security Principles

1. **Authorization first** - Every Server Function must check permissions
2. **Input validation** - Validate and sanitize all user input (Zod)
3. **Security headers** - CSP with nonces, HSTS, X-Frame-Options
4. **Secrets management** - Environment variables, never commit secrets
5. **Rate limiting** - Prevent enumeration and DoS attacks
6. **Data filtering** - Never expose sensitive data to client

### Security Checklist (Per Feature)

Before marking any feature complete, verify:

- [ ] **Authorization**: Does this Server Function check user permissions?
- [ ] **Input Validation**: Are all inputs validated with Zod schemas?
- [ ] **Sanitization**: Is user input sanitized before database operations?
- [ ] **Data Filtering**: Are sensitive fields excluded from responses?
- [ ] **Error Handling**: Do errors avoid leaking sensitive information?
- [ ] **Rate Limiting**: Are expensive operations rate-limited?
- [ ] **CSRF Protection**: Are state-changing operations protected?
- [ ] **XSS Prevention**: Is user-generated content properly escaped?
- [ ] **SQL Injection**: Are queries parameterized (Prisma handles this)?
- [ ] **Logging**: Aresecurity events logged (auth failures, permission denials)?

## Project Structure

```ascii
web_app_react/
├── frontend/                      # Next.js application
│   ├── app/                       # App Router
│   │   ├── (auth)/               # Auth routes (login, register)
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── api/                  # API routes (if needed)
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── server/               # Server Components
│   │   ├── client/               # Client Components
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── auth.ts               # NextAuth config
│   │   ├── store.ts              # Zustand store
│   │   └── query-client.ts       # TanStack Query setup
│   ├── actions/                  # Server Actions
│   ├── proxy.ts                  # Security headers & CSP
│   ├── Dockerfile
│   └── package.json
├── backend/                       # Python FastAPI
│   ├── src/
│   │   ├── api/                  # API routes
│   │   ├── models/               # Database models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── services/             # Business logic
│   │   ├── auth/                 # Authentication
│   │   └── main.py               # FastAPI app
│   ├── tests/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── Dockerfile
│   └── pyproject.toml
├── docker-compose.yml             # Local development
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml
│       └── backend-ci.yml
├── docs/                          # Documentation
│   └── security-memos/           # Security learning memos
├── README.md                      # Public-facing documentation
├── devlog.md                      # Development log (gitignored)
└── SKILL.md                       # This file (gitignored)
```

## Development Phases

### Phase 0: Security Foundation (Learning)

**Goal:** Understand security landscape before coding

- [ ] Review Server Components vulnerabilities (CVE-2025-66478, etc.)
- [ ] Study authorization patterns and broken access control
- [ ] Learn CSP, nonces, and security headers
- [ ] Understand NextAuth.js architecture

**Learning outcomes:**

- Can explain what went wrong in recent CVEs
- Understands authorization vs authentication
- Knows when to use Server vs Client Components for security

### Phase 1: Project Setup & Security Configuration

**Goal:** Professional foundation with security built-in

- [ ] Initialize monorepo structure
- [ ] Set up Next.js 15.5.7+ with TypeScript
- [ ] Configure security headers (CSP with nonces, HSTS)
- [ ] Set up FastAPI backend with Prisma
- [ ] Configure NextAuth.js with database sessions
- [ ] Set up Docker and docker-compose
- [ ] Configure ESLint, Prettier, TypeScript strict mode
- [ ] Set up GitHub Actions with security scanning
- [ ] Create initial README

**Learning outcomes:**

- Understands monorepo structure
- Can configure CSP with nonces
- Knows how to set up NextAuth.js
- Can write Dockerfiles and docker-compose

### Phase 2: Authentication & Authorization

**Goal:** Secure user management and access control

- [ ] Implement NextAuth.js with credentials provider
- [ ] Create user registration with input validation
- [ ] Implement role-based access control (Admin, Editor, Viewer)
- [ ] Create authorization helpers for Server Functions
- [ ] Add session management
- [ ] Implement rate limiting for auth endpoints

**Learning outcomes:**

- Understands session-based authentication
- Can implement RBAC
- Knows how to validate user input securely
- Can prevent enumeration attacks

### Phase 3: Server Components & Secure Data Fetching

**Goal:** Learn Server Components with proper authorization

- [ ] Build content list page (Server Component)
- [ ] Implement server-side data fetching with authorization
- [ ] Add caching and revalidation strategies
- [ ] Create loading and error states
- [ ] Filter sensitive data before sending to client
- [ ] Add pagination and sorting

**Learning outcomes:**

- Understands Server Components data fetching
- Can implement proper authorization checks
- Knows how to use Next.js caching
- Can filter sensitive data

### Phase 4: Client Components & TanStack Query

**Goal:** Interactive UI with client-side data management

- [ ] Build interactive content table (Client Component)
- [ ] Set up TanStack Query for client-side fetching
- [ ] Implement real-time search with input validation
- [ ] Add optimistic updates with `useOptimistic`
- [ ] Implement column sorting and filtering
- [ ] Add loading skeletons

**Learning outcomes:**

- Understands when to use Client Components
- Can use TanStack Query effectively
- Knows how to implement optimistic updates
- Can validate input on client and server

### Phase 5: Forms & Server Actions

**Goal:** Secure form handling with React 19 Actions

- [ ] Set up Zustand for UI state (modals, filters)
- [ ] Build content editor with rich text
- [ ] Implement Server Actions with `useActionState`
- [ ] Add input validation with Zod
- [ ] Implement CSRF protection
- [ ] Add form error handling and user feedback
- [ ] Implement draft/publish workflow

**Learning outcomes:**

- Understands React 19 Actions
- Can use `useActionState` and `useOptimistic`
- Knows how to validate forms with Zod
- Can implement secure form submission

### Phase 6: Advanced Features

**Goal:** Complete CMS functionality

- [ ] Implement categories and tags
- [ ] Add media upload with validation
- [ ] Build search functionality
- [ ] Implement content sharing and permissions
- [ ] Add activity logs
- [ ] Create admin dashboard

**Learning outcomes:**

- Can build complex features securely
- Understands file upload security
- Can implement full-text search
- Knows how to log security events

### Phase 7: Testing & Security Hardening

**Goal:** Production-ready application

- [ ] Write unit tests for critical functions
- [ ] Add integration tests for API endpoints
- [ ] Implement E2E tests with Playwright
- [ ] Add security tests (OWASP Top 10)
- [ ] Perform security audit
- [ ] Add error boundaries (without leaking info)
- [ ] Implement proper logging and monitoring
- [ ] Review and clean up commit history

**Learning outcomes:**

- Can write comprehensive tests
- Understands security testing
- Knows how to audit for vulnerabilities
- Can write production-ready code

### Phase 8 (Optional): Go Backend

**Goal:** Learn Go and compare with Python

- [ ] Design Go backend architecture
- [ ] Implement API with Fiber/Chi
- [ ] Port business logic from Python
- [ ] Compare performance and DX
- [ ] Document learnings

**Learning outcomes:**

- Understands Go for backend development
- Can compare language trade-offs
- Knows when to choose Go vs Python

## Code Review Guide

When reviewing your code, I will check:

### Architecture & Design

- [ ] Is this the right place for this code?
- [ ] Server Component vs Client Component choice correct?
- [ ] Is the component/function doing one thing well?
- [ ] Are there any unnecessary dependencies?

### Security

- [ ] Authorization check present in Server Functions?
- [ ] Input validation with Zod?
- [ ] Sensitive data filtered before client?
- [ ] Error messages don't leak information?
- [ ] Rate limiting for expensive operations?

### Code Quality

- [ ] TypeScript types correct and meaningful?
- [ ] Variable/function names clear and descriptive?
- [ ] Comments explain "why" not "what"?
- [ ] Error handling comprehensive?
- [ ] No magic numbers or strings?

### Testing

- [ ] Critical paths covered by tests?
- [ ] Edge cases considered?
- [ ] Security scenarios tested?

### Git & Documentation

- [ ] Commit message clear and descriptive?
- [ ] Changes atomic and focused?
- [ ] README updated if needed?
- [ ] No secrets or sensitive data committed?

## Learning Resources

### Security Memos (Created During Project)

Located in `docs/security-memos/` (gitignored):

1. **Server Components Vulnerabilities** - CVE analysis and prevention
2. **Authorization Patterns** - Broken access control and fixes
3. **Input Validation & Sanitization** - Zod patterns and XSS prevention
4. **Content Security Policy** - CSP with nonces implementation
5. **Authentication Strategies** - NextAuth.js deep dive
6. **Secrets Management** - Environment variables and rotation
7. **Rate Limiting & DoS Prevention** - Implementation strategies
8. **OWASP Top 10 for React** - Common vulnerabilities
9. **Secure Data Fetching** - Preventing data leaks, taint API
10. **Security Testing** - SAST, DAST, penetration testing

### Official Documentation

- [React 19 Docs](https://react.dev)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [NextAuth.js v5 Docs](https://authjs.dev)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Prisma Docs](https://www.prisma.io/docs)

## Success Criteria

By the end of this project, you will be able to:

### Security checks

- ✅ Explain recent Server Components vulnerabilities and how to prevent them
- ✅ Implement proper authorization in every Server Function
- ✅ Validate and sanitize all user input
- ✅ Configure security headers (CSP, HSTS, etc.)
- ✅ Prevent common attacks (XSS, CSRF, SQL injection, enumeration)

### React & Next.js

- ✅ Choose between Server and Client Components correctly
- ✅ Fetch data securely in both Server and Client Components
- ✅ Use React 19 features (Actions, useActionState, useOptimistic)
- ✅ Implement proper caching and revalidation

### State Management

- ✅ Use TanStack Query for server state
- ✅ Use Zustand for client UI state
- ✅ Know when NOT to use client state

### Professional Development

- ✅ Write clean, maintainable, testable code
- ✅ Create comprehensive tests
- ✅ Use Docker for development and deployment
- ✅ Set up CI/CD with security scanning
- ✅ Write meaningful commit messages and clean Git history
- ✅ Document decisions and architecture

### Portfolio

- ✅ Have a production-ready, portfolio-worthy project
- ✅ Code that looks human-written and professional
- ✅ Demonstrate security awareness
- ✅ Show understanding of modern development workflows

## My Role (AI Assistant)

I will:

- **Mentor on security** - Explain vulnerabilities with real-world examples
- **Create security memos** - Detailed guides on security topics
- **Explain concepts** - Before implementation, with reasoning
- **Provide context** - Why we choose certain patterns
- **Review code** - Check for security issues and suggest improvements
- **Guide workflows** - Docker, Git, CI/CD, testing
- **Ensure quality** - Code looks human-written and professional

I will NOT:

- Write code for you (I provide guidance and examples)
- Make decisions without presenting options
- Skip explanations
- Use AI-revealing language in commits or docs

## Your Role (Developer)

You will:

- **Write the code** - Own the implementation
- **Make decisions** - Choose between presented options
- **Explain your code** - Be able to justify every line
- **Learn by doing** - Not by copying
- **Ask questions** - When something is unclear
- **Review security memos** - Apply principles in your code

## Notes

- This is a **learning project** - Focus on understanding, not speed
- **Security is paramount** - Never skip authorization or validation
- **Professional standards** - All code must be portfolio-ready
- **Human-written appearance** - No AI slop, no generated comments
- **Iterative approach** - Build, learn, refactor, improve

## Markdown Formatting Standards

When creating or editing Markdown files (`.md`), follow these rules to pass markdownlint:

- **Blank lines around headings:** Always add a blank line before AND after headings (except at start/end of file)
- **Blank lines around lists (MD032):** Always add a blank line before and after a list. Rule: `MD032/blanks-around-lists` — lists should be surrounded by blank lines.
- **Blank lines around code blocks:** Always add a blank line before and after fenced code blocks
- **Example violations:**

  ```markdown
  ## Heading
  - List item    ❌ Missing blank line after heading
  
  Text here.
  - List item    ❌ Missing blank line before list
  ```

- **Correct format:**

  ```markdown
  ## Heading
  
  - List item    ✅ Blank line after heading
  
  Text here.
  
  - List item    ✅ Blank line before list
  ```

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-08  
**Status:** Active Learning Project
