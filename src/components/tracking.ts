import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const log = createLogger('tracking');

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const push = (event: string, data: Record<string, unknown> = {}): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
  log(event, data);
};

/** Explicit CTA tagging per the tracking plan: data-track="cta" plus optional
 * data-track-location / data-track-label / data-track-destination. */
const trackCtas = (): void => {
  on(document, 'click', (e) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
    if (!target) return;
    push('cta_click', {
      cta_location: target.getAttribute('data-track-location') ?? undefined,
      cta_label: target.getAttribute('data-track-label') ?? target.textContent?.trim().slice(0, 80),
      cta_destination: target.getAttribute('data-track-destination') ?? undefined,
    });
  });
};

/** Parity for the old GTM "book_a_demo_click" conversion, whose click-URL
 * trigger (HubSpot meetings links) died with the rebuild. Any click through
 * to the demo flow counts as demo intent. */
const trackDemoIntent = (): void => {
  on(document, 'click', (e) => {
    const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (
      /^\/demo\//.test(href) ||
      href.includes('/demo/book-a-demo') ||
      href.includes('/demo/demo-form')
    )
      push('book_a_demo_click', { link_url: href });
  });
};

/** A booked slot in the RevenueHero scheduler is the strongest conversion on
 * the site; the dialog posts MEETING_BOOKED from its iframe. */
const trackDemoBooked = (): void => {
  let seen = false;
  on(window, 'message', (e) => {
    const type = (e as MessageEvent).data?.type;
    if (seen || (type !== 'MEETING_BOOKED' && type !== 'MEETING_ALREADY_BOOKED')) return;
    seen = true;
    push('demo_booked');
  });
};

/** Native Webflow form successes: watch each form block's success state flip.
 * Pushes generate_lead (with the form's name) and, for the newsletter form,
 * newsletter_signup as well. */
const trackFormSuccess = (): void => {
  queryElements<HTMLElement>('form').forEach((form) => {
    const wrap = form.closest('.w-form');
    const done = wrap?.querySelector<HTMLElement>('.w-form-done');
    if (!done) return;
    const name = form.getAttribute('data-name') || form.getAttribute('name') || form.id || 'form';
    const observer = new MutationObserver(() => {
      if (done.style.display !== 'block') return;
      observer.disconnect();
      push('generate_lead', { form_name: name });
      if (/newsletter/i.test(name)) push('newsletter_signup', { form_name: name });
    });
    observer.observe(done, { attributes: true, attributeFilter: ['style'] });
  });
};

export const tracking = (): void => {
  trackCtas();
  trackDemoIntent();
  trackDemoBooked();
  trackFormSuccess();
  log('armed');
};
