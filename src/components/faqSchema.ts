import { createLogger } from '$utils/log';

const log = createLogger('faqSchema');

/**
 * Promotes the CMS-bound FAQ schema to real JSON-LD. Webflow HTML-escapes
 * PlainText bindings, so the template embed carries the JSON in a
 * type="text/plain" script (invisible to schema parsers) and this module
 * decodes it, validates it, and injects a clean application/ld+json block.
 * An article whose stored JSON is genuinely malformed emits nothing instead
 * of an unparsable block.
 */
export const faqSchema = (): void => {
  document.querySelectorAll<HTMLScriptElement>('script[data-faq-schema]').forEach((source) => {
    const raw = source.textContent?.trim();
    if (!raw) return;

    const decoder = document.createElement('textarea');
    decoder.innerHTML = raw;
    const decoded = decoder.value;

    let parsed: unknown;
    try {
      parsed = JSON.parse(decoded);
    } catch (error) {
      log('invalid FAQ JSON, skipped', error);
      return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(parsed);
    document.head.appendChild(script);
    source.remove();
    log('injected');
  });
};
