import { createLogger } from '$utils/log';

const log = createLogger('localeLinks');

/* locale subdirectories (as in localeNudge) */
const LOCALES = ['ie', 'us'];
/* the native Locales list and the nudge link deliberately point at other locales */
const SKIP = '[hreflang], [data-locale-nudge-link]';

/**
 * Keeps visitors on /ie and /us. Webflow localises links set to a page, but
 * not typed URLs: Button Main links set by URL and CMS Link fields (Nav Links)
 * stay root-relative and would land on the UK site. Prefixes those with the
 * current locale; on the primary locale it does nothing.
 */
export const localeLinks = (): void => {
  const first = window.location.pathname.split('/')[1]?.toLowerCase() || '';
  if (!LOCALES.includes(first)) return;
  const prefix = `/${first}`;

  let changed = 0;
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    // already in a locale, whichever one
    if (a.matches(SKIP) || href.startsWith('//') || LOCALES.includes(href.split(/[/?#]/)[1]))
      return;
    a.setAttribute('href', href === '/' ? prefix : prefix + href);
    changed += 1;
  });
  log('prefixed', { prefix, changed });
};
