import { createLogger } from '$utils/log';

const log = createLogger('consentLink');

declare global {
  interface Window {
    AdfinConsent?: { openSettings: (trigger?: HTMLElement) => void };
  }
}

/* the footer legal list is CMS-bound, so the settings link is added here */
const POLICY_LINK = '.footer_bottom_link_wrap[href$="/legal/cookies-policy"]';
const LABEL = '.footer_bottom_link_text';

/**
 * Adds "Cookie settings" next to Cookies Policy in the footer, cloned from that
 * link so it matches. The consent widget opens its settings on any
 * `[data-adfin-consent-open]` click. Inert until the widget is on the page.
 */
export const consentLink = (): void => {
  if (!window.AdfinConsent) return;

  document.querySelectorAll<HTMLAnchorElement>(POLICY_LINK).forEach((link) => {
    const item = link.closest<HTMLElement>('.footer_bottom_item') || link;
    if (item.nextElementSibling?.querySelector('[data-adfin-consent-open]')) return;

    const copy = item.cloneNode(true) as HTMLElement;
    const anchor = copy.matches('a') ? (copy as HTMLAnchorElement) : copy.querySelector('a');
    if (!anchor) return;
    anchor.setAttribute('href', '#');
    anchor.setAttribute('data-adfin-consent-open', '');
    anchor.removeAttribute('aria-current');
    anchor.classList.remove('w--current');
    const label = anchor.querySelector<HTMLElement>(LABEL) || anchor;
    label.textContent = 'Cookie settings';
    item.after(copy);
  });
  log('added');
};
