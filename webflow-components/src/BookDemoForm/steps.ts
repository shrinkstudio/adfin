/**
 * Field + step config for the book-a-demo form. Field `name`s are the HubSpot
 * contact property names (firstname, lastname, email, company, industry,
 * territory, numemployees), so they map straight through to HubSpot and
 * RevenueHero routing.
 */
export type FieldType = 'text' | 'email' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: string[];
}

export interface StepDef {
  fields: FieldDef[];
}

export const TERRITORIES = [
  'South West', 'North West', 'East of England', 'London', 'South East',
  'West Midlands', 'Yorkshire and the Humber', 'East Midlands', 'Scotland',
  'North East', 'Wales', 'Northern Ireland', 'Channel Islands', 'Other',
];

/* values match the industry options in Adfin's RevenueHero routing */
export const INDUSTRIES = [
  'Accounting or bookkeeper', 'Managed Service Provider', 'Property and Real Estate',
  'Field Services', 'Law firm', 'Recruitment', 'Agency', 'Other',
];

export const NUM_EMPLOYEES = ['1-5', '5-25', '25-50', '50-100', '100-500', '500-1000', '1000+'];

export const STEPS: StepDef[] = [
  {
    fields: [
      { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    ],
  },
  {
    fields: [
      { name: 'firstname', label: 'First name', type: 'text', required: true, autoComplete: 'given-name' },
      { name: 'lastname', label: 'Last name', type: 'text', required: true, autoComplete: 'family-name' },
    ],
  },
  {
    fields: [
      { name: 'company', label: 'Company name', type: 'text', required: true, autoComplete: 'organization' },
      { name: 'industry', label: 'Industry', type: 'select', required: true, options: INDUSTRIES },
      { name: 'territory', label: 'Company location', type: 'select', required: true, options: TERRITORIES },
      { name: 'numemployees', label: 'Number of employees', type: 'select', required: true, options: NUM_EMPLOYEES },
    ],
  },
];

/* region only routes UK leads, so single-calendar locales run without it */
export const stepsFor = (showRegion: boolean): StepDef[] =>
  showRegion
    ? STEPS
    : STEPS.map((s) => ({ fields: s.fields.filter((f) => f.name !== 'territory') }));

export const ALL_FIELD_NAMES = STEPS.flatMap((s) => s.fields.map((f) => f.name));

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
