# Security Memo Writing Guide (Internal)

**Purpose:** Maintain consistency across all security memos, even across context windows  
**Audience:** AI Assistant (for internal reference)  
**Status:** Active Template

---

## Overview

This guide ensures all security memos maintain the same structure, tone, depth, and educational value. Security memos are learning resources for Valtteri, focusing on practical security implementation in React 19 + Next.js 15 applications.

---

## Core Principles

### 1. Educational First
- **Explain WHY**, not just WHAT
- Real-world context and attack scenarios
- Connect theory to practice
- Build understanding progressively

### 2. Code-Heavy
- Show vulnerable code (❌ WRONG)
- Show secure code (✅ CORRECT)
- Explain the difference
- Use realistic, production-like examples

### 3. Practical & Actionable
- Security checklists
- Testing strategies
- Step-by-step prevention
- Tools and commands

### 4. Professional Tone
- Technical but accessible
- English language (technical terms, portfolio-appropriate)
- No fluff or marketing speak
- Direct and clear

---

## Memo Structure Template

### Header
```markdown
# Security Memo #N: [Topic Title]

**Date:** [YYYY-MM-DD]  
**Topic:** [One-line description]  
**Severity:** [Critical/High/Medium/Low]  
**Status:** Active Learning

---
```

### 1. Executive Summary (Required)
- 2-3 paragraphs
- High-level overview of the security issue
- Why it matters
- **Key Takeaway:** One sentence that captures the essence

**Example:**
```markdown
## Executive Summary

[Context about the vulnerability or security principle]

[Impact and real-world implications]

**Key Takeaway:** [One critical sentence to remember]
```

### 2. Main Content Sections

#### For CVE-Based Memos:
1. **Vulnerability Overview**
   - CVE number, CVSS score
   - Discovery date
   - Affected versions
   - Patched versions

2. **What Happened?**
   - Technical explanation
   - Root cause
   - Why it was possible

3. **Attack Scenario**
   - Step-by-step attack vector
   - Vulnerable code example
   - Real-world impact

4. **Prevention**
   - Secure code example
   - Best practices
   - Tools and techniques

#### For Concept-Based Memos:
1. **Concept Explanation**
   - What is it?
   - Why does it matter?
   - Common misconceptions

2. **Vulnerable Patterns**
   - Common mistakes
   - Code examples (❌ WRONG)
   - Why they're dangerous

3. **Secure Patterns**
   - Best practices
   - Code examples (✅ CORRECT)
   - Trade-offs and considerations

4. **Implementation Guide**
   - Step-by-step
   - Tools and libraries
   - Configuration examples

### 3. Code Examples (Critical)

**Always include:**
- ❌ **WRONG** examples (clearly marked)
- ✅ **CORRECT** examples (clearly marked)
- Explanatory comments in code
- Realistic, production-like scenarios

**Code Example Format:**
```typescript
// ❌ WRONG: [Brief explanation of what's wrong]
'use server'

async function vulnerableFunction() {
  // Bad implementation
}

// ✅ CORRECT: [Brief explanation of what's right]
'use server'

async function secureFunction() {
  // Good implementation with security measures
}
```

### 4. Security Checklist (Required)
- Actionable items
- Can be copied to code reviews
- Specific to the topic

**Format:**
```markdown
## Security Checklist

Before [doing X], verify:

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3
```

### 5. Testing Section (Required)
- How to test for the vulnerability
- Code examples of tests
- Tools to use

**Format:**
```typescript
// Test: [What we're testing]
test('description', async () => {
  // Test implementation
})
```

### 6. Key Takeaways (Required)
- 5-7 bullet points
- Most important lessons
- Memorable and actionable

**Format:**
```markdown
## Key Takeaways

1. **Point 1** - Explanation
2. **Point 2** - Explanation
...
```

### 7. Additional Resources (Required)
- Official documentation
- CVE advisories
- Related memos
- Tools and libraries

### 8. Footer (Required)
```markdown
---

**Next Memo:** [Title of next memo]

---

*This memo is part of a series on security in modern React applications. For questions or clarifications, refer to the project mentor.*
```

---

## Writing Style Guidelines

### Language
- **English** throughout
- Technical terminology (not simplified)
- Clear and direct
- No unnecessary jargon

### Tone
- **Professional but educational**
- Not condescending
- Not overly formal
- Encouraging learning

### Code Comments
```typescript
// ✅ GOOD: Explain the security benefit
const validated = schema.parse(input) // Prevents injection attacks

// ❌ AVOID: State the obvious
const validated = schema.parse(input) // Parse the input
```

### Explanations
- **Start with context** (why does this matter?)
- **Show the vulnerability** (what can go wrong?)
- **Demonstrate the fix** (how to do it right?)
- **Explain the reasoning** (why does this work?)

---

## Code Example Patterns

### Pattern 1: Authorization
```typescript
// ❌ WRONG: No authorization check
'use server'
async function deleteResource(id: string) {
  await db.resource.delete({ where: { id } })
}

// ✅ CORRECT: Proper authorization
'use server'
async function deleteResource(id: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  
  const resource = await db.resource.findUnique({ where: { id } })
  if (resource.ownerId !== session.userId) {
    throw new Error('Forbidden')
  }
  
  await db.resource.delete({ where: { id } })
}
```

### Pattern 2: Input Validation
```typescript
// ❌ WRONG: No validation
'use server'
async function updateData(data: any) {
  await db.update(data)
}

// ✅ CORRECT: Zod validation
'use server'
import { z } from 'zod'

const UpdateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email()
})

async function updateData(input: unknown) {
  const data = UpdateSchema.parse(input)
  await db.update(data)
}
```

### Pattern 3: Rate Limiting
```typescript
// ❌ WRONG: No rate limiting
'use server'
async function expensiveOperation() {
  // Expensive operation
}

// ✅ CORRECT: Rate limiting
'use server'
async function expensiveOperation() {
  const identifier = await getClientIdentifier()
  const { success } = await rateLimit.check(identifier, '10 per minute')
  
  if (!success) {
    throw new Error('Rate limit exceeded')
  }
  
  // Expensive operation
}
```

### Pattern 4: Data Filtering
```typescript
// ❌ WRONG: Exposing sensitive data
'use server'
async function getUser(id: string) {
  return await db.user.findUnique({ where: { id } })
  // Returns password, email, etc.
}

// ✅ CORRECT: Filter sensitive fields
'use server'
async function getUser(id: string) {
  return await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true
      // Exclude: password, email, phone
    }
  })
}
```

---

## Planned Security Memos

### Completed
1. ✅ **Server Components Vulnerabilities** - CVE analysis (CVE-2025-66478, etc.)

### Upcoming (In Order)
2. **Authorization Patterns** - Broken access control, RBAC, permission systems
3. **Input Validation & Sanitization** - Zod patterns, XSS prevention, SQL injection
4. **Content Security Policy** - CSP with nonces, security headers implementation
5. **Authentication Strategies** - NextAuth.js deep dive, session vs JWT
6. **Secrets Management** - Environment variables, rotation, secret stores
7. **Rate Limiting & DoS Prevention** - Implementation strategies, tools
8. **OWASP Top 10 for React** - Common vulnerabilities in React apps
9. **Secure Data Fetching** - Preventing data leaks, taint API usage
10. **Security Testing** - SAST, DAST, penetration testing strategies

---

## Memo-Specific Guidelines

### Memo #2: Authorization Patterns
**Focus:**
- Broken access control (#1 OWASP)
- RBAC implementation
- Permission checking patterns
- Enumeration attack prevention

**Key Code Examples:**
- User-owned resources
- Role-based permissions
- Admin vs user vs viewer
- Permission helpers

### Memo #3: Input Validation & Sanitization
**Focus:**
- Zod schemas
- XSS prevention
- SQL injection (even with ORMs)
- File upload validation

**Key Code Examples:**
- Form validation
- API input validation
- File type checking
- Sanitization functions

### Memo #4: Content Security Policy
**Focus:**
- CSP headers
- Nonce generation
- proxy.ts configuration
- Other security headers (HSTS, X-Frame-Options)

**Key Code Examples:**
- proxy.ts implementation
- Nonce usage in components
- CSP violation reporting

### Memo #5: Authentication Strategies
**Focus:**
- NextAuth.js architecture
- Session management
- Cookie security
- How it works internally

**Key Code Examples:**
- NextAuth.js configuration
- Custom providers
- Session callbacks
- JWT vs session trade-offs

### Memo #6: Secrets Management
**Focus:**
- Environment variables
- Secret rotation
- Secret stores (AWS, Vault)
- Never hardcode secrets

**Key Code Examples:**
- .env files
- Loading secrets
- Rotation strategies
- Detecting committed secrets

### Memo #7: Rate Limiting & DoS Prevention
**Focus:**
- Rate limiting strategies
- Resource constraints
- Pagination
- Query optimization

**Key Code Examples:**
- Rate limiter implementation
- Redis-based rate limiting
- Per-user vs per-IP
- Graceful degradation

### Memo #8: OWASP Top 10 for React
**Focus:**
- Top 10 vulnerabilities
- React-specific considerations
- Server Components implications

**Key Code Examples:**
- Each OWASP category with React example

### Memo #9: Secure Data Fetching
**Focus:**
- Preventing data leaks
- Taint API
- GraphQL security
- Over-fetching prevention

**Key Code Examples:**
- Data filtering
- Taint API usage
- GraphQL field-level permissions

### Memo #10: Security Testing
**Focus:**
- SAST tools
- DAST tools
- Penetration testing
- Security CI/CD

**Key Code Examples:**
- Test examples
- CI/CD configuration
- Security scanning setup

---

## Quality Checklist

Before considering a memo complete, verify:

- [ ] Executive summary is clear and concise
- [ ] All code examples have ❌ WRONG and ✅ CORRECT versions
- [ ] Code examples are realistic and production-like
- [ ] Security checklist is actionable
- [ ] Testing section includes code examples
- [ ] Key takeaways are memorable (5-7 points)
- [ ] Additional resources are relevant and current
- [ ] Footer includes next memo reference
- [ ] Language is English throughout
- [ ] Tone is professional but educational
- [ ] No AI-revealing language
- [ ] Technical accuracy verified
- [ ] Practical and actionable advice
- [ ] Progressive learning (builds on previous memos)

---

## Context Window Handoff

When continuing across context windows, include:

1. **Which memo number** we're working on
2. **The topic** of the memo
3. **Key points to cover** (from this guide)
4. **Reference to this guide** (`docs/security-memos/00-memo-writing-guide.md`)
5. **Previous memos completed** (for consistency)

**Example Handoff:**
```
Working on Security Memo #3: Input Validation & Sanitization
- Follow structure from 00-memo-writing-guide.md
- Focus: Zod patterns, XSS prevention, SQL injection
- Include ❌ WRONG and ✅ CORRECT examples
- Memo #1 (Server Components) and #2 (Authorization) completed
```

---

## Version History

- **v1.0.0** (2026-02-08) - Initial guide created
- Structure based on Memo #1 (Server Components Vulnerabilities)
- Covers all 10 planned security memos

---

**This is an internal guide. Not for public repository.**
