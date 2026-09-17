interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

class RateLimiter {
  private requests: Map<string, RequestRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 3, windowMs: 1000 }) {
    this.config = config;
  }

  async acquire(key: string = "default"): Promise<boolean> {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now - record.timestamp >= this.config.windowMs) {
      this.requests.set(key, { timestamp: now, count: 1 });
      return true;
    }

    if (record.count < this.config.maxRequests) {
      record.count++;
      return true;
    }

    const waitTime = this.config.windowMs - (now - record.timestamp);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return this.acquire(key);
  }

  reset(key: string = "default"): void {
    this.requests.delete(key);
  }

  getRemainingRequests(key: string = "default"): number {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now - record.timestamp >= this.config.windowMs) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - record.count);
  }
}

export const apiRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 1000,
});

export function createRateLimitedFetch(
  limiter: RateLimiter = apiRateLimiter,
  key: string = "api"
) {
  return async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
    await limiter.acquire(key);
    const response = await fetch(url, init);

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return limiter.acquire(key).then(() => fetch(url, init));
    }

    return response;
  };
}
