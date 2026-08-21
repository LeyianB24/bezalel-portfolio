import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

// Fallback in-memory rate limiter for dev / test environments where Upstash Redis env is unset
class InMemoryRateLimiter {
  private cache = new Map<string, { count: number; resetAt: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const record = this.cache.get(identifier);

    if (!record || now > record.resetAt) {
      this.cache.set(identifier, { count: 1, resetAt: now + this.windowMs });
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1, reset: now + this.windowMs };
    }

    if (record.count >= this.maxRequests) {
      return { success: false, limit: this.maxRequests, remaining: 0, reset: record.resetAt };
    }

    record.count += 1;
    return { success: true, limit: this.maxRequests, remaining: this.maxRequests - record.count, reset: record.resetAt };
  }
}

// Check if Upstash is provisioned
const isUpstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis: Redis | null = null;
if (isUpstashConfigured) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (err) {
    console.warn("⚠️ Failed to initialize Upstash Redis client:", err);
  }
}

// 1. Login Limiter: 5 attempts per 60 seconds
export const loginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "bezalel:ratelimit:login",
      analytics: true,
    })
  : new InMemoryRateLimiter(5, 60 * 1000);

// 2. Public Form Limiter (Project requests, contact messages, career applications): 5 submissions per 1 hour
export const publicFormLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "bezalel:ratelimit:form",
      analytics: true,
    })
  : new InMemoryRateLimiter(5, 60 * 60 * 1000);

// 3. Checkout / STK Push Limiter: 5 attempts per 10 minutes
export const checkoutLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "bezalel:ratelimit:checkout",
      analytics: true,
    })
  : new InMemoryRateLimiter(5, 10 * 60 * 1000);

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Validates incoming request against designated rate limiter.
 * Returns null if allowed, or a branded 429 NextResponse if rate limit is exceeded.
 */
export async function checkRateLimit(
  req: Request,
  type: "login" | "form" | "checkout"
): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const identifier = `${type}:${ip}`;

  let result: { success: boolean; limit: number; remaining: number; reset: number };

  if (type === "login") {
    result = await loginLimiter.limit(identifier);
  } else if (type === "form") {
    result = await publicFormLimiter.limit(identifier);
  } else {
    result = await checkoutLimiter.limit(identifier);
  }

  if (!result.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    );

    return NextResponse.json(
      {
        error: "Too many attempts. Rate limit exceeded. Please try again shortly.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: retryAfterSeconds,
        gateway: "Bezalel Technologies Security Gateway",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.reset),
        },
      }
    );
  }

  return null;
}
