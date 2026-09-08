import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const CAPTURE = attributeSelector('email-capture');

/** Read by the Book a Demo code component on mount. */
const HANDOFF_KEY = 'adfin:handoff-email';

const log = createLogger('emailHandoff');

/**
 * Hands the email typed into a capture form over to the Book a Demo flow.
 *
 * `[data-email-capture]` goes on the Webflow form (or its wrapper) whose
 * submit leads to /book-a-demo — the form's own redirect setting does the
 * navigation, Webflow's native submission still records the lead. This only
 * stashes the address in sessionStorage so the demo form can pre-fill it and
 * open on step 2. Nothing sensitive touches the URL.
 */
const DEFAULT_DESTINATION = '/book-a-demo';

const createEmailHandoff = (wrap: HTMLElement): Destroyable | null => {
  const form = wrap instanceof HTMLFormElement ? wrap : wrap.querySelector('form');
  if (!form) return null;

  const input = form.querySelector<HTMLInputElement>('input[type="email"], input[name*="mail" i]');
  if (!input) return null;

  const destination = wrap.getAttribute('data-email-capture') || DEFAULT_DESTINATION;
  const success = form.closest('.w-form')?.querySelector<HTMLElement>('.w-form-done');

  const cleanup = createCleanup();
  let submitted = false;

  cleanup.add(
    on(form, 'submit', () => {
      const email = input.value.trim();
      if (!email) return;
      submitted = true;
      try {
        sessionStorage.setItem(HANDOFF_KEY, email);
      } catch {
        /* storage unavailable — the redirect still happens, just without pre-fill */
      }
    })
  );

  // Webflow reveals `.w-form-done` once its AJAX submission lands; that is the
  // "lead is captured" signal, so only then does the visitor move on. A form
  // with its own redirect setting navigates before this ever fires — the two
  // approaches coexist.
  if (success) {
    const observer = new MutationObserver(() => {
      if (!submitted || success.style.display !== 'block') return;
      observer.disconnect();
      window.location.assign(destination);
    });
    observer.observe(success, { attributes: true, attributeFilter: ['style'] });
    cleanup.add(() => observer.disconnect());
  }

  log('armed', { form: form.id || '(no id)', destination });
  return { destroy: () => cleanup.run() };
};

export const emailHandoff = (): void => {
  const instances = createInstances(CAPTURE, createEmailHandoff).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
