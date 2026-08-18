# Adfin → Adfin Staging CMS import

Transformed CSVs for Webflow's native CMS importer, generated from the seven exports taken off
the old Adfin production site.

| | |
|---|---|
| Destination | Adfin Staging — `6a69cb89a361f85b63b37d60` |
| Generated | 2026-08-17 |
| Source exports | `~/Downloads/Adfin - *.csv` |

Collection and reference IDs are in `ids.json`. The old Adfin production site was **not**
modified — every transformation here is local.

## Already imported via the API

These are done; no CSV needed.

| Collection | Items | Note |
|---|---|---|
| `Authors` | 18 | Avatars re-ingested from the old CDN. `Author Role` is empty — not in the export. |
| `Blog Topics` | 4 | Two existing items had their slugs realigned to the export; two were added. |
| `Audiences` | 4 | New collection, built from the `Categories` export. |

## Files to import

Import **in this order** — blogs and changelogs reference items that must already exist.

| File | Collection | Rows |
|---|---|---|
| `events.csv` | Events | 10 |
| `open-positions.csv` | Open Positions | 10 |
| `changelogs.csv` | Changelogs | 125 |
| `blogs.csv` | Blogs | 99 |

Column headers are the exact field **display names** in each collection, so Webflow's importer
auto-maps every column. Nothing should need mapping by hand.

### How Webflow matches reference fields

The importer resolves Reference and MultiReference columns against the **Name** of items in the
referenced collection, not their slug. So:

- `blogs.csv` → `Author` holds author names (`Sam Jennings`), not `sam-jennings`
- `blogs.csv` → `Blog Topic` holds topic names (`Products & Tips`), not `product-tips`
- `changelogs.csv` → `Audiences` holds comma-separated names (`Accountants & Bookkeepers, Business, Lawyers`)

All 99 blog posts resolved to a known author and topic, and every changelog audience resolved.
If the importer still reports an unmatched reference, the referenced collection was not imported
first.

## What was transformed

**Blog bodies were rewritten.** 16 posts contained 36 `<img>` tags pointing at the old Adfin
production CDN. Those images were re-hosted into the Adfin Staging asset library and every URL
in `blogs.csv` points at the new copy — verified zero remaining references to
`663944fa0339e7ff8f65838d` in the post bodies. The originals and the URL map live in
`../webflow-assets/blog-body-images/`.

> **Correction, after the import ran.** The CSV importer re-ingests images inside rich text as
> well as in Image fields — it pulled all 36 into the CMS bucket and rewrote the URLs a second
> time. The **Data API does not do this**; it stores rich text verbatim, which is what the
> re-hosting step was built for. On the CSV path the manual re-host was therefore unnecessary.
> The 35 library copies were deleted on 2026-08-17, after confirming nothing referenced them;
> all 36 body images were re-checked afterwards and still serve. Keep the re-hosting approach
> for any Data API migration.

**`Summary` was written to two fields.** The export has one summary per post; `Blogs` has both
`Card Snippet` and `Article Summary`. Both columns carry the same value. Twenty of them exceed
256 characters, so trim if either field is rendered somewhere tight.

**Open Positions was restructured.** `Position Type` conflated two things and has been split:

| Export value | Employment Type | Work Arrangement |
|---|---|---|
| `Hybrid` | *(empty)* | Hybrid |
| `Full time` / `Full Time` | Full Time | *(empty)* |
| `Full Time (Hybrid)` | Full Time | Hybrid |
| `Full Time (In office)` | Full Time | In Office |

Empty means the export did not state it. The four question-style field names became
`The Role`, `About You`, `Hiring Process` and `The Offer`. Locations were normalised to
`City, Country` — `London` → `London, UK`, `Amsterdam` → `Amsterdam, Netherlands`.

**Event Type was read off the title** where the title states it — 6 "Tea Party" events and 1
"Dinner". The other 3 are blank rather than guessed.

**Two junk changelog rows were dropped**: `Test` (lorem ipsum) and `Lre]]` (empty, no category,
no date). The other 125 are all present.

## Import outcome — 2026-08-17

| Collection | Expected | Landed | |
|---|---|---|---|
| Events | 10 | 10 | ✅ |
| Open Positions | 10 | 10 | ✅ |
| Blogs | 99 | 99 | ✅ |
| Changelogs | 125 | 125 | ✅ |

Verified on the imported blogs: 99/99 topics resolved and the topic spread matches the export
exactly, 99/99 publish dates, 13/13 featured flags, 82 hero images and 98 thumbnails (matching
the 17 and 1 the export was missing), no duplicate slugs, and no bodies left pointing at the old
CDN.

**The importer cannot match reference values containing an ampersand.** Confirmed twice:

- `Tom Pope & Ciprian Diaconasu` — the only author name with an `&` — came through empty on the
  `series-a` post. Every other author matched.
- `Accountants & Bookkeepers` is the audience on 124 of the 125 changelog rows, and **all 125
  changelogs imported with no audience at all**.

Both were repaired afterwards via the Data API, which matches on item ID and has no such problem.
If these CSVs are ever re-imported, expect to repair the reference columns again — or rename the
two offending items to use "and" instead of "&".

## Draft and archived state — applied

Webflow's CSV importer cannot set per-item draft or archived state; everything lands live.
The states in `post-import-state.csv` were applied via the API afterwards:

| Collection | Applied |
|---|---|
| Blogs | 18 draft, of which 2 also archived ✅ |
| Open Positions | 6 draft ✅ |
| Events | 8 draft ✅ |
| Changelogs | 5 draft ✅ |

The 8 draft events are the ones already in the past; the two live ones are September 2026.
Nothing had been published at the time, so this had no effect on the live site.

## Known gaps, deliberate

- `Blog Topics` — `Life at Adfin` and `Success Stories` have no tag or text colour. The export
  carried none and the other two topics use brand hexes, so these need setting by hand.
- `Authors` — `Author Role` is empty on all 18. Not present in the export.
- `Events` — `Latitude`, `Longitude` and `Book a Call Link` are empty. Not present in the export,
  so map pins will not render until they are filled.
- `Changelogs` — `Meta Title` and `Meta Description` were only filled on 1 of 127 rows upstream.
  `Walkthrough Video` is empty on every row.
- Image filenames carry a doubled ID prefix (`<newid>_<oldid>_name.png`). This is structural:
  Webflow prepends its own asset ID to whatever basename the source URL has, and the source URLs
  already carry the old site's ID. Cosmetic only.
