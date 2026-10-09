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
 * Video clips for changelog cards. Each card holds a native <video> (hidden
 * by default, data-video-src CMS-bound to a hosted MP4). The clip's first
 * frame doubles as the card image: metadata loads near the viewport, and the
 * video is revealed once that frame is ready (hiding the Main Image if the
 * entry has one, so older image-only entries still work). Playback is
 * hover-to-play on pointer devices and play-in-view on touch, always muted
 * and looping, paused whenever the card leaves the viewport. Reduced motion
 * shows the first frame and never plays. A dead URL leaves things as they
 * were.
 */
export const changelogVideo = (): void => {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(SOURCE)).filter((v) =>
    (v.dataset.videoSrc || '').trim()
  );
  if (!videos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const play = (video: HTMLVideoElement): void => {
    if (reducedMotion || !video.src) return;
    video.muted = true;
    video.play().catch(() => {
      /* autoplay refused — the first frame still shows */
    });
  };

  const load = (video: HTMLVideoElement): void => {
    if (video.src) return;
    video.preload = 'metadata';
    on(video, 'loadeddata', () => {
      video.style.display = 'block';
      const img = video.closest(CARD)?.querySelector<HTMLElement>(IMAGE);
      if (img) img.style.display = 'none';
    });
    on(video, 'error', () => {
      log('clip failed, card left as-is', video.dataset.videoSrc);
    });
    video.src = (video.dataset.videoSrc || '').trim();
  };

  // The video is display: none until its first frame is ready, which gives it
  // no box for IntersectionObserver — so the card is what gets observed.
  const videoByCard = new Map<Element, HTMLVideoElement>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = videoByCard.get(target);
        if (!video) return;
        if (isIntersecting) {
          load(video);
          if (!hoverable) play(video);
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
    if (hoverable && !reducedMotion) {
      on(card, 'mouseenter', () => {
        load(video);
        play(video);
      });
      on(card, 'mouseleave', () => video.pause());
    }
  });

  log('armed', { clips: videoByCard.size, hoverable });
};
