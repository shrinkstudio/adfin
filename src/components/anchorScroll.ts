import { on } from '$utils/events';
import { createLogger } from '$utils/log';

/**
 * Links that already have their own handling — the anchor-links strip and the
 * TOC (auto + manual). We leave their clicks entirely alone.
 */
const OWNED_ELSEWHERE = [
  '[data-component="anchor-links"]',
  '.toc_component',
  '[data-wf--table-of-contents--variant="manual"]',
  '[fs-toc-element="link"]',
].join(', ');

const log = createLogger('anchor-scroll');

/**
 * Routes every *other* same-page anchor link through the browser's native
 * scroll instead of Webflow's JS one.
 *
 * Webflow's smooth-scroll ignores scroll-margin-top, so sections land under the
 * sticky nav. The browser's native anchor jump honours it (and updates the hash,
 * moves focus to the target, and plays nice with the back button). So for any
 * link whose href points at a section on this page we just stop Webflow's
 * document-level handler and let the browser do its thing — with
 * `scroll-behavior: smooth` set so the native jump animates.
 *
 * The anchor-links and TOC components own their own links, so those are skipped.
 */
export const anchorScroll = (): void => {
  // Native anchor jumps animate off this; Webflow's JS scroll would ignore it.
  document.documentElement.style.scrollBehavior = 'smooth';

  const handleClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;

    const source = event.target instanceof Element ? event.target : null;
    const link = source?.closest('a');
    if (!link) return;

    // closest() checks the link itself too, so this also skips a bare TOC link.
    if (link.closest(OWNED_ELSEWHERE)) return;

    // Resolve the href and bail unless it targets a real element on this page.
    let url: URL;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    if (
      url.origin !== window.location.origin ||
      url.pathname !== window.location.pathname ||
      !url.hash
    ) {
      return;
    }

    const id = decodeURIComponent(url.hash.slice(1));
    if (!id || !document.getElementById(id)) return;

    // Stop Webflow's handler; the browser's native smooth jump does the rest.
    event.stopPropagation();
    log(`#${id} -> native smooth scroll`);
  };

  // Capture phase so we run before Webflow's document-level click handler.
  on<MouseEvent>(document, 'click', handleClick, true);
  log('handling same-page anchor links');
};
