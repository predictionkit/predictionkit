/** Query parameters accepted by {@link HttpClient.get}. */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** Error thrown when an HTTP request fails after exhausting retries. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface HttpClientOptions {
  /** Base URL that request paths are resolved against. */
  baseUrl: string;
  /**
   * Minimum number of milliseconds between requests (a simple client-side
   * throttle). Requests are serialized so providers stay under rate limits.
   * Defaults to 0 (no throttling).
   */
  minIntervalMs?: number;
  /** Maximum retry attempts on 429/5xx responses. Defaults to 3. */
  maxRetries?: number;
  /** Override the `fetch` implementation (useful for tests). */
  fetchImpl?: typeof fetch;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * A tiny JSON HTTP client with a client-side throttle and exponential backoff
 * on rate-limit/server errors. Used by the provider adapters; not exported as a
 * general-purpose HTTP library.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly minIntervalMs: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;

  /** Serializes requests so the throttle interval is respected. */
  private gate: Promise<unknown> = Promise.resolve();
  private lastRequestAt = 0;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.minIntervalMs = options.minIntervalMs ?? 0;
    this.maxRetries = options.maxRetries ?? 3;
    if (options.fetchImpl) {
      this.fetchImpl = options.fetchImpl;
    } else if (typeof globalThis.fetch === 'function') {
      // Bind to globalThis so calling it as `this.fetchImpl(...)` doesn't invoke
      // the browser's `fetch` with the wrong receiver (which throws
      // "Illegal invocation"). Node's fetch is receiver-agnostic, so this only
      // matters in the browser.
      this.fetchImpl = globalThis.fetch.bind(globalThis);
    } else {
      throw new Error('No fetch implementation available. Pass `fetchImpl` to the provider.');
    }
  }

  /** Wait until the throttle interval since the last request has elapsed. */
  private async throttle(): Promise<void> {
    if (this.minIntervalMs <= 0) return;
    const run = this.gate.then(async () => {
      const wait = this.lastRequestAt + this.minIntervalMs - Date.now();
      if (wait > 0) await delay(wait);
      this.lastRequestAt = Date.now();
    });
    this.gate = run.catch(() => undefined);
    await run;
  }

  async get<T>(path: string, params?: QueryParams): Promise<T> {
    const url = buildUrl(this.baseUrl, path, params);

    for (let attempt = 0; ; attempt++) {
      await this.throttle();
      const res = await this.fetchImpl(url, { headers: { accept: 'application/json' } });

      if (res.ok) {
        return (await res.json()) as T;
      }

      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < this.maxRetries) {
        await delay(backoffMs(res, attempt));
        continue;
      }

      const body = await res.text().catch(() => '');
      throw new HttpError(
        res.status,
        url,
        `GET ${url} failed: ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`,
      );
    }
  }
}

function backoffMs(res: Response, attempt: number): number {
  const retryAfter = Number(res.headers.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1000;
  return 2 ** attempt * 250;
}

function buildUrl(baseUrl: string, path: string, params?: QueryParams): string {
  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}
