import { useEffect, useMemo, useRef, useState } from 'react';
import { STEPS, ALL_FIELD_NAMES, EMAIL_RE, type FieldDef } from './steps';
import { submitToHubSpot } from './hubspot';
import { submitAndOpen } from './revenuehero';
import { renderTurnstile } from './turnstile';
import { css } from './styles';

export interface BookDemoFormProps {
  theme?: 'light' | 'dark';
  routerId?: string;
  redirectUrl?: string;
  hubspotPortalId?: string;
  hubspotFormGuid?: string;
  turnstileSitekey?: string;
  heading?: string;
  subheading?: string;
  nextLabel?: string;
  submitLabel?: string;
  successHeading?: string;
  successMessage?: string;
}

const emptyValues = (): Record<string, string> =>
  Object.fromEntries(ALL_FIELD_NAMES.map((n) => [n, '']));

/**
 * The site's email-capture forms stash the typed address here on submit
 * (see emailHandoff in the bundle) before redirecting to this page. Kept in
 * sessionStorage rather than a query param so the address never appears in
 * URLs or analytics. `?email=` is accepted as a fallback for direct links.
 */
const HANDOFF_KEY = 'adfin:handoff-email';

const readHandoffEmail = (): string | null => {
  let email: string | null = null;
  try {
    email = sessionStorage.getItem(HANDOFF_KEY);
    if (email) sessionStorage.removeItem(HANDOFF_KEY);
  } catch {
    /* storage unavailable */
  }
  if (!email) email = new URLSearchParams(window.location.search).get('email');
  email = (email ?? '').trim();
  return email && EMAIL_RE.test(email) ? email : null;
};

function fieldError(field: FieldDef, value: string): string | null {
  const v = (value || '').trim();
  if (field.required && !v) return 'Required';
  if (field.type === 'email' && v && !EMAIL_RE.test(v)) return 'Enter a valid email';
  return null;
}

export function BookDemoForm(props: BookDemoFormProps) {
  const {
    theme = 'light',
    routerId = '5191',
    redirectUrl = '',
    hubspotPortalId = '',
    hubspotFormGuid = '',
    turnstileSitekey = '0x4AAAAAAAQTptj2So4dx43e',
    heading = 'Book a quick call with the team',
    subheading = '',
    nextLabel = 'Continue',
    submitLabel = 'Book a demo',
    successHeading = "You're all set",
    successMessage = 'Pick a time that works for you in the scheduler.',
  } = props;

  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [done, setDone] = useState(false);
  const [handoff, setHandoff] = useState(false);

  // A handed-off email pre-fills step 1 and opens on the name step, so the
  // visitor who already typed their address continues rather than repeats.
  useEffect(() => {
    const email = readHandoffEmail();
    if (!email) return;
    setValues((v) => ({ ...v, email }));
    setHandoff(true);
    setStep(1);
  }, []);

  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const isLast = step === STEPS.length - 1;
  const currentFields = STEPS[step].fields;

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const stepValid = useMemo(
    () => currentFields.every((f) => !fieldError(f, values[f.name])),
    [currentFields, values],
  );

  // Render the Turnstile widget when the final step mounts.
  useEffect(() => {
    if (!isLast || done || !turnstileSitekey || !turnstileRef.current) return;
    if (turnstileRef.current.hasChildNodes()) return;
    let cancelled = false;
    renderTurnstile(
      turnstileRef.current,
      turnstileSitekey,
      (t) => !cancelled && setToken(t),
      () => !cancelled && setToken(''),
    ).catch(() => {
      /* if Turnstile fails to load, don't hard-block booking */
      if (!cancelled) setToken('turnstile-unavailable');
    });
    return () => {
      cancelled = true;
    };
  }, [isLast, done, turnstileSitekey]);

  // After a slot is booked in the RevenueHero dialog (it posts MEETING_BOOKED
  // from its iframe), send the visitor on to the configured page.
  useEffect(() => {
    if (!done || !redirectUrl) return;
    let redirected = false;
    const onMessage = (e: MessageEvent) => {
      const type = (e.data && (e.data.type ?? e.data)) as string;
      if (redirected || (type !== 'MEETING_BOOKED' && type !== 'MEETING_ALREADY_BOOKED')) return;
      redirected = true;
      window.location.assign(redirectUrl);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [done, redirectUrl]);

  const canSubmit = stepValid && (!turnstileSitekey || !!token) && !submitting;

  async function handlePrimary(e: React.FormEvent) {
    e.preventDefault();
    if (!stepValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    if (turnstileSitekey && !token) return;

    setSubmitting(true);
    setFormError(null);
    const hs = await submitToHubSpot(hubspotPortalId, hubspotFormGuid, values);
    if (!hs.ok) {
      setFormError('Something went wrong submitting the form. Please try again.');
      setSubmitting(false);
      return;
    }
    try {
      await submitAndOpen(routerId, values);
    } catch {
      /* lead captured in HubSpot; scheduler failed to open — still show success */
    }
    setDone(true);
    setSubmitting(false);
  }

  const rootClass = 'bd' + (theme === 'dark' ? ' theme-dark' : '');

  if (done) {
    return (
      <div className={rootClass}>
        <style>{css}</style>
        <div className="bd__card">
          <div className="bd__success">
            <h3>{successHeading}</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <style>{css}</style>
      <form className="bd__card" onSubmit={handlePrimary} noValidate>
        <div className="bd__head">
          <h2 className="bd__title">{heading}</h2>
          {subheading ? <p className="bd__sub">{subheading}</p> : null}
        </div>

        {handoff && step > 0 ? (
          <div className="bd__locked">
            <span className="bd__locked-text">
              Booking a demo for <strong>{values.email}</strong>
            </span>
            <button
              type="button"
              className="bd__locked-change"
              onClick={() => {
                setHandoff(false);
                setStep(0);
              }}
            >
              Change
            </button>
          </div>
        ) : null}

        <div className="bd__progress">
          <div className="bd__dots">
            {(handoff ? STEPS.slice(1) : STEPS).map((_, i) => {
              const active = handoff ? step - 1 : step;
              return (
                <span key={i} className={'bd__dot' + (i < active ? ' is-done' : i === active ? ' is-active' : '')} />
              );
            })}
          </div>
          <span className="bd__step-label">
            Step {handoff ? step : step + 1} of {handoff ? STEPS.length - 1 : STEPS.length}
          </span>
        </div>

        <div className="bd__fields">
          {currentFields.map((f) => {
            const err = showErrors ? fieldError(f, values[f.name]) : null;
            return (
              <div className="bd__field" key={f.name}>
                <label className="bd__label" htmlFor={`bd-${f.name}`}>{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    id={`bd-${f.name}`}
                    className={'bd__control' + (values[f.name] ? ' has-value' : '') + (err ? ' has-error' : '')}
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                  >
                    <option value="" disabled>Select one</option>
                    {f.options!.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`bd-${f.name}`}
                    className={'bd__control' + (err ? ' has-error' : '')}
                    type={f.type === 'email' ? 'email' : 'text'}
                    inputMode={f.type === 'email' ? 'email' : undefined}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                )}
                {err ? <span className="bd__error">{err}</span> : null}
              </div>
            );
          })}
        </div>

        {isLast && turnstileSitekey ? <div className="bd__turnstile" ref={turnstileRef} /> : null}

        {formError ? <div className="bd__form-error">{formError}</div> : null}

        <div className={'bd__actions' + (step === (handoff ? 1 : 0) ? ' is-first' : '')}>
          {step > (handoff ? 1 : 0) ? (
            <button type="button" className="bd__btn bd__btn--ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : null}
          <button type="submit" className="bd__btn bd__btn--primary" disabled={isLast ? !canSubmit : false}>
            {submitting ? 'Submitting…' : isLast ? submitLabel : nextLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookDemoForm;
