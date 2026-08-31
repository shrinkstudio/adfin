import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { V0Embed } from './V0Embed';

export default declareComponent(V0Embed, {
  name: 'V0 Embed',
  description:
    'Lazy-mounting iframe for the V0/Vercel UI animations. Only runs while near the viewport; shows the poster under reduced motion.',
  group: 'Adfin',
  props: {
    sourceUrl: props.Text({ name: 'Source URL', defaultValue: '' }),
    title: props.Text({ name: 'Title (accessibility)', defaultValue: 'UI animation' }),
    aspectRatio: props.Text({ name: 'Aspect ratio', defaultValue: '16/10' }),
    maxWidth: props.Text({ name: 'Max width', defaultValue: '620px' }),
    mountMargin: props.Text({ name: 'Mount margin', defaultValue: '600px' }),
    posterUrl: props.Text({ name: 'Poster image URL', defaultValue: '' }),
  },
});
