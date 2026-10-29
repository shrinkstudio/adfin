import { useEffect, useRef, useState, type CSSProperties } from 'react';

export interface V0EmbedProps {
  sourceUrl?: string;
  title?: string;
  aspectRatio?: string;
  aspectRatioMobile?: string;
  maxWidth?: string;
  mountMargin?: string;
  posterUrl?: string;
  lottieUrl?: string;
  lottieFrame?: number;
}

/* the slice of lottie-web this component uses */
interface LottiePlayer {
  play(): void;
  pause(): void;
  goToAndStop(value: number, isFrame?: boolean): void;
  addEventListener(name: string, cb: () => void): void;
  destroy(): void;
}

/**
 * Lazy-mounting shell for the client's UI animations: a V0/Vercel iframe, or a
 * Lottie when `lottieUrl` is set (the Lottie wins if both are filled in).
 *
 * `loading="lazy"` alone only defers the FIRST load — once booted, an embedded
 * React app animates forever. This shell goes further: the iframe src is only
 * set while the embed is near the viewport (mountMargin), and removed again
 * once it scrolls far away, so five embeds on a page cost nothing off-screen.
 *
 * Reduced motion never mounts the iframe at all and shows the poster instead —
 * which is also the pre-mount placeholder, so give it the old static
 * screenshot and the page reads correctly in every state.
 *
 * Lottie: the player (lottie-web's SVG-only build) is fetched only when a
 * Lottie card nears the viewport, then kept. It plays while the card is on
 * screen and pauses off it. Reduced motion shows a still frame (`lottieFrame`).
 */
export const V0Embed = ({
  sourceUrl = '',
  title = 'UI animation',
  aspectRatio = '16/10',
  aspectRatioMobile = '',
  maxWidth = '620px',
  mountMargin = '600px',
  posterUrl = '',
  lottieUrl = '',
  lottieFrame = 0,
}: V0EmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<LottiePlayer | null>(null);
  const [mounted, setMounted] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [lottieReady, setLottieReady] = useState(false);
  const isLottie = !!lottieUrl;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const list = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isLottie || reducedMotion || !sourceUrl) return;
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setMounted(entries[0].isIntersecting),
      { rootMargin: mountMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLottie, reducedMotion, sourceUrl, mountMargin]);

  // Lottie: load once near the viewport, then track whether it's on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isLottie) return;
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      setOnScreen(true);
      return;
    }
    const near = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMounted(true);
          near.disconnect();
        }
      },
      { rootMargin: mountMargin }
    );
    const visible = new IntersectionObserver((entries) => setOnScreen(entries[0].isIntersecting));
    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, [isLottie, mountMargin]);

  useEffect(() => {
    if (!isLottie || !mounted || !lottieRef.current) return;
    let cancelled = false;
    import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (cancelled || !lottieRef.current) return;
      const anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: lottieUrl,
      }) as unknown as LottiePlayer;
      playerRef.current = anim;
      anim.addEventListener('DOMLoaded', () => setLottieReady(true));
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setLottieReady(false);
    };
  }, [isLottie, mounted, lottieUrl]);

  useEffect(() => {
    const anim = playerRef.current;
    if (!anim || !lottieReady) return;
    if (reducedMotion) anim.goToAndStop(lottieFrame, true);
    else if (onScreen) anim.play();
    else anim.pause();
  }, [lottieReady, onScreen, reducedMotion, lottieFrame]);

  return (
    <div
      ref={containerRef}
      className="v0-shell"
      style={
        {
          width: '100%',
          maxWidth,
          margin: '0 auto',
          overflow: 'hidden',
          position: 'relative',
          /* ratio lives in vars so the media query can switch it */
          '--v0-ar': aspectRatio,
          '--v0-ar-mobile': aspectRatioMobile || aspectRatio,
        } as CSSProperties
      }
    >
      {/* raw CSS: text children get escaped on SSR and fail hydration (#425) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .v0-shell { aspect-ratio: var(--v0-ar); }
        @media (max-width: 767px) {
          .v0-shell { aspect-ratio: var(--v0-ar-mobile); }
        }
      `,
        }}
      />
      {posterUrl && !(isLottie && lottieReady) ? (
        <img
          src={posterUrl}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}
      {isLottie ? (
        <div
          ref={lottieRef}
          role="img"
          aria-label={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      ) : null}
      {!isLottie && mounted && !reducedMotion && sourceUrl ? (
        <iframe
          src={sourceUrl}
          title={title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
          }}
        />
      ) : null}
    </div>
  );
};
