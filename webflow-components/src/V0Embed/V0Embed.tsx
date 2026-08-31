import { useEffect, useRef, useState } from 'react';

export interface V0EmbedProps {
  sourceUrl?: string;
  title?: string;
  aspectRatio?: string;
  maxWidth?: string;
  mountMargin?: string;
  posterUrl?: string;
}

/**
 * Lazy-mounting iframe shell for the client's V0/Vercel UI animations.
 *
 * `loading="lazy"` alone only defers the FIRST load — once booted, an embedded
 * React app animates forever. This shell goes further: the iframe src is only
 * set while the embed is near the viewport (mountMargin), and removed again
 * once it scrolls far away, so five embeds on a page cost nothing off-screen.
 *
 * Reduced motion never mounts the iframe at all and shows the poster instead —
 * which is also the pre-mount placeholder, so give it the old static
 * screenshot and the page reads correctly in every state.
 */
export const V0Embed = ({
  sourceUrl = '',
  title = 'UI animation',
  aspectRatio = '16/10',
  maxWidth = '620px',
  mountMargin = '600px',
  posterUrl = '',
}: V0EmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
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
    if (!el || reducedMotion || !sourceUrl) return;
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
  }, [reducedMotion, sourceUrl, mountMargin]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth,
        aspectRatio,
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {posterUrl ? (
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
      {mounted && !reducedMotion && sourceUrl ? (
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
