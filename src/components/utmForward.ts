import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('utmForward');

const STORAGE_KEY = 'adfin:attribution';
/* attribution window */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const CONSOLE_HOST = 'console.adfin.com';

/** utm_* is matched by prefix; these are the ad-platform click ids. */
const CLICK_IDS = ['gclid', 'fbclid', 'msclkid', 'li_fat_id', 'ttclid'];

const isTracked = (key: string): boolean =>
  key.toLowerCase().startsWith('utm_') || CLICK_IDS.includes(key.toLowerCase());

type Stored = { ts: number; params: Record<string, string> };

const read = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as Stored;
    if (!stored.params || Date.now() - stored.ts > MAX_AGE_MS) return {};
    return stored.params;
  } catch {
    return {};
  }
};

/** Last touch wins: any arrival carrying tracked params replaces the set. */
const capture = (): void => {
  const current = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  current.forEach((value, key) => {
    if (isTracked(key) && value) params[key] = value;
  });
  if (!Object.keys(params).length) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), params }));
    log('captured', params);
  } catch {
    /* storage unavailable — same-pageview links still get decorated from the URL */
  }
};

const decorate = (link: HTMLAnchorElement, params: Record<string, string>): void => {
  let url: URL;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }
  if (url.hostname !== CONSOLE_HOST) return;
  let changed = false;
  Object.entries(params).forEach(([key, value]) => {
    // A param the link already carries was set deliberately — keep it.
    if (url.searchParams.has(key)) return;
    url.searchParams.set(key, value);
    changed = true;
  });
  if (changed) link.href = url.toString();
};

/**
 * Carries marketing attribution through to the console. Params from any
 * landing URL are remembered for 30 days (localStorage, last touch wins) and
 * appended to every console.adfin.com link as it is used — interaction-time
 * rewriting covers links the CMS or components add after load, plus new-tab
 * and middle clicks.
 */
export const utmForward = (): void => {
  capture();

  const apply = (target: EventTarget | null): void => {
    const link = (target as HTMLElement | null)?.closest?.('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;
    // Current URL's params win over stored ones within the same pageview.
    const params = read();
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (isTracked(key) && value) params[key] = value;
    });
    if (Object.keys(params).length) decorate(link, params);
  };

  on(document, 'mousedown', (e) => apply(e.target));
  on(document, 'touchstart', (e) => apply(e.target));
  on(document, 'keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') apply(e.target);
  });
  on(document, 'click', (e) => apply(e.target));

  log('armed');
};
