// Reverse proxy: forwards all /wordpress/* requests to Aruba hosting
// Allows accessing WordPress admin via www.cesarescalise.it/wordpress/wp-admin
import type { APIRoute } from 'astro';
import { Agent, buildConnector, fetch as uFetch } from 'undici';

const WP_ARUBA_IP = import.meta.env.WP_ARUBA_IP ?? '89.46.109.24';

const connector = buildConnector({});
const arubaAgent = new Agent({
  connect: (opts: Record<string, unknown>, cb: (...a: unknown[]) => void) => {
    opts.hostname = WP_ARUBA_IP;
    connector(opts as Parameters<typeof connector>[0], cb as Parameters<typeof connector>[1]);
  },
});

const SKIP_REQ_HEADERS = new Set(['host', 'connection', 'transfer-encoding']);
const SKIP_RES_HEADERS = new Set(['transfer-encoding', 'connection', 'keep-alive', 'content-encoding']);

export const ALL: APIRoute = async ({ request, url }) => {
  const targetUrl = `https://www.cesarescalise.it${url.pathname}${url.search}`;

  const reqHeaders: Record<string, string> = {
    host: 'www.cesarescalise.it',
    'accept-encoding': 'identity', // prevent gzip/br compression issues through proxy
  };
  request.headers.forEach((value, key) => {
    if (!SKIP_REQ_HEADERS.has(key.toLowerCase())) reqHeaders[key] = value;
  });

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  try {
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const upstream = await uFetch(targetUrl, {
      method: request.method,
      headers: reqHeaders,
      body: body && body.byteLength > 0 ? body : undefined,
      dispatcher: arubaAgent,
      redirect: 'manual',
    } as Parameters<typeof uFetch>[1]) as unknown as Response;

    const resHeaders = new Headers();
    upstream.headers.forEach((value: string, key: string) => {
      if (!SKIP_RES_HEADERS.has(key.toLowerCase())) resHeaders.append(key, value);
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch (err) {
    console.error('[WP Proxy]', err);
    return new Response('WordPress proxy error', { status: 502 });
  }
};
