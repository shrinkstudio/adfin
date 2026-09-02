import { env } from 'cloudflare:workers';
import { statusReport } from '../../lib/sync.js';

export const prerender = false;

export const GET = async () => {
  try {
    const report = await statusReport(env);
    return new Response(JSON.stringify(report), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
