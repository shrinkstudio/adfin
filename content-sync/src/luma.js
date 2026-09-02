/**
 * Luma public API client (calendar-scoped key, Luma Plus).
 * https://docs.luma.com/reference/get_v1-calendars-events-list
 */

const BASE = 'https://public-api.luma.com';

const request = async (apiKey, path, params = {}) => {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  }
  const res = await fetch(url, { headers: { 'x-luma-api-key': apiKey, accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Luma ${res.status} on ${path}: ${body.slice(0, 300)}`);
  }
  return res.json();
};

/**
 * Older responses wrap each entry as { api_id, event: {...} }; newer ones are
 * flat. Normalise both to one shape so the mapper never has to care.
 */
const normaliseEntry = (entry) => {
  const event = entry.event ?? entry;
  const coordinate = event.coordinate ?? {};
  const geo = event.geo_address_json ?? {};
  return {
    lumaId: event.api_id ?? event.id ?? entry.api_id,
    name: event.name ?? '',
    startAt: event.start_at ?? null,
    endAt: event.end_at ?? null,
    timezone: event.timezone ?? null,
    url: event.url ?? null,
    coverUrl: event.cover_url ?? null,
    descriptionMd: event.description_md ?? event.description ?? null,
    latitude: coordinate.latitude ?? event.geo_latitude ?? geo.latitude ?? null,
    longitude: coordinate.longitude ?? event.geo_longitude ?? geo.longitude ?? null,
    address: geo,
    visibility: event.visibility ?? null,
    platform: event.platform ?? entry.platform ?? 'luma',
  };
};

/** Human location line, best effort: "Venue, City" from the address object. */
export const locationLine = (address) => {
  if (!address || typeof address !== 'object') return null;
  const parts = [address.name ?? address.address, address.city ?? address.city_state]
    .filter(Boolean)
    .map(String);
  return parts.length ? [...new Set(parts)].join(', ') : null;
};

/** All events the calendar manages, upcoming and past, fully paginated. */
export const listAllEvents = async (apiKey) => {
  const events = [];
  let cursor;
  do {
    const page = await request(apiKey, '/v1/calendars/events/list', {
      pagination_limit: 50,
      pagination_cursor: cursor,
      sort_column: 'start_at',
      sort_direction: 'desc',
    });
    for (const entry of page.entries ?? []) events.push(normaliseEntry(entry));
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return events;
};
