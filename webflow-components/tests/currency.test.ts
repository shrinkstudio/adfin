/**
 * Locale -> currency mapping and money formatting.
 * Run: `node --experimental-strip-types tests/currency.test.ts`
 */
import { currencyForLocale, formatMoney } from '../src/PricingCalculator/currency.ts';

let failed = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  if (got !== want) {
    failed++;
    console.error(`FAIL ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  } else console.log(`ok   ${name}`);
};

eq('primary en', currencyForLocale('en'), 'GBP');
eq('en-GB', currencyForLocale('en-GB'), 'GBP');
eq('missing locale', currencyForLocale(undefined), 'GBP');
eq('en-IE', currencyForLocale('en-IE'), 'EUR');
eq('en-US', currencyForLocale('en-US'), 'USD');
eq('fr-FR (later)', currencyForLocale('fr-FR'), 'EUR');
eq('underscore tag', currencyForLocale('en_IE'), 'EUR');
eq('lowercase region', currencyForLocale('en-ie'), 'EUR');
eq('unmapped region', currencyForLocale('en-AU'), 'GBP');

eq('GBP format', formatMoney(1234.5, 'GBP'), '£1,234.50');
eq('EUR format', formatMoney(1234.5, 'EUR'), '€1,234.50');
eq('USD format', formatMoney(1234.5, 'USD'), '$1,234.50');
eq('zero', formatMoney(0, 'EUR'), '€0.00');

if (failed) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log('all currency tests passed');
