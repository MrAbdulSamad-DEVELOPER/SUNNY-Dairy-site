/**
 * Production In-Memory Sliding Window Rate Limiter
 * Zero external dependencies, fast and thread-safe for Node.js Next.js runtime.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts: number) => now - ts < 300000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}

/**
 * Checks if an IP/key exceeds limit within windowMs
 * @param key unique identifier (e.g. IP + endpoint)
 * @param limit maximum allowed requests
 * @param windowMs time window in milliseconds (default 60s)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts: number) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetTime: now + windowMs,
  };
}

/**
 * Extracts client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
