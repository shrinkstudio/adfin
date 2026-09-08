import { components } from './components';

/**
 * The blog slider embeds rebuild each slider from its CMS list, taking each
 * item's first visible child as the slide and discarding the rest of the list.
 * Items also carry a per-card style embed (CMS-bound tag colours), so tuck it
 * inside the card before that rebuild runs and both survive. Must run at
 * script-execution time: the rebuild fires on DOMContentLoaded.
 */
const preserveSliderCardStyles = (): void => {
  document.querySelectorAll('.slider_list .w-dyn-item').forEach((item) => {
    const embed = item.querySelector(':scope > .u-embed-css');
    const card = item.querySelector(':scope > :not(.u-embed-css)');
    if (embed && card) card.appendChild(embed);
  });
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preserveSliderCardStyles);
} else {
  preserveSliderCardStyles();
}

window.Webflow ||= [];
window.Webflow.push(() => {
  components();
});
