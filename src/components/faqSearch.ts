import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('faqSearch');

/** One entry per FAQ: the wrapper that survives the accordion's CMS unwrap. */
const ENTRY = '[fs-list-field="faq"]';
const INPUT = 'input[fs-list-field="*"]';
const EMPTY = '[fs-list-element="empty"]';
const CLEAR = '[fs-list-element="clear"]';

/**
 * Search for the FAQ page. The Accordion List component unwraps the CMS list
 * at DOMContentLoaded (same removeCMSList pattern as the blog slider), which
 * destroys the structure Finsweet's list module needs — so this module owns
 * the filtering instead. It matches the typed query against each entry's full
 * text (question + answer), toggles the shared empty state, and keeps the
 * native form from ever submitting. Only arms on pages that have faq-tagged
 * entries, so Finsweet-run pages (blog topics) are untouched.
 */
const run = (): void => {
  const entries = Array.from(document.querySelectorAll<HTMLElement>(ENTRY));
  if (!entries.length) return;

  const input = document.querySelector<HTMLInputElement>(INPUT);
  if (!input) return;

  const form = input.closest('form');
  const empty = document.querySelector<HTMLElement>(EMPTY);
  const clear = document.querySelector<HTMLElement>(CLEAR);

  const texts = entries.map((el) => (el.textContent || '').toLowerCase());

  const apply = (): void => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    entries.forEach((el, i) => {
      const hit = !query || texts[i].includes(query);
      // The wrapper is display: contents; an inline none still hides its subtree.
      el.style.display = hit ? '' : 'none';
      if (hit) shown += 1;
    });
    if (empty) empty.style.display = shown ? 'none' : '';
  };

  if (form) on(form, 'submit', (e) => e.preventDefault());
  on(input, 'input', apply);
  if (clear)
    on(clear, 'click', (e) => {
      e.preventDefault();
      input.value = '';
      apply();
    });

  apply();
  log('armed', { entries: entries.length });
};

export const faqSearch = (): void => {
  // Index after the accordion's unwrap has run.
  if (document.readyState === 'complete') {
    window.setTimeout(run, 0);
  } else {
    on(window, 'load', () => window.setTimeout(run, 0));
  }
};
