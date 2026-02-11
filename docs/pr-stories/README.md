# Pull Request Stories Archive

This directory contains archived PR stories from the project. The active/current PR story is always at the root level as `PR_STORY.md`.

## Archive System

- **Current PR:** `../../PR_STORY.md` (root level)
- **Archived PRs:** Stored here with numbered prefixes
- **Workflow:** When PR is merged, move PR_STORY.md here with appropriate number

## Archived PRs

### 001 - Environment Variables and Project Documentation

- **File:** [001-environment-variables-and-secrets.md](./001-environment-variables-and-secrets.md)
- **Branch:** `chore/set-environment-variables-and-secrets`
- **Date:** 2026-02-10
- **Status:** Merged
- **Summary:** Established security foundation with environment validation, project documentation (SKILL.md), security memos, and NextAuth dependencies.

### 002 - Initialize FastAPI Backend

- **File:** Currently active as `../../PR_STORY.md`
- **Branch:** `chore/initialize-fast-api-backend`
- **Date:** 2026-02-11
- **Status:** Ready for Merge
- **Summary:** Set up FastAPI backend with CORS, Pydantic Settings, health check endpoint, and modern Python tooling.

---

## Naming Convention

Format: `NNN-brief-description.md`

- **NNN:** Three-digit sequential number (001, 002, etc.)
- **brief-description:** Lowercase, hyphen-separated description
- **Extension:** Always `.md`

Examples:

- `001-environment-variables-and-secrets.md`
- `002-initialize-fastapi-backend.md`
- `003-prisma-orm-setup.md`

---

## What to Include in PR Stories

Each PR story should document:

1. **Executive Summary** - High-level overview and key changes
2. **What Changed** - Detailed breakdown of modifications
3. **Technical Decisions** - Why choices were made, alternatives considered
4. **Security Considerations** - Security implications and measures taken
5. **Testing Performed** - Manual and automated testing
6. **Files Changed** - Git diff summary
7. **Migration Notes** - Setup instructions for other developers
8. **What's Next** - Follow-up tasks and future work
9. **Learning Outcomes** - Skills and concepts learned (for portfolio)

---

## Security Note

**Never include actual secrets in PR stories:**

- ❌ Real API keys, tokens, passwords
- ❌ Database connection strings with credentials
- ❌ Private keys or certificates
- ✅ Use placeholders: `<generate-with-openssl-rand-hex-32>`
- ✅ Use dummy values: `"short"` (for testing examples)
- ✅ Reference generation commands: `openssl rand -hex 32`

---

## Maintenance

When merging a PR:

1. Verify `PR_STORY.md` contains no secrets
2. Move `PR_STORY.md` to `docs/pr-stories/NNN-description.md`
3. Update this README with the new archive entry
4. Create new `PR_STORY.md` for next PR
5. Commit the archive changes with the merge

---

## Purpose

These PR stories serve multiple purposes:

- **Documentation** - Historical record of project decisions
- **Learning** - Reflection on technical growth and concepts learned
- **Portfolio** - Demonstrates professional development practices
- **Onboarding** - Helps new contributors understand project evolution
- **Reference** - Quick lookup for "why did we do it this way?"
