# Security Memo #1: Server Components Vulnerabilities

**Date:** February 8, 2026  
**Topic:** Critical vulnerabilities in React Server Components (2025-2026)  
**Severity:** Critical  
**Status:** Active Learning

---

## Executive Summary

Between December 2025 and January 2026, multiple critical vulnerabilities were discovered in React Server Components, including a **CVSS 10.0 Remote Code Execution** vulnerability. These vulnerabilities affect Next.js applications using the App Router and demonstrate fundamental security challenges in the Server Components architecture.

**Key Takeaway:** Server Components blur the line between client and server, creating new attack surfaces. Every Server Function must be treated as a public API endpoint with proper authorization, input validation, and rate limiting.

---

## Critical Vulnerabilities Overview

### CVE-2025-66478: Remote Code Execution (CVSS 10.0)

**Discovered:** December 3, 2025  
**Severity:** Critical (10.0/10.0)  
**Impact:** Complete system compromise

#### What Happened? (RCE)

The React Server Components (RSC) protocol allowed untrusted client inputs to influence server-side execution paths. Attackers could craft malicious requests that triggered unintended server execution, leading to **arbitrary code execution** on the server.

#### Affected Versions

- Next.js 15.x (all versions before 15.0.5, 15.1.9, 15.2.6, 15.3.6, 15.4.8, 15.5.7)
- Next.js 16.x (all versions before 16.0.7)
- Next.js 14.3.0-canary.77+ with App Router
- React 19.0.0 through 19.2.0 (react-server-dom packages)

#### Patched Versions

- Next.js: 15.5.7, 16.0.7, and corresponding canary releases
- React: 19.0.4, 19.1.5, 19.2.4

#### Attack Scenario (RCE)

```typescript
// VULNERABLE CODE (Conceptual - simplified for understanding)
"use server";

// Server Function that processes client data
async function processUserData(data: any) {
  // The RSC protocol allowed attackers to manipulate
  // how this data was deserialized and processed

  // Attacker could inject code that gets executed here
  const result = eval(data.expression); // NEVER DO THIS

  return result;
}
```

**Attack Vector:**

1. Attacker crafts malicious RSC protocol request
2. Request manipulates server-side execution flow
3. Server executes attacker-controlled code
4. Complete system compromise

#### Immediate Actions Required

1. **Upgrade immediately** to patched versions
2. **Rotate all secrets** if your application was online and unpatched as of December 4, 2025
3. **Audit logs** for suspicious activity
4. **Review all Server Functions** for proper input validation

#### Automated Fix Tool

```bash
npx fix-react-shell-next
```

---

### CVE-2025-55184: Denial of Service (High Severity)

**Discovered:** December 11, 2025  
**Severity:** High  
**Impact:** Service unavailability

#### What Happened? (DoS - Infinite Loop)

Specially crafted RSC requests could trigger infinite loops in the server-side rendering process, causing:

- Server hangs
- Prevention of future requests
- Complete service unavailability

#### Attack Scenario (DoS - Infinite Loop)

```typescript
// VULNERABLE PATTERN
"use server";

async function fetchNestedData(id: string) {
  // No depth limit or recursion protection
  const data = await db.getData(id);

  // Attacker provides circular reference
  if (data.parentId) {
    return {
      ...data,
      parent: await fetchNestedData(data.parentId), // Infinite loop
    };
  }

  return data;
}
```

**Attack Vector:**

1. Attacker crafts request with circular data references
2. Server enters infinite loop
3. Server hangs, consuming all resources
4. Legitimate requests cannot be processed

#### Prevention (DoS - Infinite Loop)

```typescript
// SECURE: Depth limiting
"use server";

async function fetchNestedData(
  id: string,
  depth: number = 0,
  maxDepth: number = 5,
) {
  if (depth >= maxDepth) {
    return null; // Prevent infinite recursion
  }

  const data = await db.getData(id);

  if (data.parentId) {
    return {
      ...data,
      parent: await fetchNestedData(data.parentId, depth + 1, maxDepth),
    };
  }

  return data;
}
```

---

### CVE-2025-55183: Source Code Exposure (Medium Severity)

**Discovered:** December 11, 2025  
**Severity:** Medium  
**Impact:** Information disclosure

#### What Happened? (Source Code Exposure)

Malicious RSC requests could cause the server to return compiled source code of Server Functions, potentially exposing:

- Business logic
- API keys and secrets in code
- Internal implementation details
- Database schema information

#### Attack Scenario (Source Code Exposure)

```typescript
// Server Function with embedded secrets (BAD PRACTICE)
"use server";

async function sendEmail(to: string, subject: string, body: string) {
  // NEVER hardcode secrets!
  const apiKey = "sk_live_abc123xyz789"; // Exposed via CVE-2025-55183

  await emailService.send({
    apiKey,
    to,
    subject,
    body,
  });
}
```

**Attack Vector:**

1. Attacker crafts malicious RSC request
2. Server returns compiled function source
3. Attacker extracts secrets and business logic
4. Attacker uses secrets to compromise other systems

#### Prevention (Source Code Exposure)

```typescript
// SECURE: Environment variables
"use server";

async function sendEmail(to: string, subject: string, body: string) {
  // Load from environment variables
  const apiKey = process.env.EMAIL_API_KEY;

  if (!apiKey) {
    throw new Error("Email service not configured");
  }

  await emailService.send({
    apiKey,
    to,
    subject,
    body,
  });
}
```

**Best Practices:**

1. **Never hardcode secrets** in source code
2. Use **environment variables** for all secrets
3. Use **secret management services** (AWS Secrets Manager, HashiCorp Vault)
4. **Rotate secrets regularly**
5. **Audit code** for accidentally committed secrets

---

### CVE-2026-23864: Denial of Service via CPU Exhaustion (CVSS 7.5)

**Discovered:** January 2026  
**Severity:** High (7.5/10.0)  
**Impact:** Service degradation or unavailability

#### What Happened? (DoS - CPU Exhaustion)

Specially crafted HTTP requests could trigger excessive CPU usage, out-of-memory exceptions, or server crashes in Next.js applications with App Router.

#### Attack Scenario (DoS - CPU Exhaustion)

```typescript
// VULNERABLE: No rate limiting or resource constraints
"use server";

async function searchContent(query: string) {
  // Attacker sends complex regex or large query
  // No validation, no limits

  const results = await db.content.findMany({
    where: {
      // Complex regex search without limits
      title: { contains: query },
      body: { contains: query },
      tags: { hasSome: query.split(" ") },
    },
    // No pagination limit!
    take: 999999,
  });

  // CPU-intensive operation on large dataset
  return results.map((r) => ({
    ...r,
    // Expensive computation
    relevance: calculateRelevance(r, query),
  }));
}
```

**Attack Vector:**

1. Attacker sends requests with complex queries
2. Server performs expensive operations
3. CPU usage spikes to 100%
4. Server becomes unresponsive or crashes

#### Prevention (DoS - CPU Exhaustion)

```typescript
// SECURE: Rate limiting, pagination, resource constraints
"use server";

import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string().min(1).max(100), // Limit query length
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20), // Max 50 results
});

async function searchContent(input: unknown) {
  // Rate limiting
  const identifier = await getClientIdentifier();
  const { success } = await rateLimit.check(identifier, "10 per minute");

  if (!success) {
    throw new Error("Rate limit exceeded");
  }

  // Input validation
  const { query, page, limit } = SearchSchema.parse(input);

  // Pagination
  const skip = (page - 1) * limit;

  // Limited query
  const results = await db.content.findMany({
    where: {
      OR: [{ title: { contains: query } }, { body: { contains: query } }],
    },
    take: limit,
    skip: skip,
    // Only select needed fields
    select: {
      id: true,
      title: true,
      excerpt: true,
      createdAt: true,
    },
  });

  return results;
}
```

---

## Root Cause Analysis

### Why Did These Vulnerabilities Happen?

1. **Blurred Client-Server Boundary**
   - Server Components make it easy to forget that client inputs are untrusted
   - The `'use server'` directive creates a false sense of security
   - Developers treat Server Functions like internal functions, not public APIs

2. **Implicit Trust in RSC Protocol**
   - The RSC protocol was assumed to be secure by design
   - Insufficient validation of protocol-level inputs
   - Deserialization vulnerabilities

3. **Lack of Security-First Design**
   - Authorization and validation were treated as optional
   - No built-in rate limiting or resource constraints
   - Easy to write insecure code

4. **Complexity of the Architecture**
   - Server Components are a new paradigm
   - Security implications not fully understood
   - Insufficient documentation on security best practices

---

## Security Principles for Server Components

### 1. Treat Every Server Function as a Public API

```typescript
// ❌ WRONG: Assuming internal function
"use server";
async function deleteUser(userId: string) {
  await db.users.delete({ where: { id: userId } });
}

// ✅ CORRECT: Treat as public API
("use server");
async function deleteUser(userId: string) {
  // 1. Authentication
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 2. Authorization
  if (session.userId !== userId && session.role !== "admin") {
    throw new Error("Forbidden");
  }

  // 3. Input validation
  const validatedId = z.string().uuid().parse(userId);

  // 4. Rate limiting
  await rateLimit.check(session.userId, "5 per hour");

  // 5. Audit logging
  await auditLog.log({
    action: "user.delete",
    userId: session.userId,
    targetUserId: validatedId,
  });

  // 6. Execute operation
  await db.users.delete({ where: { id: validatedId } });
}
```

### 2. Never Trust Client Input

```typescript
// ❌ WRONG: Trusting client data
"use server";
async function updateProfile(data: any) {
  await db.users.update({
    where: { id: data.userId },
    data: data, // Dangerous!
  });
}

// ✅ CORRECT: Validate everything
("use server");
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  email: z.string().email(),
});

async function updateProfile(input: unknown) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Validate input
  const data = UpdateProfileSchema.parse(input);

  // Only update allowed fields
  await db.users.update({
    where: { id: session.userId },
    data: {
      name: data.name,
      bio: data.bio,
      email: data.email,
      // userId cannot be changed!
    },
  });
}
```

### 3. Implement Defense in Depth

```typescript
"use server";

async function processPayment(input: unknown) {
  // Layer 1: Rate limiting
  await rateLimit.check(await getClientId(), "3 per minute");

  // Layer 2: Authentication
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Layer 3: Input validation
  const data = PaymentSchema.parse(input);

  // Layer 4: Authorization
  const order = await db.orders.findUnique({
    where: { id: data.orderId },
  });
  if (order.userId !== session.userId) {
    throw new Error("Forbidden");
  }

  // Layer 5: Business logic validation
  if (order.status !== "pending") {
    throw new Error("Order already processed");
  }

  // Layer 6: Idempotency check
  const existing = await db.payments.findUnique({
    where: { orderId: data.orderId },
  });
  if (existing) {
    return existing; // Already processed
  }

  // Layer 7: Execute with transaction
  return await db.$transaction(async (tx) => {
    const payment = await tx.payments.create({ data });
    await tx.orders.update({
      where: { id: data.orderId },
      data: { status: "paid" },
    });
    return payment;
  });
}
```

### 4. Filter Sensitive Data

```typescript
// ❌ WRONG: Exposing sensitive data
"use server";
async function getUser(userId: string) {
  const user = await db.users.findUnique({
    where: { id: userId },
  });
  return user; // Includes password hash, email, etc.
}

// ✅ CORRECT: Filter sensitive fields
("use server");
async function getUser(userId: string) {
  const user = await db.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      avatar: true,
      createdAt: true,
      // Exclude: password, email, phone, etc.
    },
  });
  return user;
}

// ✅ EVEN BETTER: Use experimental taint API
("use server");
import { experimental_taintObjectReference } from "react";

async function getUser(userId: string) {
  const user = await db.users.findUnique({
    where: { id: userId },
  });

  // Prevent this object from being passed to client
  experimental_taintObjectReference("Do not pass user object to client", user);

  // Return filtered data
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };
}
```

---

## Security Checklist for Server Functions

Before deploying any Server Function, verify:

- [ ] **Authentication**: Is the user logged in?
- [ ] **Authorization**: Does the user have permission?
- [ ] **Input Validation**: Are all inputs validated with Zod?
- [ ] **Sanitization**: Is user input sanitized?
- [ ] **Rate Limiting**: Are expensive operations rate-limited?
- [ ] **Resource Limits**: Are there limits on query size, depth, etc.?
- [ ] **Data Filtering**: Are sensitive fields excluded from responses?
- [ ] **Error Handling**: Do errors avoid leaking sensitive information?
- [ ] **Audit Logging**: Are security events logged?
- [ ] **Idempotency**: Can the operation be safely retried?
- [ ] **Transaction Safety**: Are multi-step operations atomic?
- [ ] **Secrets Management**: Are secrets loaded from environment variables?

---

## Testing for Vulnerabilities

### 1. Authorization Bypass Testing

```typescript
// Test: Can user A access user B's data?
test("authorization: user cannot delete other users", async () => {
  const userA = await createTestUser();
  const userB = await createTestUser();

  // Login as user A
  const session = await loginAs(userA);

  // Try to delete user B
  await expect(deleteUser(userB.id)).rejects.toThrow("Forbidden");
});
```

### 2. Input Validation Testing

```typescript
// Test: Does the function reject invalid input?
test("input validation: rejects invalid email", async () => {
  const session = await loginAsTestUser();

  await expect(updateProfile({ email: "not-an-email" })).rejects.toThrow(
    "Invalid email",
  );
});
```

### 3. Rate Limiting Testing

```typescript
// Test: Does rate limiting work?
test("rate limiting: blocks excessive requests", async () => {
  const session = await loginAsTestUser();

  // Make 10 requests (limit is 5)
  const requests = Array(10)
    .fill(null)
    .map(() => searchContent({ query: "test" }));

  const results = await Promise.allSettled(requests);

  // At least 5 should be rejected
  const rejected = results.filter((r) => r.status === "rejected");
  expect(rejected.length).toBeGreaterThanOrEqual(5);
});
```

---

## Key Takeaways

1. **Server Components are not automatically secure** - They require the same security measures as any public API

2. **Every Server Function is a potential attack vector** - Treat them as untrusted entry points

3. **Defense in depth is essential** - Multiple layers of security (auth, validation, rate limiting, etc.)

4. **Upgrade immediately** - These vulnerabilities are actively exploited

5. **Security is not optional** - It must be built in from the start, not added later

6. **Test security scenarios** - Authorization bypass, input validation, rate limiting, etc.

7. **Learn from these CVEs** - They demonstrate fundamental security principles

---

## Additional Resources

- [CVE-2025-66478 Official Advisory](https://nextjs.org/blog/CVE-2025-66478)
- [Next.js Security Update (Dec 11, 2025)](https://nextjs.org/blog/security-update-2025-12-11)
- [React Security Advisory](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/blog/security-nextjs-server-components-actions)

---

**Next Memo:** Authorization Patterns - Preventing Broken Access Control

---

_This memo is part of a series on security in modern React applications. For questions or clarifications, refer to the project mentor._
