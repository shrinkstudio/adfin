# Adfin Content Sync

Mirrors Adfin's external content into the Webflow CMS. First sync: **Luma events → Events collection** on ss-adfin-staging.

## Ownership contract

- **Luma owns**: name, start/end date-times, location, lat/long, RSVP link, Luma ID.
- **Editors own** (never touched by sync): Event Type, Short Description, Image (seeded once from the Luma cover, then hands off), Book a Call Link, all SEO fields, slug, publish state.
- New events land as **drafts**, curated and published in the Webflow Editor.
- Events removed from Luma are left in the CMS and flagged in the sync log only.

## Run

```bash
cp .env.example .env   # fill in LUMA_API_KEY and WEBFLOW_API_TOKEN
npm run sync:events:dry   # see what would happen
npm run sync:events
```

Node 22+, zero dependencies.

## Next steps

- Move the sync core into a Webflow Cloud app route (`/api/sync`, Cloudflare Access in front) in Adfin's workspace, with this repo's `src/` as the shared module.
- Scheduling: launchd/GitHub Actions cron hitting the script until the Cloud route exists (Webflow Cloud has no native cron).
- Wistia (video + webinars) sync joins as `sync-media.js` once the plan tier is confirmed.
