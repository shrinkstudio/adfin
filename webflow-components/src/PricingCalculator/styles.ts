/**
 * Scoped styles for the Pricing Calculator. Code Components render inside a
 * Shadow DOM, so these ship inside the component (site classes / fonts don't
 * cross the boundary). Söhne is embedded (subset woff2) via `fontFaceCss`.
 */
import { fontFaceCss } from './fonts';

export const css = /* css */ `
${fontFaceCss}

:host { all: initial; }
* { box-sizing: border-box; }

.calc {
  --green: #084235;
  --paper: #ffffff;
  --border-light: #efefef;
  --divider-on-dark: rgba(255,255,255,0.16);
  --placeholder: #9ca3af;
  --field-text: #084235;
  --muted: #6b7a76;
  --font: "Söhne", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --pad-y: clamp(24px, 4vw, 32px);
  --pad-x: clamp(20px, 4vw, 33px);

  font-family: var(--font);
  color: #000;
  width: 100%;
  background: var(--green);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.card { padding: var(--pad-y) var(--pad-x); background: var(--green); color: #fff; }
.card--results { background: var(--paper); color: #000; }
.calc.theme-light .card { background: var(--paper); color: #000; }
.calc.theme-light .card__title { color: var(--green); }
.calc.theme-light .card__divider { background: var(--border-light); }
.calc.theme-light .field__label,
.calc.theme-light .check span,
.calc.theme-light .ptable tbody th { color: #16241f; }
.calc.theme-light .control { border: 1px solid var(--border-light); }

.card__title {
  font-family: var(--font); font-weight: 500; font-size: clamp(22px, 3.2vw, 28px);
  line-height: 1.2; letter-spacing: -0.01em; margin: 0;
  padding-bottom: 24px; color: #fff;
}
.card--results .card__title { color: var(--green); }
.card__divider { height: 1px; border: 0; margin: 0 0 clamp(24px, 3vw, 32px); background: var(--divider-on-dark); }
.card--results .card__divider { background: var(--border-light); }

.field { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 503px); align-items: center; gap: clamp(12px, 2vw, 24px); margin-bottom: 24px; }
.field__label { font-size: clamp(16px, 1.4vw, 18px); line-height: 1.35; color: #fff; max-width: 455px; }

.control {
  width: 100%; height: clamp(52px, 6vw, 64px); padding: 0 20px; border: 0; border-radius: 0;
  background: #fff; color: var(--field-text); font-family: var(--font); font-size: clamp(16px, 1.4vw, 18px); outline: none;
}
.control::placeholder { color: var(--placeholder); }
select.control {
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23084235' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
  background-repeat: no-repeat; background-position: right 18px center;
  padding-right: 48px; cursor: pointer; color: var(--placeholder);
}
select.control.has-value { color: var(--field-text); }

.checks { margin-top: clamp(24px, 3vw, 32px); display: flex; flex-direction: column; gap: 20px; }
.check { display: flex; align-items: center; gap: 16px; cursor: pointer; }
.check input {
  appearance: none; -webkit-appearance: none; width: 18px; height: 18px; margin: 0; flex: 0 0 18px;
  border: 1px solid #fff; border-radius: 2px; background: transparent; cursor: pointer; position: relative;
}
.calc.theme-light .check input { border-color: var(--green); }
.check input:checked { background: #fff; }
.calc.theme-light .check input:checked { background: var(--green); }
.check input:checked::after {
  content: ""; position: absolute; left: 5px; top: 1px; width: 5px; height: 10px;
  border: solid var(--green); border-width: 0 2px 2px 0; transform: rotate(45deg);
}
.calc.theme-light .check input:checked::after { border-color: #fff; }
.check span { font-size: clamp(15px, 1.3vw, 18px); color: #fff; line-height: 1.35; }

#referrals-row { display: none; margin-top: 24px; margin-bottom: 0; }
#referrals-row.show { display: grid; }

/* Existing-provider comparison — fluid table (table-layout fixed = columns track container width) */
.ptable { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ptable th, .ptable td { text-align: left; padding: 0 8px 0 0; vertical-align: middle; }
@media (min-width: 821px) {
  .ptable th:first-child { width: 20%; }
  .ptable thead th:not(:first-child) { width: 20%; }
}
.ptable thead th { font-weight: 400; font-size: clamp(13px, 1.15vw, 16px); color: rgba(255,255,255,0.85); padding-bottom: 16px; }
.calc.theme-light .ptable thead th { color: var(--muted); }
.ptable tbody th { font-weight: 400; font-size: clamp(15px, 1.3vw, 18px); color: #fff; line-height: 1.2; padding-right: 12px; }
.ptable tbody td { padding-bottom: 12px; }
.ptable .cell-input { width: 100%; height: clamp(52px, 5vw, 61px); padding: 0 16px; }
.cell-na { color: rgba(255,255,255,0.6); font-size: clamp(15px, 1.3vw, 18px); }
.calc.theme-light .cell-na { color: var(--muted); }

.result-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: baseline; gap: clamp(16px, 3vw, 24px); padding: clamp(18px, 2.4vw, 24px) 0; border-bottom: 1px solid var(--border-light); }
.result-row:last-child { border-bottom: 0; }
.result-label { font-size: clamp(16px, 1.4vw, 18px); color: var(--green); }
.result-label small { display: block; color: var(--muted); font-size: clamp(13px, 1.1vw, 15px); margin-top: 4px; }
.result-value { font-size: clamp(19px, 1.8vw, 22px); color: var(--green); text-align: right; }
.result-breakdown { font-size: clamp(13px, 1.1vw, 15px); color: var(--muted); text-align: right; margin-top: 6px; line-height: 1.5; }
.savings-row { align-items: center; }
.savings-value { font-family: var(--font); font-weight: 500; font-size: clamp(40px, 8vw, 56px); line-height: 1; color: var(--green); letter-spacing: -0.02em; }

.cta { display: inline-block; margin-top: 24px; background: var(--green); color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-size: 15px; font-weight: 500; }

.warning { display: none; margin-top: 24px; padding: 20px 24px; background: #fff6e6; border: 1px solid #f0d9a8; color: #7a5a12; font-size: clamp(15px, 1.3vw, 16px); line-height: 1.45; }
.warning.show { display: block; }

/* Stack the label/field rows and the comparison table on narrow viewports */
@media (max-width: 820px) {
  .field { grid-template-columns: 1fr; align-items: stretch; gap: 8px; }
  .field__label { max-width: none; }
  .ptable, .ptable thead, .ptable tbody, .ptable tr, .ptable th, .ptable td { display: block; width: auto; }
  .ptable thead { display: none; }
  .ptable tbody tr { margin-bottom: 20px; border-bottom: 1px solid var(--divider-on-dark); padding-bottom: 16px; }
  .ptable tbody th { padding: 0 0 10px; font-size: 17px; }
  .ptable tbody td { padding-bottom: 12px; }
  .ptable .cell-input { width: 100%; }
  .ptable td::before { content: attr(data-label); display: block; font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 4px; }
  .calc.theme-light .ptable td::before { color: var(--muted); }
  .result-row { grid-template-columns: 1fr; }
  .result-value, .result-breakdown { text-align: left; }
  .savings-row { grid-template-columns: 1fr; }
}
`;
