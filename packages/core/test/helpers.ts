/**
 * Build a fake `fetch` that returns the first route whose key is a substring of
 * the request URL. Routes are matched in declaration order, so list the most
 * specific paths first.
 */
export function mockFetch(routes: Array<[match: string, body: unknown]>): typeof fetch {
  const impl = async (input: RequestInfo | URL): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    for (const [match, body] of routes) {
      if (url.includes(match)) {
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    return new Response('not found', { status: 404 });
  };
  return impl as unknown as typeof fetch;
}
