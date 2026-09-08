import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const HUBSPOT_FORM = attributeSelector('hubspot-form');
const PORTAL_ATTR = 'data-hubspot-portal';
/** Per-input override for the HubSpot property name; otherwise the input's
 * own name is used (inputs of type email always map to `email`). */
const NAME_ATTR = 'data-hubspot-name';

const ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit';

const log = createLogger('hubspotForms');

const getCookie = (name: string): string => {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
};

const resolvePortal = (el: HTMLElement): string => {
  let node: HTMLElement | null = el;
  while (node && node !== document.documentElement) {
    const value = node.getAttribute(PORTAL_ATTR);
    if (value?.trim()) return value.trim();
    node = node.parentElement;
  }
  return '';
};

const collectFields = (form: HTMLFormElement): Record<string, string> => {
  const fields: Record<string, string> = {};
  form
    .querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >('input, select, textarea')
    .forEach((input) => {
      if (input instanceof HTMLInputElement && ['submit', 'button', 'hidden'].includes(input.type))
        return;
      // Checkboxes (eg. marketing consent) only count when ticked.
      if (input instanceof HTMLInputElement && input.type === 'checkbox' && !input.checked) return;
      const value = input.value.trim();
      if (!value) return;
      const name =
        input.getAttribute(NAME_ATTR) ??
        (input instanceof HTMLInputElement && input.type === 'email' ? 'email' : input.name);
      if (name) fields[name] = value;
    });
  return fields;
};

/**
 * Mirrors native Webflow form submissions into HubSpot, the same Forms API
 * call the Book a Demo component makes. `data-hubspot-form="<formGuid>"` on
 * the form (or its wrapper); `data-hubspot-portal="<portalId>"` on the form
 * or any ancestor (set it once on the page/body). Fire-and-forget on submit —
 * Webflow's own capture is untouched and the visitor never waits on HubSpot.
 */
const createHubspotForm = (wrap: HTMLElement): Destroyable | null => {
  const formGuid = (wrap.getAttribute('data-hubspot-form') ?? '').trim();
  if (!formGuid) return null;

  const form = wrap instanceof HTMLFormElement ? wrap : wrap.querySelector('form');
  if (!form) return null;

  const cleanup = createCleanup();
  cleanup.add(
    on(form, 'submit', () => {
      const portalId = resolvePortal(wrap);
      const fields = collectFields(form);
      if (!portalId || !Object.keys(fields).length) {
        log('skipped submit', { portalId: !!portalId, fields: Object.keys(fields).length });
        return;
      }
      const hutk = getCookie('hubspotutk');
      void fetch(`${ENDPOINT}/${encodeURIComponent(portalId)}/${encodeURIComponent(formGuid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
          context: {
            ...(hutk ? { hutk } : {}),
            pageUri: window.location.href,
            pageName: document.title,
          },
        }),
      }).catch((error) => log('submit failed', error));
    })
  );

  log('armed', { form: form.id || '(no id)' });
  return { destroy: () => cleanup.run() };
};

export const hubspotForms = (): void => {
  const instances = createInstances(HUBSPOT_FORM, createHubspotForm).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
