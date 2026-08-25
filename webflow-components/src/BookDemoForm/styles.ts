/**
 * Scoped styles for the Book-a-Demo multi-step form. Ships inside the component
 * (Shadow DOM). Söhne is reused from the Pricing Calculator's embedded font module.
 */
import { fontFaceCss } from '../PricingCalculator/fonts';

export const css = /* css */ `
${fontFaceCss}

:host { all: initial; }
* { box-sizing: border-box; }

.bd {
  --green: #084235;
  --green-hover: #0a5443;
  --paper: #ffffff;
  --ink: #16241f;
  --muted: #5f6f6a;
  --line: #efefef;
  --line-strong: #084235;
  --error: #b42318;
  --font: "Söhne", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  font-family: var(--font);
  color: var(--ink);
  width: 100%;
  -webkit-font-smoothing: antialiased;
}

.bd__card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: clamp(24px, 4vw, 40px);
}
.bd.theme-dark .bd__card { background: var(--green); border-color: var(--green); color: #fff; }

.bd__head { margin-bottom: 24px; }
.bd__title { font-family: var(--font); font-weight: 500; font-size: clamp(22px, 3vw, 28px); line-height: 1.15; letter-spacing: -0.01em; margin: 0; color: var(--ink); }
.bd.theme-dark .bd__title { color: #fff; }
.bd__sub { margin: 8px 0 0; font-size: 16px; line-height: 1.45; color: var(--muted); }
.bd.theme-dark .bd__sub { color: rgba(255,255,255,0.75); }

/* Progress */
.bd__progress { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.bd__dots { display: flex; gap: 8px; }
.bd__dot { width: 28px; height: 4px; background: var(--line); transition: background .2s; }
.bd__dot.is-done { background: var(--green); }
.bd__dot.is-active { background: var(--green); }
.bd.theme-dark .bd__dot { background: rgba(255,255,255,0.25); }
.bd.theme-dark .bd__dot.is-done, .bd.theme-dark .bd__dot.is-active { background: #30ffab; }
.bd__step-label { font-size: 13px; color: var(--muted); letter-spacing: 0.02em; }
.bd.theme-dark .bd__step-label { color: rgba(255,255,255,0.7); }

/* Fields */
.bd__fields { display: flex; flex-direction: column; gap: 18px; }
.bd__field { display: flex; flex-direction: column; gap: 8px; }
.bd__label { font-size: 15px; font-weight: 500; color: var(--green); }
.bd.theme-dark .bd__label { color: #fff; }
.bd__control {
  width: 100%; height: 52px; padding: 0 16px; border: 1px solid var(--line);
  background: #fff; color: var(--ink); font-family: var(--font); font-size: 16px; outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.bd__control::placeholder { color: #9aa6a1; }
.bd__control:focus { border-color: var(--line-strong); box-shadow: 0 0 0 3px rgba(8,66,53,0.08); }
.bd__control.has-error { border-color: var(--error); }
select.bd__control {
  appearance: none; -webkit-appearance: none; cursor: pointer; color: #9aa6a1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23084235' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
  background-repeat: no-repeat; background-position: right 14px center; padding-right: 46px;
}
select.bd__control.has-value { color: var(--ink); }
.bd__error { font-size: 13px; color: var(--error); }

/* Turnstile */
.bd__turnstile { margin-top: 20px; min-height: 65px; }

/* Actions */
.bd__actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 28px; }
.bd__actions.is-first { justify-content: flex-end; }
.bd__btn {
  font-family: var(--font); font-size: 15px; font-weight: 500; cursor: pointer;
  padding: 14px 26px; border: 0; transition: background .15s, opacity .15s;
}
.bd__btn--primary { background: var(--green); color: #fff; }
.bd__btn--primary:hover { background: var(--green-hover); }
.bd__btn--primary:disabled { opacity: 0.5; cursor: default; }
.bd__btn--ghost { background: transparent; color: var(--muted); padding: 14px 8px; }
.bd__btn--ghost:hover { color: var(--ink); }
.bd.theme-dark .bd__btn--primary { background: #30ffab; color: var(--green); }
.bd.theme-dark .bd__btn--ghost { color: rgba(255,255,255,0.8); }

.bd__form-error { margin-top: 16px; padding: 12px 14px; background: #fef3f2; border: 1px solid #fecdca; color: var(--error); font-size: 14px; line-height: 1.4; }

/* Success */
.bd__success { text-align: left; }
.bd__success h3 { font-family: var(--font); font-weight: 500; font-size: clamp(22px, 3vw, 28px); margin: 0 0 10px; color: var(--green); }
.bd.theme-dark .bd__success h3 { color: #fff; }
.bd__success p { font-size: 17px; line-height: 1.5; color: var(--muted); margin: 0; }
.bd.theme-dark .bd__success p { color: rgba(255,255,255,0.8); }

@media (max-width: 560px) {
  .bd__actions { flex-direction: column-reverse; align-items: stretch; }
  .bd__actions.is-first { align-items: stretch; }
  .bd__btn { width: 100%; text-align: center; }
  .bd__btn--ghost { padding: 12px; }
}
`;
