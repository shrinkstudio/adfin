import { env as runtimeEnv } from 'cloudflare:workers';
import { withFallback } from '../../lib/config.js';
import { syncEvents } from '../../lib/sync.js';

export const prerender = false;

export const POST = async ({ url }) => {
  const env = withFallback(runtimeEnv);
  const limitRaw = Number(url.searchParams.get('limit'));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : Infinity;
  try {
    const result = await syncEvents(env, { limit });
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
