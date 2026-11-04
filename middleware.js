// Vercel Routing Middleware. Answers /geo.json with the visitor's approximate location from the
// headers Vercel adds to every request (derived from the IP address). Nothing is stored or logged.
export const config = { matcher: '/geo.json' };

export default function middleware(request) {
  const header = (name) => {
    const value = request.headers.get(name);
    try { return value ? decodeURIComponent(value) : ''; } catch { return value || ''; }
  };
  return new Response(JSON.stringify({ country: header('x-vercel-ip-country'), region: header('x-vercel-ip-country-region'), city: header('x-vercel-ip-city') }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' },
  });
}
