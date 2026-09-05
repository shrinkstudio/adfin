import { env as runtimeEnv } from 'cloudflare:workers';
import { withFallback } from '../../lib/config.js';
import { statusReport } from '../../lib/sync.js';

export const prerender = false;

export const GET = async () => {
  const env = withFallback(runtimeEnv);
  try {
    const report = await statusReport(env);
    return new Response(JSON.stringify(report), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
