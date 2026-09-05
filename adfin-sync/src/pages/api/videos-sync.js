import { env as runtimeEnv } from 'cloudflare:workers';
import { withFallback } from '../../lib/config.js';
import { syncVideos } from '../../lib/syncVideos.js';

export const prerender = false;

export const POST = async () => {
  const env = withFallback(runtimeEnv);
  try {
    const result = await syncVideos(env);
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
