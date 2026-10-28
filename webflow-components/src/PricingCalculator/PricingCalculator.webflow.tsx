import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { PricingCalculator } from './PricingCalculator';

export default declareComponent(PricingCalculator, {
  name: 'Pricing Calculator',
  description: 'Adfin savings calculator — payment collection + credit control fee comparison.',
  group: 'Adfin',
  props: {
    theme: props.Variant({ name: 'Theme', options: ['dark', 'light'], defaultValue: 'dark' }),

    // Copy
    headingVolumes: props.Text({ name: 'Heading — volumes', defaultValue: 'Your volumes' }),
    headingExisting: props.Text({ name: 'Heading — existing provider', defaultValue: 'Your pricing with existing provider(s)' }),
    headingResults: props.Text({ name: 'Heading — results', defaultValue: 'Your results' }),
    resultsNote: props.Text({ name: 'Results note', defaultValue: '(Supplementary fees are not modelled)' }),
    warningText: props.Text({ name: 'High-volume warning', defaultValue: 'Your volumes are higher than our standard pricing: speak to us to discuss improved pricing.' }),
    ctaLabel: props.Text({ name: 'CTA label', defaultValue: '' }),
    ctaLink: props.Link({ name: 'CTA link' }),

    // Adfin rates (percentages and £). Defaults match the current live calculator.
    cardRate: props.Number({ name: 'Card rate (%)', defaultValue: 1.0 }),
    ddBaseRate: props.Number({ name: 'Direct debit base rate (%)', defaultValue: 1.0 }),
    fixedFee: props.Number({ name: 'Fixed fee (£)', defaultValue: 0.2 }),
    ddCap: props.Number({ name: 'Direct debit cap (£)', defaultValue: 4.0 }),
    bankRate: props.Number({ name: 'Bank rate (%)', defaultValue: 1.0 }),
    bankCap: props.Number({ name: 'Bank cap (£)', defaultValue: 4.0 }),

    // Referral tiers -> reduced DD rate
    ddRateTier1: props.Number({ name: 'DD rate — referred / 1–8 referrals (%)', defaultValue: 0.75 }),
    ddRateTier2: props.Number({ name: 'DD rate — 9–20 referrals (%)', defaultValue: 0.5 }),
    ddRateTier3: props.Number({ name: 'DD rate — 21+ referrals (%)', defaultValue: 0.0 }),

    // Thresholds & defaults
    warningThreshold: props.Number({ name: 'High-volume threshold (£)', defaultValue: 200000 }),
    defaultCardSplit: props.Number({ name: 'Default card split (%)', defaultValue: 30 }),
    defaultDdSplit: props.Number({ name: 'Default direct debit split (%)', defaultValue: 70 }),
    showBank: props.Boolean({ name: 'Show bank payments row', defaultValue: false }),

    // Currency: Auto follows the page locale (Ireland -> EUR, United States -> USD, UK -> GBP)
    currency: props.Variant({ name: 'Currency', options: ['auto', 'GBP', 'EUR', 'USD'], defaultValue: 'auto' }),

    // Euro amounts (percentage rates are shared with GBP)
    fixedFeeEur: props.Number({ name: 'EUR fixed fee (€)', defaultValue: 0.2 }),
    ddCapEur: props.Number({ name: 'EUR direct debit cap (€)', defaultValue: 4.0 }),
    bankCapEur: props.Number({ name: 'EUR bank cap (€)', defaultValue: 4.0 }),
    warningThresholdEur: props.Number({ name: 'EUR high-volume threshold (€)', defaultValue: 200000 }),

    // US dollar amounts
    fixedFeeUsd: props.Number({ name: 'USD fixed fee ($)', defaultValue: 0.2 }),
    ddCapUsd: props.Number({ name: 'USD direct debit cap ($)', defaultValue: 4.0 }),
    bankCapUsd: props.Number({ name: 'USD bank cap ($)', defaultValue: 4.0 }),
    warningThresholdUsd: props.Number({ name: 'USD high-volume threshold ($)', defaultValue: 200000 }),
    ddLabelUsd: props.Text({ name: 'USD label for direct debit', defaultValue: 'Direct debit' }),
  },
});
