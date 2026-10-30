import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('navLocale');

const ROOT = '[data-nav-locale]';
const TOGGLE = '[data-nav-locale-toggle]';
const LIST = '[data-nav-locale-list]';
const DESKTOP = '(min-width: 62em)';
const ACTIVE = 'is-active';

/* the native list can only show Webflow's language code, so "en" for all three */
const LABELS: Record<string, string> = { 'en-GB': 'UK', 'en-IE': 'IRE', 'en-US': 'USA' };

/**
 * Region switcher in the nav. The toggle shows the current locale (flag and
 * name bound in Webflow) and opens the native Locales list: a dropdown under
 * it on desktop, opening in place inside the phone menu. Escape or a click
 * outside closes it. `.is-active` on the root turns the caret via CSS. Short
 * names come from LABELS, on the list and the toggle.
 */
export const navLocale = (): void => {
  const { gsap } = window;
  const roots = document.querySelectorAll<HTMLElement>(ROOT);
  if (!gsap || !roots.length) return;

  const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : 1;
  const desktop = window.matchMedia(DESKTOP);

  roots.forEach((root, i) => {
    const toggle = root.querySelector<HTMLElement>(TOGGLE);
    const list = root.querySelector<HTMLElement>(LIST);
    if (!toggle || !list) return;
    list.id ||= `nav-locale-${i}`;
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-expanded', 'false');

    list.querySelectorAll<HTMLAnchorElement>('a[hreflang]').forEach((link) => {
      const label = LABELS[link.hreflang];
      if (!label) return;
      link.textContent = label;
      const current = toggle.querySelector('.nav_locale_text');
      if (current && link.hasAttribute('aria-current')) current.textContent = label;
    });

    let open = false;
    const set = (next: boolean) => {
      open = next;
      root.classList.toggle(ACTIVE, next);
      toggle.setAttribute('aria-expanded', String(next));
      gsap.killTweensOf(list);
      if (desktop.matches) {
        gsap.to(list, {
          autoAlpha: next ? 1 : 0,
          y: next ? 0 : -4,
          duration: (next ? 0.25 : 0.15) * speed,
          ease: next ? 'power3.out' : 'power2.in',
        });
      } else {
        gsap.to(list, {
          height: next ? 'auto' : 0,
          autoAlpha: next ? 1 : 0,
          duration: 0.3 * speed,
          ease: 'power3.out',
        });
      }
    };

    on(toggle, 'click', () => set(!open));
    on(document, 'click', (e: MouseEvent) => {
      if (open && !root.contains(e.target as Node)) set(false);
    });
    on(document, 'keydown', (e: KeyboardEvent) => {
      if (!open || e.key !== 'Escape') return;
      set(false);
      toggle.focus();
    });
    // desktop and phone use different closed states, so start clean on a switch
    on(desktop, 'change', () => {
      gsap.killTweensOf(list);
      gsap.set(list, { clearProps: 'height,opacity,visibility,transform' });
      open = false;
      root.classList.remove(ACTIVE);
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  log('armed', { switchers: roots.length });
};
