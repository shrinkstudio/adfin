import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('changelogVideo');

/** Videos that lazy-load: src held in data-video-src until near the viewport. */
const SOURCE = 'video[data-video-src]';
const CARD = '.changelog_card';
const IMAGE = '.u-image-wrapper img';
/* load clips this far before they scroll into view */
const ROOT_MARGIN = '400px';

/**
 * Gif-style lazy video for changelog cards. Each card holds a native <video>
 * (hidden by default, data-video-src CMS-bound to a hosted MP4) next to the
 * Main Image. The image does the poster work: it stays visible until the clip
 * is genuinely playing, then the module swaps the two. src is only applied
 * near the viewport and playback pauses off-screen, so cards cost nothing
 * until scrolled to. No JS, reduced motion, autoplay refusal or a dead clip
 * URL all leave the image exactly as it was.
 */
export const changelogVideo = (): void => {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(SOURCE)).filter((v) =>
    (v.dataset.videoSrc || '').trim()
  );
  if (!videos.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const swapped = new WeakSet<HTMLVideoElement>();

  const reveal = (video: HTMLVideoElement): void => {
    if (swapped.has(video)) return;
    swapped.add(video);
    video.style.display = 'block';
    const img = video.closest(CARD)?.querySelector<HTMLElement>(IMAGE);
    if (img) img.style.display = 'none';
  };

  // The video itself is display: none until it plays, which gives it no box
  // for IntersectionObserver — so the card is what gets observed.
  const videoByCard = new Map<Element, HTMLVideoElement>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = videoByCard.get(target);
        if (!video) return;
        if (isIntersecting) {
          if (!video.src) {
            video.src = (video.dataset.videoSrc || '').trim();
            on(video, 'playing', () => reveal(video));
            on(video, 'error', () => {
              log('clip failed, image kept', video.dataset.videoSrc);
            });
          }
          video.muted = true;
          video.play().catch(() => {
            /* autoplay refused — the image is still showing */
          });
        } else if (video.src) {
          video.pause();
        }
      });
    },
    { rootMargin: ROOT_MARGIN }
  );

  videos.forEach((video) => {
    const card = video.closest(CARD) || video.parentElement;
    if (!card) return;
    videoByCard.set(card, video);
    observer.observe(card);
  });
  log('armed', { clips: videoByCard.size });
};
