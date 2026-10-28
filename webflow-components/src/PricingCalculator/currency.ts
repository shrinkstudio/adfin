/**
 * Currency per Webflow locale. Pure: no DOM, no React.
 *
 * Webflow Localization exposes the page's locale as a BCP 47 tag (e.g.
 * "en-IE"); the region decides the currency. The primary locale ("en", the
 * UK site) and any unmapped region stay GBP, so a locale added later without
 * a mapping falls back to today's behaviour.
 */

export type CurrencyCode = 'GBP' | 'EUR' | 'USD';

interface CurrencyDef {
  symbol: string;
  numberLocale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  GBP: { symbol: '£', numberLocale: 'en-GB' },
  EUR: { symbol: '€', numberLocale: 'en-IE' },
  USD: { symbol: '$', numberLocale: 'en-US' },
};

/* euro area */
const EUR_REGIONS = new Set([
  'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT',
  'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
]);

export function currencyForLocale(locale: string | undefined | null): CurrencyCode {
  const region = (locale || '').split(/[-_]/)[1]?.toUpperCase();
  if (!region) return 'GBP';
  if (region === 'US') return 'USD';
  if (EUR_REGIONS.has(region)) return 'EUR';
  return 'GBP';
}

export function formatMoney(n: number, code: CurrencyCode): string {
  const { symbol, numberLocale } = CURRENCIES[code];
  return symbol + n.toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
