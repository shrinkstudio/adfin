# Adfin client logos — cleaned export for Adfin Staging

19 client logos exported from the **Adfin** production site, cleaned up locally, ready to load
into the **Adfin Staging** `Logos` CMS collection.

| | |
|---|---|
| Source | Adfin — `663608d6085a91363816e0cb` (workspace `6641de8278cd626c4dbb9cfd`) |
| Destination | Adfin Staging — `6a69cb89a361f85b63b37d60` (workspace `63765059a2b39056142ead15`) |
| Target collection | `Logos` — `6a7f31d75c47c8102580cc9d` |
| Assets | 19 PNGs, 96,907 bytes, all distinct (verified by hash) |

**The Adfin production site was not modified.** Its assets still carry the original
`Client logos-N.png` names and original alt text, misspellings included. Everything cleaned up
here is local.

- `manifest.json` — one entry per logo, keyed to the destination collection's field slugs
- `files/` — the images, renamed to brand slugs, each verified byte-for-byte against source

## Alt text

All 19 wordmarks were visually inspected and alt text set from what the logo actually reads.
`manifest.json` holds final values. Fourteen differed from what Adfin stores — three were
genuine misspellings, the rest casing:

| | Stored in Adfin | Corrected |
|---|---|---|
| misspelling | Emiliy Rose Vass logo | Emily Rose Vass logo |
| misspelling | moore to bookkeping logo | Moore to Bookkeeping logo |
| misspelling | Booeeping logo | More Than Bookkeeping logo |
| casing | thenumbers quarter logo | The Numbers Quarter logo |
| casing | helpbox logo | Helpbox logo |
| casing | 55 financial logo | 55 Financial logo |
| casing | hunts limited logo | Hunts Limited logo |
| casing | the proposers logo | The Proposers logo |
| casing | Level accounting logo | Level Accounting logo |
| casing | Onpoint accounting logo | Onpoint Accounting logo |
| casing | Stem accountants logo | Stem Accountants logo |
| casing | harrisons accountancy logo | Harrisons Accountancy logo |
| casing | accounts & tax made easy logo | Accounts & Tax Made Easy logo |
| casing | Fresh pay logo | Fresh Pay logo |

Unchanged: `Jan McDermott Chartered Accountants`, `NDC`, `KnightsLowe`, `Rixgreen`, `Oppic`.

## Destination collection schema

`Logos` was extended from its original three bare fields to a documented ten. Every field
carries help text; fields are organised into three described groups.

| Group | Field | Slug | Type | Required |
|---|---|---|---|---|
| — | Name | `name` | PlainText | yes |
| — | Slug | `slug` | PlainText | yes |
| Logo Files | Logo | `logo` | Image | yes |
| Logo Files | Logo Inverse | `logo-inverse` | Image | no |
| Logo Files | Alt Text | `alt-text` | PlainText | yes |
| Client Details | Website | `website` | Link | no |
| Client Details | Case Study | `case-study` | Reference → Case Studies | no |
| Client Details | Customer Type | `customer-type` | Option | no |
| Placement | Featured | `featured` | Switch | no |
| Placement | Display Order | `display-order` | Number | no |

## Import — completed 2026-08-14

All 19 logos are in the Adfin Staging `Logos` collection. They are **not** in the asset
library: the library upload was only a staging step to obtain URLs for CMS ingestion, and
those library assets were deleted afterwards. The CMS holds its own independent copies, which
were verified still serving at their exact byte sizes after that deletion.

How it ran, and what to know if it is ever repeated:

1. **Assets** — `asset_tool > upload_image_by_url` needs a live Webflow Designer session and
   was unavailable, so the Data API path was used instead: `create_asset` (with each file's
   MD5 from `md5 -q`) returns a presigned S3 POST, and `upload.sh` in this folder completes it.
   Alt text is a separate `update_asset` call afterwards — `create_asset` does not take it.
2. **Items** — `create_collection_items` on `6a7f31d75c47c8102580cc9d`.

**CMS image fields always re-ingest from a URL.** Passing `fileId` alone is rejected
("Expected value to have a 'url' field"), and passing `fileId` alongside `url` ignores the
fileId. So each item's image is a CMS-side copy, not a reference to the library asset — the
copies are not library assets and do not appear via `get_asset`. Pass
`{"url": ..., "alt": ...}`; the `alt` sets the native image alt and is worth including
alongside the separate `alt-text` field.

Items were created with `isDraft: false` but have never been published — `lastPublished` is
null on all 19. They need a site publish to appear on the staging domain.

## Left deliberately unset

- `customer-type` is filled only where the wordmark states the trade — 9 of 19. The other 10
  would have been guesses.
- `display-order` is null throughout, which the field's help text defines as alphabetical.
- `website`, `case-study`, `logo-inverse`, `featured` are empty for all items.
