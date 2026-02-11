# PR Story: Environment Variables and Project Documentation

**Branch:** `chore/set-environment-variables-and-secrets`  
**Date:** 2026-02-10  
**Type:** Infrastructure & Documentation  
**Status:** Merged

---

## Executive Summary

This PR establishes the foundational security and documentation infrastructure for the React CMS learning project. It introduces comprehensive project documentation (SKILL.md), security learning materials (security memos), environment variable validation with Zod, and necessary authentication dependencies.

**Key Changes:**
- Project context and learning objectives documented
- Security-first development approach defined
- Type-safe environment variable validation implemented
- NextAuth.js and Zod dependencies added
- Security memo template and Server Components vulnerability guide created

---

## What Changed

### 1. Project Documentation (SKILL.md)

Created comprehensive project documentation covering:

- **Learning objectives**: React 19 + Next.js 15, security-first development, professional workflows
- **Technology stack**: Full-stack setup with React 19, Next.js 15, Python/FastAPI, PostgreSQL
- **Security focus**: CVE awareness (CVE-2025-66478, CVE-2025-55184, etc.)
- **Project structure**: Monorepo organization with frontend/backend separation
- **Development phases**: Phased approach from security foundation to production deployment

**Impact:** Provides persistent context for development decisions and onboarding.

### 2. Security Documentation

Created two security memos in `docs/security-memos/`:

#### 00-memo-writing-guide.md
Internal template for consistent security documentation:
- Educational-first approach
- Code-heavy examples (vulnerable vs secure)
- Practical checklists and testing strategies
- Professional tone for portfolio work

#### 01-server-components-vulnerabilities.md
Comprehensive guide on React Server Components security:
- **CVE-2025-66478** (CVSS 10.0) - RCE vulnerability analysis
- Authorization vs authentication patterns
- Server Actions security best practices
- Input validation with Zod
- Real-world vulnerable vs secure code examples
- Testing and prevention strategies

**Impact:** Learning resource for security-conscious development, demonstrates understanding of modern React security landscape.

### 3. Environment Variable Validation

Created `frontend/lib/env.ts` with Zod validation schema:

```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.url({ protocol: /^https?$/ }),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.url({ protocol: /^https?$/ }),
});
```

**Features:**
- Type-safe environment variable access
- Runtime validation on application startup
- Protocol validation (http/https only) for security
- Minimum length validation for secrets
- Clear error messages for missing/invalid variables

**Security benefits:**
- Prevents misconfiguration in production
- Catches missing variables at startup (fail-fast)
- Rejects non-HTTP(S) protocols (e.g., ftp://, file://)
- Ensures NextAuth secret meets minimum security requirements

### 4. Dependencies Added

#### Authentication & Validation
- `next-auth@5.0.0-beta.26` - Authentication framework
- `zod@4.3.6` - Schema validation
- `@auth/prisma-adapter@^2.9.1` - Database adapter for NextAuth

**Rationale:**
- NextAuth v5 (beta) for latest Next.js 15 compatibility
- Zod v4 for modern schema validation with `z.url()` support
- Prisma adapter for session persistence (security best practice)

### 5. .gitignore Updates

#### Root .gitignore
Fixed Python `lib/` pattern to avoid ignoring frontend source:
```diff
- lib/
- lib64/
+ /lib/
+ /lib64/
+ backend/lib/
+ backend/lib64/
```

#### Frontend .gitignore
Added environment file patterns:
```gitignore
.env
.env.local
.env.*.local
```

**Impact:** Prevents committing secrets while allowing `frontend/lib/` source code.

---

## Technical Decisions

### Why Zod v4?

- Native `z.url()` primitive (not deprecated `z.string().url()`)
- Protocol validation: `z.url({ protocol: /^https?$/ })`
- Better error messages and TypeScript inference
- Modern API for v4.x (latest stable)

### Why NextAuth v5 Beta?

- Best compatibility with Next.js 15 App Router
- Modern Server Actions support
- Improved TypeScript types
- Production-ready despite beta label (widely adopted)

### Environment Variable Strategy

**Runtime validation over compile-time:**
- Catches misconfiguration immediately on startup
- Provides clear error messages for operations teams
- Validates format (URLs, minimum lengths) not just presence
- Exports typed `env` object for type-safe access throughout codebase

---

## Security Checklist

- [x] No secrets committed to Git
- [x] Environment files in .gitignore
- [x] Environment variables validated at runtime
- [x] URL protocol validation (only http/https)
- [x] Minimum secret length enforced (32 chars)
- [x] Documentation references security CVEs
- [x] Code examples show secure patterns

---

## Testing Performed

### Environment Validation
```bash
# Test missing variable
unset NEXTAUTH_URL
pnpm dev  # Should fail with clear Zod error

# Test invalid URL
NEXTAUTH_URL="ftp://example.com"
pnpm dev  # Should fail (protocol validation)

# Test short secret
NEXTAUTH_SECRET="short"
pnpm dev  # Should fail (min 32 chars)

# Test valid config
# Uses .env.local with valid values
pnpm dev  # Should start successfully
```

### Dependency Installation
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install  # Should complete without errors
```

### Linting & Type Checking
```bash
cd frontend
pnpm lint      # No errors
pnpm type-check # No TypeScript errors
```

---

## Files Changed

```
.gitignore                                         |    4 +-
SKILL.md                                           |  479 +++
docs/security-memos/00-memo-writing-guide.md       |  515 +++
docs/security-memos/01-server-components-vulnerabilities.md | 643 +++
frontend/.gitignore                                |    5 +
frontend/lib/env.ts                                |   15 +
frontend/package.json                              |    4 +-
frontend/pnpm-lock.yaml                            | 4186 ++++++++
package.json                                       |    3 +-
pnpm-lock.yaml                                     |  123 +
```

**Total:** 10 files changed, 5977 insertions(+), 2 deletions(-)

---

## Migration Notes

### For Other Developers

1. **Copy environment template:**
   ```bash
   cp frontend/.env.example frontend/.env.local  # (if .env.example exists)
   # Or manually create .env.local with required variables
   ```

2. **Set environment variables:**
   ```bash
   # Required variables (see frontend/lib/env.ts)
   DATABASE_URL="file:./data/dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

3. **Generate NextAuth secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Verify setup:**
   ```bash
   cd frontend
   pnpm dev  # Should start without errors
   ```

### For CI/CD

Environment variables must be set in GitHub Secrets:
- `NEXTAUTH_URL` - Production URL (https://yourdomain.com)
- `NEXTAUTH_SECRET` - Strong random secret (32+ chars)
- `DATABASE_URL` - Production database connection string
- `NEXT_PUBLIC_API_URL` - Production API endpoint

---

## What's Next

This PR sets up the foundation. Next steps:

1. **Implement NextAuth configuration** (`lib/auth.ts`)
2. **Set up Prisma schema** for user/session tables
3. **Create authentication pages** (login, register)
4. **Add authorization helpers** for Server Actions
5. **Implement rate limiting** for auth endpoints

---

## Related Issues

- Implements environment variable setup from Phase 1 project plan
- Addresses CVE-2025-66478 awareness (documented in security memo)
- Prepares for NextAuth.js integration (dependencies added)

---

## Review Notes

### What to Check

- [ ] SKILL.md accurately reflects project goals and tech stack
- [ ] Security memo content is technically accurate
- [ ] Environment validation schema matches .env.local requirements
- [ ] .gitignore patterns correctly exclude Python lib/ but not frontend/lib/
- [ ] No sensitive information committed (secrets, API keys, etc.)
- [ ] Dependencies are appropriate versions (NextAuth v5 beta, Zod v4)

### Questions for Reviewer

None - this is a straightforward infrastructure/documentation PR. All changes are non-breaking and additive.

---

## Deployment Impact

**None.** This PR only adds:
- Documentation files
- Type definitions
- Dependencies
- Environment validation (runs at startup)

No runtime behavior changes to existing code. Application will fail fast if environment is misconfigured (desirable for operations).

---

## Conclusion

This PR establishes the security-first foundation for the React CMS project. It documents learning objectives, provides security resources, adds necessary authentication dependencies, and implements type-safe environment variable validation. All changes support the goal of building a professional, secure, portfolio-quality application.

**Ready to merge:** All changes are tested, documented, and follow project conventions.
