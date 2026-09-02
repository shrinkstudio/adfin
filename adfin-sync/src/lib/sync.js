/**
 * Luma → Events CMS sync core, shared by the /api routes.
 * Same ownership contract as content-sync/src/sync-events.js:
 * Luma owns content fields, editors own curation, new items land as drafts.
 */

import { listAllEvents, locationLine } from './luma.js';
import { listItems, createItem, updateItem } from './webflow.js';

const EVENTS_COLLECTION_ID = '6a74ab1e0f9d8a5183a5f044';

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'event';

const round6 = (n) => String(Number(Number(n).toFixed(6)));

const lumaFields = (event) => {
  const fields = {
    'luma-id': event.lumaId,
    'start-date-time': event.startAt,
    'end-date-time': event.endAt,
    'rsvp-link': event.url,
  };
  const location = locationLine(event.address);
  if (location) fields.location = location;
  if (event.latitude != null) fields['latitude-2'] = round6(event.latitude);
  if (event.longitude != null) fields['longitude-2'] = round6(event.longitude);
  return fields;
};

const changed = (existing, incoming) =>
  Object.entries(incoming).some(([key, value]) => (existing[key] ?? null) !== (value ?? null));

const loadState = async (env) => {
  const [lumaEventsRaw, items] = await Promise.all([
    listAllEvents(env.LUMA_API_KEY),
    listItems(env.WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID),
  ]);
  const lumaEvents = lumaEventsRaw.filter((e) => e.lumaId && !/template/i.test(e.name));
  const byLumaId = new Map(
    items.filter((i) => i.fieldData['luma-id']).map((i) => [i.fieldData['luma-id'], i])
  );
  return { lumaEvents, items, byLumaId };
};

const itemStatus = (item) => {
  if (!item) return 'new';
  if (item.isDraft) return 'draft';
  return item.lastPublished ? 'published' : 'staged';
};

/** Read-only merged view for the dashboard. */
export const statusReport = async (env) => {
  const { lumaEvents, items, byLumaId } = await loadState(env);
  const lumaIds = new Set(lumaEvents.map((e) => e.lumaId));

  const events = lumaEvents.map((event) => {
    const item = byLumaId.get(event.lumaId) ?? null;
    return {
      lumaId: event.lumaId,
      name: event.name,
      startAt: event.startAt,
      location: locationLine(event.address),
      lumaUrl: event.url,
      status: itemStatus(item),
      pendingUpdate: item ? changed(item.fieldData, lumaFields(event)) : false,
      needsCuration: item ? !item.fieldData['event-type'] || !item.fieldData['short-description'] : true,
    };
  });

  const orphaned = [...byLumaId.entries()]
    .filter(([lumaId]) => !lumaIds.has(lumaId))
    .map(([lumaId, item]) => ({ lumaId, name: item.fieldData.name, status: itemStatus(item) }));

  return { events, orphaned, cmsTotal: items.length };
};

/** Run the sync. Returns a summary of what changed. */
export const syncEvents = async (env) => {
  const { lumaEvents, items, byLumaId } = await loadState(env);
  const usedSlugs = new Set(items.map((i) => i.fieldData.slug));
  const created = [];
  const updated = [];

  for (const event of lumaEvents) {
    const existing = byLumaId.get(event.lumaId);

    if (!existing) {
      let slug = slugify(event.name);
      while (usedSlugs.has(slug)) slug = `${slug}-${event.lumaId.slice(-4).toLowerCase()}`;
      usedSlugs.add(slug);
      await createItem(env.WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID, {
        name: event.name,
        slug,
        ...lumaFields(event),
        ...(event.coverUrl ? { image: { url: event.coverUrl } } : {}),
      });
      created.push(event.name);
      continue;
    }

    const incoming = { ...lumaFields(event), name: event.name };
    if (!changed(existing.fieldData, incoming)) continue;
    await updateItem(env.WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID, existing.id, incoming);
    updated.push(event.name);
  }

  return { created, updated, total: lumaEvents.length, at: new Date().toISOString() };
};
