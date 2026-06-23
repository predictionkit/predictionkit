import type { NextRequest } from 'next/server';

// Same-origin proxy to Kalshi's v2 API (Kalshi does not send permissive CORS
// headers, so browser calls must go through here). Pointed at via `baseUrl`.
const TARGET = 'https://external-api.kalshi.com/trade-api/v2';

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
