/**
 * Parity lock. Expected values were captured by driving the LIVE
 * adfin.com/pricing calculator's own function as an oracle across 12 input sets.
 * If any of these change, the port has drifted from the live math.
 *
 * Run: `node --experimental-strip-types tests/calc.test.ts`
 */
import { computeQuote, type QuoteInput } from '../src/PricingCalculator/calc.ts';

type Case = { name: string; input: Partial<QuoteInput>; adfin: number; exist: number; savings: number; warn: boolean };

const base: QuoteInput = {
  count: 0, volume: 0, spread: 0.6, cardPct: null, ddPct: null, bankPct: null,
  amReferred: false, referrals: 0, showBank: false, existing: { card: {}, dd: {} },
};

const cases: Case[] = [
  { name: 'C1 default', input: { count: 145, volume: 29000 }, adfin: 382.4, exist: 571.9, savings: 33, warn: false },
  { name: 'C2 spread 0.4', input: { count: 145, volume: 29000, spread: 0.4 }, adfin: 362, exist: 520, savings: 30, warn: false },
  { name: 'C3 spread 0.8', input: { count: 145, volume: 29000, spread: 0.8 }, adfin: 402.8, exist: 623.8, savings: 35, warn: false },
  { name: 'C4 card-only', input: { count: 100, volume: 20000, cardPct: 100, ddPct: 0 }, adfin: 220, exist: 500, savings: 56, warn: false },
  { name: 'C5 dd-only', input: { count: 100, volume: 20000, cardPct: 0, ddPct: 100 }, adfin: 280, exist: 345, savings: 19, warn: false },
  { name: 'C6 referred', input: { count: 145, volume: 29000, amReferred: true }, adfin: 327.58, exist: 571.9, savings: 43, warn: false },
  { name: 'C7 referrals 5', input: { count: 145, volume: 29000, referrals: 5 }, adfin: 327.58, exist: 571.9, savings: 43, warn: false },
  { name: 'C8 referrals 10', input: { count: 145, volume: 29000, referrals: 10 }, adfin: 265.1, exist: 571.9, savings: 54, warn: false },
  { name: 'C9 referrals 21', input: { count: 145, volume: 29000, referrals: 21 }, adfin: 117.2, exist: 571.9, savings: 80, warn: false },
  { name: 'C10 >200k warn', input: { count: 500, volume: 250000 }, adfin: 2337.5, exist: 3759.37, savings: 38, warn: true },
  { name: 'C11 low count <5', input: { count: 3, volume: 600 }, adfin: 6.6, exist: 8.6, savings: 23, warn: false },
  { name: 'C12 high-count DD cap', input: { count: 2000, volume: 2000000, cardPct: 0, ddPct: 100, spread: 0.8 }, adfin: 8400, exist: 10400, savings: 19, warn: true },
];

const r2 = (n: number) => Math.round(n * 100) / 100;
let failed = 0;
for (const c of cases) {
  const q = computeQuote({ ...base, ...c.input });
  const ok = r2(q.adfinTotal) === c.adfin && r2(q.existTotal) === c.exist && q.savingsPct === c.savings && q.showWarning === c.warn;
  if (!ok) {
    failed++;
    console.error(`FAIL ${c.name}: got ${r2(q.adfinTotal)}/${r2(q.existTotal)}/${q.savingsPct}%/warn=${q.showWarning} expected ${c.adfin}/${c.exist}/${c.savings}%/warn=${c.warn}`);
  } else {
    console.log(`ok   ${c.name}`);
  }
}
if (failed) {
  console.error(`\n${failed}/${cases.length} FAILED — parity drift.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} parity cases passed.`);
