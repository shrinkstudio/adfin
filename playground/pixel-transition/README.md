# Pixel transition demo (v1)

Standalone demo of `src/components/transition.ts` — the scroll-scrubbed
pixel dissolve between the hero and the intro section (Osmo-style, no gsap).

Open `index.html` over any static server (script tags need http, not file://):

```
python3 -m http.server 8794
```

`transition.js` is the compiled component plus a tiny entry point; the source
of truth is `src/components/transition.ts` on this branch.

- Green blocks hang over the white section (leading band) and dissolve
  bottom-up as you scroll in.
- `data-transition="leading|trailing"` picks reveal/cover.
- `data-transition-range` (on the wrap) tunes how much viewport the scrub spans.
- Reduced motion / no JS falls back to the static checker.
