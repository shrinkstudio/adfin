import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const MAP = attributeSelector('hub-map');
const POINT = attributeSelector('map-point');

const GL_VERSION = 'v3.9.0';
const GL_BASE = `https://api.mapbox.com/mapbox-gl-js/${GL_VERSION}`;

const DEFAULT_STYLE = 'mapbox://styles/mapbox/light-v11';
const PIN_COLOR = '#084235';

const log = createLogger('hubMap');

interface MapPoint {
  lat: number;
  lng: number;
  name: string;
  date: string;
  href: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- mapbox-gl arrives at runtime, untyped */
declare global {
  interface Window {
    mapboxgl?: any;
  }
}

let glLoading: Promise<any> | null = null;

/** Pull mapbox-gl (script + css) in only when a hub map exists on the page. */
const loadMapboxGl = (): Promise<any> => {
  if (window.mapboxgl) return Promise.resolve(window.mapboxgl);
  if (glLoading) return glLoading;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${GL_BASE}/mapbox-gl.css`;
  document.head.appendChild(link);

  glLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${GL_BASE}/mapbox-gl.js`;
    script.onload = () => resolve(window.mapboxgl);
    script.onerror = () => reject(new Error('mapbox-gl failed to load'));
    document.head.appendChild(script);
  });
  return glLoading;
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const readPoints = (scope: HTMLElement): MapPoint[] =>
  queryElements<HTMLElement>(POINT, scope)
    .map((el) => ({
      lat: Number(el.getAttribute('data-lat')),
      lng: Number(el.getAttribute('data-lng')),
      name: el.getAttribute('data-name') ?? '',
      date: el.getAttribute('data-date') ?? '',
      href: el.getAttribute('data-href') ?? '',
    }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat !== 0);

/**
 * Interactive event map for the events hub. `[data-hub-map]` is the sized
 * container (with `data-map-token`, optional `data-map-style`); pins come
 * from `[data-map-point]` elements — typically a hidden CMS collection list —
 * each carrying `data-lat`, `data-lng`, `data-name`, `data-date`, `data-href`.
 * The view fits every pin; clicking one opens a popup with the event details.
 */
const createHubMap = (container: HTMLElement): Destroyable | null => {
  const token = (container.getAttribute('data-map-token') ?? '').trim();
  if (!token) {
    log('skipped: no token');
    return null;
  }
  // Points may live inside the container or elsewhere on the page.
  const points = readPoints(document.body);
  if (!points.length) {
    log('skipped: no points');
    return null;
  }

  const cleanup = createCleanup();
  let map: any = null;
  let cancelled = false;

  loadMapboxGl()
    .then((mapboxgl) => {
      if (cancelled) return;
      mapboxgl.accessToken = token;

      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.lng, p.lat]));

      map = new mapboxgl.Map({
        container,
        style: (container.getAttribute('data-map-style') ?? '').trim() || DEFAULT_STYLE,
        bounds,
        fitBoundsOptions: { padding: 64, maxZoom: 12 },
        // Trackpad/wheel zoom hijacks page scroll; pinch and buttons still work.
        scrollZoom: false,
        attributionControl: true,
        cooperativeGestures: true,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

      for (const point of points) {
        const popup = new mapboxgl.Popup({ offset: 28, closeButton: false }).setHTML(
          `<div class="hub-map__popup">` +
            `<strong>${escapeHtml(point.name)}</strong>` +
            (point.date ? `<div>${escapeHtml(point.date)}</div>` : '') +
            (point.href
              ? `<a href="${escapeHtml(point.href)}" target="_blank" rel="noreferrer">RSVP</a>`
              : '') +
            `</div>`
        );
        new mapboxgl.Marker({ color: PIN_COLOR })
          .setLngLat([point.lng, point.lat])
          .setPopup(popup)
          .addTo(map);
      }

      log('init', { points: points.length });
    })
    .catch((error) => log('failed', error));

  cleanup.add(() => {
    cancelled = true;
    map?.remove();
  });

  return { destroy: () => cleanup.run() };
};

export const hubMap = (): void => {
  const instances = createInstances(MAP, createHubMap).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
