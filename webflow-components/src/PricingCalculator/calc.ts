/**
 * Adfin pricing engine — a faithful 1:1 port of the live adfin.com/pricing
 * inline calculator. Verified against the live page's own function across 12
 * input sets (default, all spread settings, card-only, dd-only, referral tiers
 * 0/5/10/21, >£200k warning, low-count <5 branch, high-count DD-cap branch) —
 * all identical. Do not change the math without re-checking parity.
 *
 * Pure: data in, data out. No DOM. Rates are decimals (0.01 = 1%).
 */

export interface MethodRate {
  pct: number; // decimal, e.g. 0.01 for 1%
  fixed: number; // £ per transaction
  cap: number; // £ cap; 0 means "no cap" for the direct-math branch
}

export interface Rates {
  card: MethodRate;
  ddBase: number; // Adfin direct-debit rate before referral tiers (decimal)
  ddFixed: number;
  ddCap: number;
  bank: MethodRate;
  referralTiers: { t21: number; t9: number; t1: number };
  warningThreshold: number;
  defaultSplit: { card: number; dd: number; bank: number };
}

export interface ExistingProvider {
  pct?: number; // entered as a whole percent, e.g. 1.5 for 1.5%
  fixed?: number;
  cap?: number;
}

export interface QuoteInput {
  count: number;
  volume: number;
  spread: number; // value-consistency factor (0.8 / 0.6 / 0.4)
  cardPct: number | null; // % of volume split; null = "not set"
  ddPct: number | null;
  bankPct: number | null;
  amReferred: boolean;
  referrals: number;
  showBank: boolean;
  existing: { card?: ExistingProvider; dd?: ExistingProvider; bank?: ExistingProvider };
}

export interface QuoteResult {
  atv: number;
  perMethod: Record<'card' | 'dd' | 'bank', { adfin: number; exist: number }>;
  adfinTotal: number;
  existTotal: number;
  savingsPct: number;
  showWarning: boolean;
}

export const DEFAULT_RATES: Rates = {
  card: { pct: 0.01, fixed: 0.2, cap: 0 }, // 1% + 20p, no cap
  ddBase: 0.01, // 1% before referral tiers
  ddFixed: 0.2,
  ddCap: 4.0,
  bank: { pct: 0.01, fixed: 0.2, cap: 4.0 }, // hidden by default
  referralTiers: { t21: 0.0, t9: 0.005, t1: 0.0075 }, // >=21 / >=9 / (>=1 or referred)
  warningThreshold: 200000,
  defaultSplit: { card: 30, dd: 70, bank: 0 },
};

// Per-method fee — identical branch logic to the live `calc(p)`.
function methodFee(p: MethodRate, mCount: number, atv: number, spread: number): number {
  const mVol = mCount * atv;
  let totalPctFee = 0;
  if (mCount < 5 || p.cap === 0 || p.pct === 0) {
    let feePerTx = atv * p.pct;
    if (p.cap > 0 && feePerTx > p.cap) feePerTx = p.cap;
    totalPctFee = feePerTx * mCount;
  } else {
    const capThreshold = p.cap / p.pct;
    const ratio = atv / capThreshold;
    const probHittingCap = Math.min(1, spread * ratio);
    totalPctFee = mCount * probHittingCap * p.cap + mVol * (1 - probHittingCap) * p.pct;
  }
  return totalPctFee + mCount * p.fixed;
}

export function computeQuote(input: QuoteInput, rates: Rates = DEFAULT_RATES): QuoteResult {
  const count = input.count || 0;
  const volume = input.volume || 0;
  const spread = input.spread || 0.6;
  const atv = count > 0 ? volume / count : 0;

  // Split: all-or-nothing default when every split field is blank. Bank is the
  // remainder of the count, so only the card/dd split percentages are needed.
  let cardPct: number, ddPct: number;
  if (input.cardPct == null && input.ddPct == null && input.bankPct == null) {
    cardPct = rates.defaultSplit.card;
    ddPct = rates.defaultSplit.dd;
  } else {
    cardPct = input.cardPct || 0;
    ddPct = input.ddPct || 0;
  }

  // Referral tiers -> Adfin direct-debit rate.
  let adfinDDRate = rates.ddBase;
  const referrals = input.referrals || 0;
  if (referrals >= 21) adfinDDRate = rates.referralTiers.t21;
  else if (referrals >= 9) adfinDDRate = rates.referralTiers.t9;
  else if (referrals >= 1 || input.amReferred) adfinDDRate = rates.referralTiers.t1;

  const countCard = Math.round(count * (cardPct / 100));
  const countDD = Math.round(count * (ddPct / 100));
  const countBank = Math.max(0, count - countCard - countDD);

  const ex = input.existing || {};
  const methods = [
    {
      name: 'card' as const,
      visible: true,
      mCount: countCard,
      adfin: rates.card,
      exist: { pct: (ex.card?.pct ?? 1.5) / 100, fixed: ex.card?.fixed ?? 0.2, cap: ex.card?.cap ?? 999999999 },
    },
    {
      name: 'dd' as const,
      visible: true,
      mCount: countDD,
      adfin: { pct: adfinDDRate, fixed: rates.ddFixed, cap: rates.ddCap },
      exist: { pct: (ex.dd?.pct ?? 1.25) / 100, fixed: ex.dd?.fixed ?? 0.2, cap: ex.dd?.cap ?? 5 },
    },
    {
      name: 'bank' as const,
      visible: !!input.showBank,
      mCount: countBank,
      adfin: rates.bank,
      exist: { pct: (ex.bank?.pct ?? 1) / 100, fixed: ex.bank?.fixed ?? 0.2, cap: ex.bank?.cap ?? 999999999 },
    },
  ];

  let adfinTotal = 0;
  let existTotal = 0;
  const perMethod: QuoteResult['perMethod'] = {
    card: { adfin: 0, exist: 0 },
    dd: { adfin: 0, exist: 0 },
    bank: { adfin: 0, exist: 0 },
  };

  for (const m of methods) {
    if (!m.visible || m.mCount <= 0) {
      perMethod[m.name] = { adfin: 0, exist: 0 };
      continue;
    }
    const aCost = methodFee(m.adfin, m.mCount, atv, spread);
    const eCost = methodFee(m.exist, m.mCount, atv, spread);
    adfinTotal += aCost;
    existTotal += eCost;
    perMethod[m.name] = { adfin: aCost, exist: eCost };
  }

  const savingsPct =
    existTotal > 0 ? Math.max(0, Math.round(((existTotal - adfinTotal) / existTotal) * 100)) : 0;

  return {
    atv,
    perMethod,
    adfinTotal,
    existTotal,
    savingsPct,
    showWarning: volume > rates.warningThreshold,
  };
}
