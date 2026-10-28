import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('localeNudge');

type LocaleKey = 'gb' | 'ie' | 'us';

interface LocaleDef {
  prefix: string;
  text: string;
  cta: string;
}

const LOCALES: Record<LocaleKey, LocaleDef> = {
  gb: {
    prefix: '',
    text: 'Visiting from the UK? See prices in pounds on our UK site.',
    cta: 'Go to UK site',
  },
  ie: {
    prefix: '/ie',
    text: 'Visiting from Ireland? See prices in euro on our Irish site.',
    cta: 'Go to Irish site',
  },
  us: {
    prefix: '/us',
    text: 'Visiting from the US? See prices in dollars on our US site.',
    cta: 'Go to US site',
  },
};

const COUNTRY_TO_LOCALE: Record<string, LocaleKey> = { GB: 'gb', IE: 'ie', US: 'us' };

const ROOT = '[data-locale-nudge]';
const TEXT = '[data-locale-nudge-text]';
const LINK = '[data-locale-nudge-link]';
const CLOSE = '[data-locale-nudge-close]';
/* once set, the visitor has picked a site and is never nudged again */
const CHOICE_KEY = 'adfin-locale-choice';
const COUNTRY_KEY = 'adfin-geo-country';

const storage = {
  get(area: Storage | undefined, key: string): string | null {
    try {
      return area?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(area: Storage | undefined, key: string, value: string): void {
    try {
      area?.setItem(key, value);
    } catch {
      /* private mode or blocked storage: the nudge just may reappear */
    }
  },
};

const track = (event: string, data: Record<string, unknown>): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

const currentLocale = (): LocaleKey => {
  const first = window.location.pathname.split('/')[1]?.toLowerCase();
  return first === 'ie' || first === 'us' ? first : 'gb';
};

/** Same page in another locale: swap the subdirectory, keep the rest. */
const pathIn = (from: LocaleKey, to: LocaleKey): string => {
  const { pathname, search, hash } = window.location;
  const rest = LOCALES[from].prefix ? pathname.slice(LOCALES[from].prefix.length) || '/' : pathname;
  const path = LOCALES[to].prefix + (rest === '/' && LOCALES[to].prefix ? '' : rest);
  return (path || '/') + search + hash;
};

/** Country from Cloudflare's same-origin trace endpoint, cached for the session. */
const visitorCountry = async (): Promise<string | null> => {
  const forced = new URLSearchParams(window.location.search).get('geo');
  if (forced) return forced.toUpperCase();

  const cached = storage.get(window.sessionStorage, COUNTRY_KEY);
  if (cached) return cached;

  try {
    const res = await fetch('/cdn-cgi/trace', { credentials: 'omit' });
    const country = (await res.text()).match(/^loc=([A-Z]{2})$/m)?.[1] ?? null;
    if (country) storage.set(window.sessionStorage, COUNTRY_KEY, country);
    return country;
  } catch {
    return null;
  }
};

/**
 * Suggests the visitor's regional site when they land on another region's
 * version. Never redirects. Markup (styled in Webflow, hidden until shown):
 *   [data-locale-nudge]          wrapper; set to "show" when the nudge applies
 *     [data-locale-nudge-text]   message
 *     [data-locale-nudge-link]   link to the same page in their region
 *     [data-locale-nudge-close]  dismiss
 * Copy can be overridden per region on the wrapper, eg.
 * data-locale-nudge-text-ie / data-locale-nudge-cta-ie.
 * QA: add ?geo=IE (or US, GB) to any URL to fake the visitor's country.
 */
export const localeNudge = async (): Promise<void> => {
  const root = document.querySelector<HTMLElement>(ROOT);
  if (!root) return;

  const forced = new URLSearchParams(window.location.search).has('geo');
  if (!forced && storage.get(window.localStorage, CHOICE_KEY)) return;

  const country = await visitorCountry();
  const target = country ? COUNTRY_TO_LOCALE[country] : undefined;
  const current = currentLocale();
  if (!target || target === current) return;

  const def = LOCALES[target];
  const text = root.querySelector<HTMLElement>(TEXT);
  const link = root.querySelector<HTMLAnchorElement>(LINK);
  if (text) text.textContent = root.getAttribute(`data-locale-nudge-text-${target}`) || def.text;
  if (link) {
    link.href = pathIn(current, target);
    if (!link.querySelector('*'))
      link.textContent = root.getAttribute(`data-locale-nudge-cta-${target}`) || def.cta;
    on(link, 'click', () => {
      storage.set(window.localStorage, CHOICE_KEY, target);
      track('locale_nudge_click', { country, from_locale: current, to_locale: target });
    });
  }

  root.querySelectorAll<HTMLElement>(CLOSE).forEach((btn) =>
    on(btn, 'click', () => {
      storage.set(window.localStorage, CHOICE_KEY, current);
      root.setAttribute('data-locale-nudge', 'hidden');
      track('locale_nudge_dismiss', { country, from_locale: current, to_locale: target });
    })
  );

  root.setAttribute('data-locale-nudge', 'show');
  track('locale_nudge_shown', { country, from_locale: current, to_locale: target });
  log('shown', { country, current, target });
};
