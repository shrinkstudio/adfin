import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { BookDemoForm } from './BookDemoForm';

export default declareComponent(BookDemoForm, {
  name: 'Book a Demo Form',
  description: 'Multi-step book-a-demo form → HubSpot + RevenueHero routing/scheduling.',
  group: 'Adfin',
  props: {
    theme: props.Variant({ name: 'Theme', options: ['light', 'dark'], defaultValue: 'light' }),

    // Integration
    hubspotPortalId: props.Text({ name: 'HubSpot portal ID', defaultValue: '' }),
    hubspotFormGuid: props.Text({ name: 'HubSpot form GUID', defaultValue: '' }),
    routerId: props.Text({ name: 'RevenueHero router ID', defaultValue: '5191' }),
    turnstileSitekey: props.Text({ name: 'Turnstile site key', defaultValue: '0x4AAAAAAAQTptj2So4dx43e' }),

    // Copy
    heading: props.Text({ name: 'Heading', defaultValue: 'Book a quick call with the team' }),
    subheading: props.Text({ name: 'Subheading', defaultValue: '' }),
    nextLabel: props.Text({ name: 'Next button label', defaultValue: 'Continue' }),
    submitLabel: props.Text({ name: 'Submit button label', defaultValue: 'Book a demo' }),
    successHeading: props.Text({ name: 'Success heading', defaultValue: "You're all set" }),
    successMessage: props.Text({ name: 'Success message', defaultValue: 'Pick a time that works for you in the scheduler.' }),
  },
});
