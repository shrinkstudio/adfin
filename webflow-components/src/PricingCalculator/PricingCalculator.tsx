import { useMemo, useState } from 'react';
import { computeQuote, type QuoteInput, type Rates } from './calc';
import { css } from './styles';

export interface PricingCalculatorProps {
  theme?: 'dark' | 'light';
  // Copy
  headingVolumes?: string;
  headingExisting?: string;
  headingResults?: string;
  resultsNote?: string;
  warningText?: string;
  ctaLabel?: string;
  ctaLink?: { href: string; target?: string; preload?: string };
  // Rates (Designer-friendly units: percentages and £)
  cardRate?: number; // %
  ddBaseRate?: number; // %
  fixedFee?: number; // £ per transaction
  ddCap?: number; // £
  bankRate?: number; // %
  bankCap?: number; // £
  ddRateTier1?: number; // % — referred, or 1–8 referrals
  ddRateTier2?: number; // % — 9–20 referrals
  ddRateTier3?: number; // % — 21+ referrals
  warningThreshold?: number; // £
  defaultCardSplit?: number; // %
  defaultDdSplit?: number; // %
  showBank?: boolean;
}

const money = (n: number) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const num = (s: string): number | null => {
  if (s.trim() === '') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};
const u = (v: number | null): number | undefined => (v == null ? undefined : v);

export function PricingCalculator(props: PricingCalculatorProps) {
  const {
    theme = 'dark',
    headingVolumes = 'Your volumes',
    headingExisting = 'Your pricing with existing provider(s)',
    headingResults = 'Your results',
    resultsNote = '(Supplementary fees are not modelled)',
    warningText = 'Your volumes are higher than our standard pricing: speak to us to discuss improved pricing.',
    ctaLabel = '',
    ctaLink,
    cardRate = 1.0,
    ddBaseRate = 1.0,
    fixedFee = 0.2,
    ddCap = 4.0,
    bankRate = 1.0,
    bankCap = 4.0,
    ddRateTier1 = 0.75,
    ddRateTier2 = 0.5,
    ddRateTier3 = 0.0,
    warningThreshold = 200000,
    defaultCardSplit = 30,
    defaultDdSplit = 70,
    showBank = false,
  } = props;

  // Inputs (kept as strings so blanks stay blank — matches the live "all blank
  // -> default split" behaviour).
  const [count, setCount] = useState('');
  const [volume, setVolume] = useState('');
  const [spread, setSpread] = useState('');
  const [cardPct, setCardPct] = useState('');
  const [ddPct, setDdPct] = useState('');
  const [amReferred, setAmReferred] = useState(false);
  const [amAccountant, setAmAccountant] = useState(false);
  const [referrals, setReferrals] = useState('');
  const [exPctCard, setExPctCard] = useState('');
  const [exFixedCard, setExFixedCard] = useState('');
  const [exPctDd, setExPctDd] = useState('');
  const [exFixedDd, setExFixedDd] = useState('');
  const [exCapDd, setExCapDd] = useState('');

  const rates: Rates = useMemo(
    () => ({
      card: { pct: cardRate / 100, fixed: fixedFee, cap: 0 },
      ddBase: ddBaseRate / 100,
      ddFixed: fixedFee,
      ddCap,
      bank: { pct: bankRate / 100, fixed: fixedFee, cap: bankCap },
      referralTiers: { t21: ddRateTier3 / 100, t9: ddRateTier2 / 100, t1: ddRateTier1 / 100 },
      warningThreshold,
      defaultSplit: { card: defaultCardSplit, dd: defaultDdSplit, bank: 0 },
    }),
    [cardRate, ddBaseRate, fixedFee, ddCap, bankRate, bankCap, ddRateTier1, ddRateTier2, ddRateTier3, warningThreshold, defaultCardSplit, defaultDdSplit],
  );

  const result = useMemo(() => {
    const input: QuoteInput = {
      count: num(count) ?? 0,
      volume: num(volume) ?? 0,
      spread: num(spread) ?? 0.6,
      cardPct: num(cardPct),
      ddPct: num(ddPct),
      bankPct: null,
      amReferred,
      referrals: amAccountant ? (num(referrals) ?? 0) : 0,
      showBank,
      existing: {
        card: { pct: u(num(exPctCard)), fixed: u(num(exFixedCard)), cap: 999999999 },
        dd: { pct: u(num(exPctDd)), fixed: u(num(exFixedDd)), cap: u(num(exCapDd)) },
      },
    };
    return computeQuote(input, rates);
  }, [count, volume, spread, cardPct, ddPct, amReferred, amAccountant, referrals, exPctCard, exFixedCard, exPctDd, exFixedDd, exCapDd, showBank, rates]);

  return (
    <div className={'calc' + (theme === 'light' ? ' theme-light' : '')}>
      <style>{css}</style>

      {/* Your volumes */}
      <section className="card">
        <h2 className="card__title">{headingVolumes}</h2>
        <hr className="card__divider" />

        <div className="field">
          <label className="field__label">Total number of payments per month</label>
          <input className="control" type="number" min="0" placeholder="Enter a number" autoComplete="off" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>

        <div className="field">
          <label className="field__label">Total value (£) of payments per month</label>
          <input className="control" type="number" min="0" placeholder="Enter a number" autoComplete="off" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>

        <div className="field">
          <label className="field__label">
            Are your payments normally approximately the same value, or do your values vary considerably?
          </label>
          <select className={'control' + (spread ? ' has-value' : '')} value={spread} onChange={(e) => setSpread(e.target.value)}>
            <option value="" disabled>Select one</option>
            <option value="0.8">My values vary a lot</option>
            <option value="0.6">My values vary a bit</option>
            <option value="0.4">My values are similar</option>
          </select>
        </div>

        <div className="checks">
          <label className="check">
            <input type="checkbox" checked={amReferred} onChange={(e) => setAmReferred(e.target.checked)} />
            <span>I've been referred by an accountant or bookkeeper</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={amAccountant} onChange={(e) => setAmAccountant(e.target.checked)} />
            <span>I am an accountant or bookkeeper</span>
          </label>
        </div>

        <div className={'field' + (amAccountant ? ' show' : '')} id="referrals-row">
          <label className="field__label">
            Accountants &amp; bookkeepers can get reduced Adfin fees with the ABC Club. How many client referrals do you think you could make?
          </label>
          <select className={'control' + (referrals ? ' has-value' : '')} value={referrals} onChange={(e) => setReferrals(e.target.value)}>
            <option value="" disabled>Select one</option>
            <option value="0">None</option>
            <option value="5">Some - between 1 and 8</option>
            <option value="10">Easily 9, maybe up to 20</option>
            <option value="21">More than 20</option>
          </select>
        </div>
      </section>

      {/* Existing provider(s) */}
      <section className="card">
        <h2 className="card__title">{headingExisting}</h2>
        <hr className="card__divider" />
        <table className="ptable">
          <thead>
            <tr>
              <th></th>
              <th>% transaction fee</th>
              <th>£ transaction fee</th>
              <th>Fee cap (£)</th>
              <th>% of your volume</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Card payments</th>
              <td data-label="% transaction fee"><input className="control cell-input" type="number" placeholder="1.5" autoComplete="off" value={exPctCard} onChange={(e) => setExPctCard(e.target.value)} /></td>
              <td data-label="£ transaction fee"><input className="control cell-input" type="number" placeholder="0.2" autoComplete="off" value={exFixedCard} onChange={(e) => setExFixedCard(e.target.value)} /></td>
              <td data-label="Fee cap (£)"><span className="cell-na">N/A</span></td>
              <td data-label="% of your volume"><input className="control cell-input" type="number" placeholder="30" autoComplete="off" value={cardPct} onChange={(e) => setCardPct(e.target.value)} /></td>
            </tr>
            <tr>
              <th>Direct debit payments</th>
              <td data-label="% transaction fee"><input className="control cell-input" type="number" placeholder="1.25" autoComplete="off" value={exPctDd} onChange={(e) => setExPctDd(e.target.value)} /></td>
              <td data-label="£ transaction fee"><input className="control cell-input" type="number" placeholder="0.2" autoComplete="off" value={exFixedDd} onChange={(e) => setExFixedDd(e.target.value)} /></td>
              <td data-label="Fee cap (£)"><input className="control cell-input" type="number" placeholder="5" autoComplete="off" value={exCapDd} onChange={(e) => setExCapDd(e.target.value)} /></td>
              <td data-label="% of your volume"><input className="control cell-input" type="number" placeholder="70" autoComplete="off" value={ddPct} onChange={(e) => setDdPct(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Your results */}
      <section className="card card--results">
        <h2 className="card__title">{headingResults}</h2>
        <hr className="card__divider" />

        <div className="result-row">
          <div className="result-label">
            Your estimated Adfin fees
            <small>{resultsNote}</small>
          </div>
          <div className="result-value">{money(result.adfinTotal)}</div>
        </div>

        <div className="result-row">
          <div className="result-label">Existing provider(s) fees</div>
          <div>
            <div className="result-value">{money(result.existTotal)}</div>
            <div className="result-breakdown">
              Card: {money(result.perMethod.card.exist)}
              <br />
              Direct debit: {money(result.perMethod.dd.exist)}
            </div>
          </div>
        </div>

        <div className="result-row savings-row">
          <div className="result-label">Estimated savings</div>
          <div className="savings-value">{result.savingsPct}%</div>
        </div>

        {result.showWarning && <div className="warning show">{warningText}</div>}
        {ctaLabel ? <a className="cta" href={ctaLink?.href || '#'} target={ctaLink?.target}>{ctaLabel}</a> : null}
      </section>
    </div>
  );
}

export default PricingCalculator;
