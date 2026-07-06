import { ApiError } from "./edamam";

const MAX_REQUESTS_PER_SECOND = 3;
const MIN_REQUEST_INTERVAL_MS = 350;
const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1000;

let lastRequestTime = 0;
let pendingRequests = 0;

async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest)
    );
  }

  if (pendingRequests >= MAX_REQUESTS_PER_SECOND) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  pendingRequests++;
  lastRequestTime = Date.now();

  try {
    return await fetch(url, options);
  } finally {
    pendingRequests--;
  }
}

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await rateLimitedFetch(url, options);

    if (response.status === 429) {
      if (retries > 0) {
        const delay = BASE_RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new ApiError("Rate limit exceeded. Please try again later.", 429);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (retries > 0) {
      const delay = BASE_RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
