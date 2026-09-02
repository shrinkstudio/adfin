import { env } from 'cloudflare:workers';
import { syncEvents } from '../../lib/sync.js';

export const prerender = false;

export const POST = async () => {
  try {
    const result = await syncEvents(env);
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
