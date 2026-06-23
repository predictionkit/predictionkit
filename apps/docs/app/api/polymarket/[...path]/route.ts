import type { NextRequest } from 'next/server';

// Same-origin proxy to Polymarket's Gamma API so the interactive browser demo
// works regardless of CORS. The adapter is pointed here via `baseUrl`.
const TARGET = 'https://gamma-api.polymarket.com';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(`${TARGET}/${params.path.join('/')}${req.nextUrl.search}`);
}

async function forward(url: string): Promise<Response> {
  const upstream = await fetch(url, {
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
