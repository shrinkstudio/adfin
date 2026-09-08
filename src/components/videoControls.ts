import { attributeSelector } from '$utils/attributes';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const OPT_IN = attributeSelector('video-controls');
/** Pages whose films get controls without any attribute markup. The customer
 * story videos are real films with soundtracks, but the Visual Video component
 * renders them like ambient background video (autoplay loop muted, no UI). */
const CONTROLLED_PATHS = ['/customer-stories/'];

const log = createLogger('videoControls');

const enable = (video: HTMLVideoElement): void => {
  video.controls = true;
  // Autoplay stays (it must remain muted to be allowed); the native controls
  // give the visitor the unmute. Once they interact, stop the ambient loop.
  video.loop = false;
  video.addEventListener(
    'volumechange',
    () => {
      if (!video.muted) video.currentTime = 0;
    },
    { once: true }
  );
};

export const videoControls = (): void => {
  const targets = new Set<HTMLVideoElement>(queryElements<HTMLVideoElement>(`video${OPT_IN}`));
  if (CONTROLLED_PATHS.some((p) => window.location.pathname.startsWith(p))) {
    queryElements<HTMLVideoElement>('video.u-video').forEach((v) => targets.add(v));
  }
  targets.forEach(enable);
  log('instances', targets.size);
};
