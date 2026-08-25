/**
 * Cloudflare Turnstile — client-side anti-spam gate on the final step. Injects
 * the Turnstile api.js (explicit-render mode) and renders a widget; the token
 * is returned via callback and included in the HubSpot submission.
 *
 * Note: without a backend this is a client-side deterrent (the widget must be
 * solved before submit), not server-verified. Server verification would need a
 * small endpoint calling Cloudflare's siteverify.
 */
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render(el: HTMLElement, opts: { sitekey: string; callback?: (token: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void; theme?: string }): string;
  remove(widgetId: string): void;
  reset(widgetId?: string): void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`)) {
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(poll);
        window.turnstile ? resolve() : reject(new Error('Turnstile load timeout'));
      }, 8000);
      return;
    }
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface TurnstileHandle {
  widgetId: string;
  reset: () => void;
}

export async function renderTurnstile(
  el: HTMLElement,
  sitekey: string,
  onToken: (token: string) => void,
  onExpire: () => void,
): Promise<TurnstileHandle> {
  await loadTurnstile();
  if (!window.turnstile) throw new Error('Turnstile unavailable');
  const widgetId = window.turnstile.render(el, {
    sitekey,
    callback: onToken,
    'expired-callback': onExpire,
    'error-callback': onExpire,
  });
  return { widgetId, reset: () => window.turnstile?.reset(widgetId) };
}
