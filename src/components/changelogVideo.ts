import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('changelogVideo');

/** CMS-bound data carrier inside each changelog card (empty when no clip). */
const SOURCE = '[data-changelog-video]';
/* load clips this far before they scroll into view */
const ROOT_MARGIN = '400px';

/**
 * Gif-style video for changelog cards. Each card carries a hidden div whose
 * data-changelog-video attribute is CMS-bound to a hosted MP4 URL. The module
 * overlays a muted looping video on the card's Main Image: the image keeps
 * doing the layout work and stays as the poster/fallback, the video fades in
 * only once it is actually playing. Clips load near the viewport and pause
 * off-screen, so cards with videos cost nothing until scrolled to. Reduced
 * motion keeps the static image.
 */
export const changelogVideo = (): void => {
  const sources = Array.from(document.querySelectorAll<HTMLElement>(SOURCE));
  if (!sources.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sources.forEach((el) => el.remove());
    return;
  }

  let armed = 0;

  const entriesByVideo = new Map<Element, { url: string; loaded: boolean }>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        const state = entriesByVideo.get(video);
        if (!state) return;
        if (isIntersecting) {
          if (!state.loaded) {
            state.loaded = true;
            video.src = state.url;
          }
          video.play().catch(() => {
            /* autoplay refused — the image is still there */
          });
        } else if (state.loaded) {
          video.pause();
        }
      });
    },
    { rootMargin: ROOT_MARGIN }
  );

  sources.forEach((source) => {
    const url = source.getAttribute('data-changelog-video')?.trim();
    const card = source.closest<HTMLElement>('.changelog_card') || source.parentElement;
    source.remove();
    if (!url || !card) return;

    const img = card.querySelector<HTMLImageElement>('.u-image-wrapper img');
    const wrapper = img?.closest<HTMLElement>('.u-image-wrapper');
    if (!img || !wrapper) return;

    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.autoplay = false;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    video.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.3s ease;pointer-events:none;';

    const wrapperPosition = window.getComputedStyle(wrapper).position;
    if (wrapperPosition === 'static') wrapper.style.position = 'relative';

    on(video, 'playing', () => {
      video.style.opacity = '1';
    });
    on(video, 'error', () => {
      observer.unobserve(video);
      video.remove();
      log('clip failed, image kept', url);
    });

    wrapper.appendChild(video);
    entriesByVideo.set(video, { url, loaded: false });
    observer.observe(video);
    armed += 1;
  });

  if (armed) log('armed', { clips: armed });
};
