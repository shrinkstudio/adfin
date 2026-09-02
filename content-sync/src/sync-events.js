/**
 * Luma calendar → Webflow Events CMS sync.
 *
 * Ownership contract (the EIP pattern):
 *   Luma owns   → name*, start/end, location, lat/long, rsvp-link, description, luma-id
 *   Editor owns → event-type, short-description, image**, book-a-call-link, all SEO fields,
 *                 slug (stable after creation), publish state
 *   * name only follows Luma until an editor renames the item (see NAME_FOLLOWS_LUMA).
 *   ** image is seeded from the Luma cover on create, then never touched again.
 *
 * New events are created as DRAFTS so nothing appears on the site uncurated.
 * Events that disappear from Luma are left alone (soft: flagged in the log only).
 */

import { listAllEvents, locationLine } from './luma.js';
import { listItems, createItem, updateItem } from './webflow.js';

const LUMA_API_KEY = process.env.LUMA_API_KEY;
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
const EVENTS_COLLECTION_ID = process.env.EVENTS_COLLECTION_ID ?? '6a74ab1e0f9d8a5183a5f044';
const NAME_FOLLOWS_LUMA = process.env.NAME_FOLLOWS_LUMA !== 'false';
const DRY_RUN = process.argv.includes('--dry-run');
const LUMA_ONLY = process.argv.includes('--luma-only');

if (!LUMA_API_KEY || (!WEBFLOW_API_TOKEN && !LUMA_ONLY)) {
  console.error('Missing LUMA_API_KEY or WEBFLOW_API_TOKEN (set them in .env or the environment).');
  process.exit(1);
}

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'event';

/** Fields Luma owns, shaped for the Events collection. */
const lumaFields = (event) => {
  const fields = {
    'luma-id': event.lumaId,
    'start-date-time': event.startAt,
    'end-date-time': event.endAt,
    'rsvp-link': event.url,
  };
  const location = locationLine(event.address);
  if (location) fields.location = location;
  if (event.latitude != null) fields['latitude-2'] = String(Number(Number(event.latitude).toFixed(6)));
  if (event.longitude != null) fields['longitude-2'] = String(Number(Number(event.longitude).toFixed(6)));
  return fields;
};

const changed = (existing, incoming) =>
  Object.entries(incoming).some(([key, value]) => (existing[key] ?? null) !== (value ?? null));

const run = async () => {
  console.log('Fetching Luma events…');
  const lumaEvents = (await listAllEvents(LUMA_API_KEY)).filter(
    (e) => e.lumaId && !/template/i.test(e.name)
  );
  console.log(`  ${lumaEvents.length} events on the calendar`);

  if (LUMA_ONLY) {
    for (const event of lumaEvents) {
      console.log(`  - ${event.startAt ?? 'no date'}  ${event.name} (${event.lumaId})`);
    }
    console.log('[luma-only] Key works. Add WEBFLOW_API_TOKEN to .env to sync.');
    return;
  }

  console.log('Fetching Webflow Events items…');
  const items = await listItems(WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID);
  const byLumaId = new Map(
    items.filter((i) => i.fieldData['luma-id']).map((i) => [i.fieldData['luma-id'], i])
  );
  const usedSlugs = new Set(items.map((i) => i.fieldData.slug));
  console.log(`  ${items.length} items (${byLumaId.size} linked to Luma)`);

  let created = 0;
  let updated = 0;

  for (const event of lumaEvents) {
    const existing = byLumaId.get(event.lumaId);

    if (!existing) {
      let slug = slugify(event.name);
      while (usedSlugs.has(slug)) slug = `${slug}-${event.lumaId.slice(-4).toLowerCase()}`;
      usedSlugs.add(slug);
      const fieldData = {
        name: event.name,
        slug,
        ...lumaFields(event),
        ...(event.coverUrl ? { image: { url: event.coverUrl } } : {}),
      };
      console.log(`+ create draft: ${event.name} (${event.lumaId})`);
      if (!DRY_RUN) await createItem(WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID, fieldData);
      created += 1;
      continue;
    }

    const incoming = lumaFields(event);
    if (NAME_FOLLOWS_LUMA) incoming.name = event.name;
    if (!changed(existing.fieldData, incoming)) continue;
    console.log(`~ update: ${event.name} (${event.lumaId})`);
    if (DRY_RUN) {
      for (const [key, value] of Object.entries(incoming)) {
        const current = existing.fieldData[key] ?? null;
        if (current !== (value ?? null)) console.log(`    ${key}: ${JSON.stringify(current)} -> ${JSON.stringify(value)}`);
      }
    }
    if (!DRY_RUN) await updateItem(WEBFLOW_API_TOKEN, EVENTS_COLLECTION_ID, existing.id, incoming);
    updated += 1;
  }

  const lumaIds = new Set(lumaEvents.map((e) => e.lumaId));
  for (const [lumaId, item] of byLumaId) {
    if (!lumaIds.has(lumaId)) {
      console.log(`! gone from Luma (left in CMS): ${item.fieldData.name} (${lumaId})`);
    }
  }

  console.log(
    `${DRY_RUN ? '[dry run] ' : ''}Done: ${created} created, ${updated} updated, ${lumaEvents.length} total.`
  );
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
