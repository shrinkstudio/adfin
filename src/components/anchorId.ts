import { attributeSelector, getAttribute } from '$utils/attributes';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

/** Opt-in attribute carrying the id of the section a link should point at. */
const ANCHOR_ID_ATTRIBUTE = 'anchor-id';
/** Only anchors — we rewrite their href, so a non-link would have nothing to update. */
const ANCHOR_ID_LINK = `a${attributeSelector(ANCHOR_ID_ATTRIBUTE)}`;

const log = createLogger('anchor-id');

/**
 * Points every internal link carrying `data-anchor-id` at that section by
 * folding the id into its href (…/path#anchor-id), once on load.
 *
 * Rewriting the href — rather than intercepting the click — hands navigation
 * back to the browser: same-tab clicks, middle-click / ⌘-click new tabs, "copy
 * link address", keyboard activation and the hover status bar all behave
 * natively, and there's no per-click cost. It works the same whether the
 * section is on this page (a native hash jump, honouring scroll-margin-top and
 * the smooth scroll anchor-links enables) or on another page (loads it, then
 * lands on the anchor).
 *
 * `data-anchor-id` is the source of truth: it replaces any hash already on the
 * href. Cross-origin links are left untouched.
 */
export const anchorId = (): void => {
  const links = queryElements<HTMLAnchorElement>(ANCHOR_ID_LINK);

  let rewritten = 0;
  for (const link of links) {
    const id = getAttribute(link, ANCHOR_ID_ATTRIBUTE).trim().replace(/^#/, '');
    if (!id) continue;

    // Resolve against the current page so relative hrefs (and empty ones) work.
    let url: URL;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      continue;
    }

    // Honour "internal link" — never rewrite something pointing off-site.
    if (url.origin !== window.location.origin) {
      log(`skip external ${url.href}`);
      continue;
    }

    url.hash = id;
    link.href = url.href;
    rewritten += 1;
  }

  log(`found ${links.length} "${ANCHOR_ID_LINK}", rewrote ${rewritten}`);
};
