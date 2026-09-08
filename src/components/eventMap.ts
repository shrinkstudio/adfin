import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { debounce } from '$utils/debounce';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const MAP = attributeSelector('event-map');

const DEFAULT_ZOOM = 13;
const DEFAULT_STYLE = 'light-v11';
/** Adfin green, hex without the hash as Mapbox pin syntax wants it. */
const PIN_COLOR = '084235';

const log = createLogger('eventMap');

/**
 * Static Mapbox map for the event template. `[data-event-map]` on a sized
 * container renders one pinned location as a plain image — no GL library.
 *
 * Attributes (lat/lng are CMS-bound in the Designer):
 * - `data-map-lat` / `data-map-lng`  the pin location
 * - `data-map-token`                 Mapbox public token (pk., URL-restricted)
 * - `data-map-zoom`                  optional, default 13
 * - `data-map-style`                 optional Mapbox style id, default light-v11
 */
const createEventMap = (el: HTMLElement): Destroyable | null => {
  const lat = Number(el.getAttribute('data-map-lat'));
  const lng = Number(el.getAttribute('data-map-lng'));
  const token = (el.getAttribute('data-map-token') ?? '').trim();
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !lat || !token) {
    log('skipped: missing lat/lng or token');
    return null;
  }

  const zoomRaw = Number(el.getAttribute('data-map-zoom'));
  const zoom = Number.isFinite(zoomRaw) && zoomRaw > 0 ? zoomRaw : DEFAULT_ZOOM;
  const style = (el.getAttribute('data-map-style') ?? '').trim() || DEFAULT_STYLE;

  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.display = 'block';
  el.appendChild(img);

  let lastSize = '';
  const render = () => {
    // The API caps request dimensions at 1280; retina doubling happens via @2x.
    const width = Math.min(1280, Math.max(1, Math.round(el.clientWidth)));
    const height = Math.min(1280, Math.max(1, Math.round(el.clientHeight)));
    if (!width || !height) return;
    const size = `${width}x${height}`;
    if (size === lastSize) return;
    lastSize = size;
    img.src =
      `https://api.mapbox.com/styles/v1/mapbox/${style}/static/` +
      `pin-l+${PIN_COLOR}(${lng},${lat})/${lng},${lat},${zoom}/${size}@2x` +
      `?access_token=${encodeURIComponent(token)}`;
  };

  const cleanup = createCleanup();
  cleanup.add(on(window, 'resize', debounce(render, 300)));
  render();

  log('init', { lat, lng, zoom });
  return {
    destroy: () => {
      cleanup.run();
      img.remove();
    },
  };
};

export const eventMap = (): void => {
  const instances = createInstances(MAP, createEventMap).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
