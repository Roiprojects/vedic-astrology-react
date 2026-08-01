type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

export function clientIp(request: { headers?: Record<string, string | string[] | undefined>; ip?: string }): string {
  const fwd = request.headers?.["x-forwarded-for"];
  if (fwd) {
    const value = Array.isArray(fwd) ? fwd[0] : fwd;
    return value.split(",")[0].trim();
  }
  const realIp = request.headers?.["x-real-ip"];
  if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;
  return request.ip || "anon";
}