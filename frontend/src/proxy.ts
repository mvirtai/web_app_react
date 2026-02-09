import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function proxy(request: NextRequest, _event: NextFetchEvent) {
  void _event; // required by NextProxy signature
  // 1. Generate unic nonce (number_used_once)
  const nonce = crypto.randomUUID();

  // 2. Create CSP-header with generated nonce value
  const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' blob: data: https:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `
    // Remove extra whitespace and trim leading/trailing spaces for better readability
    .replace(/\s{2,}/g, "")
    // Remove all whitespace including newlines to create a valid single-line HTTP header
    .replace(/\s+/g, " ")
    .trim();

  // 3. Add nonce request to headers (Next.js uses this)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // 4. Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Add all security headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=3156000; includeSubDomains",
  );
  response.headers.set(
    "Perissions-Policy",
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

// 6. Matcher: Do NOT redirect into these paths
export const config = {
  matcher: [
    {
      // All paths except: API, static files, images, favicon
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      // Do not apply for prefetch requests
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
