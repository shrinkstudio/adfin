import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { V0Embed } from './V0Embed';

export default declareComponent(V0Embed, {
  name: 'V0 Embed',
  description:
    'UI animation card: a V0/Vercel iframe, or a Lottie when Lottie URL is set. Only loads near the viewport and plays while on screen; reduced motion shows the poster (iframe) or a still frame (Lottie).',
  group: 'Adfin',
  props: {
    sourceUrl: props.Text({ name: 'Source URL', defaultValue: '' }),
    title: props.Text({ name: 'Title (accessibility)', defaultValue: 'UI animation' }),
    aspectRatio: props.Text({ name: 'Aspect ratio', defaultValue: '16/10' }),
    aspectRatioMobile: props.Text({ name: 'Aspect ratio (mobile)', defaultValue: '' }),
    maxWidth: props.Text({ name: 'Max width', defaultValue: '620px' }),
    mountMargin: props.Text({ name: 'Mount margin', defaultValue: '600px' }),
    posterUrl: props.Text({ name: 'Poster image URL', defaultValue: '' }),
    lottieUrl: props.Text({ name: 'Lottie URL (.json)', defaultValue: '' }),
    lottieFrame: props.Number({ name: 'Lottie still frame (reduced motion)', defaultValue: 0 }),
  },
});
