import type { NextRequest } from 'next/server';

// Same-origin proxy to Polymarket's CLOB API (historical prices) for the
// browser demo. The adapter is pointed here via `clobBaseUrl`.
const TARGET = 'https://clob.polymarket.com';

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
