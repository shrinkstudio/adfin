import { env as runtimeEnv } from 'cloudflare:workers';
import { withFallback } from '../../lib/config.js';

export const prerender = false;

/** Names only, values never leave the worker. */
export const GET = async () => {
  const env = withFallback(runtimeEnv);
  const expected = ['WEBFLOW_API_TOKEN', 'LUMA_API_KEY', 'YOUTUBE_API_KEY', 'YOUTUBE_CHANNEL_ID'];
  const report = {
    present: Object.keys(env).filter((k) => typeof env[k] === 'string').sort(),
    expected: Object.fromEntries(
      expected.map((k) => [k, typeof env[k] === 'string' ? `set (${env[k].length} chars)` : 'MISSING'])
    ),
  };
  return new Response(JSON.stringify(report, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
