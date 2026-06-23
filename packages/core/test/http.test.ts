import { afterEach, describe, expect, it } from 'vitest';
import { HttpClient } from '../src/util/http';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('HttpClient', () => {
  it('invokes the global fetch with a safe receiver (no browser "Illegal invocation")', async () => {
    // Browsers throw if `fetch` is called with a `this` other than the global
    // object. Simulate that here — Node's fetch is receiver-agnostic.
    function strictFetch(this: unknown): Promise<Response> {
      if (this !== undefined && this !== globalThis) {
        throw new TypeError('Illegal invocation');
      }
      return Promise.resolve(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );
    }
    globalThis.fetch = strictFetch as unknown as typeof fetch;

    const http = new HttpClient({ baseUrl: 'https://example.com' });
    const result = await http.get<{ ok: boolean }>('/thing');
    expect(result.ok).toBe(true);
  });

  it('retries on 429 then succeeds', async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      if (calls === 1) {
        return new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } });
      }
      return new Response(JSON.stringify({ value: 42 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const http = new HttpClient({ baseUrl: 'https://example.com', fetchImpl, maxRetries: 2 });
    const result = await http.get<{ value: number }>('/x');
    expect(result.value).toBe(42);
    expect(calls).toBe(2);
  });
});
