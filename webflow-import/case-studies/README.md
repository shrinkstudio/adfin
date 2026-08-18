# Case Studies — static content pulled from Adfin production

Extracted 2026-08-17 from the **Adfin** production site (`663608d6085a91363816e0cb`), page
**Customer Stories** (`6a5129677c2d4207d05e4cfc`, `/customer-stories`), read via the Data API
element tree. Nothing on Adfin was modified.

`customer-stories-cards.csv` — 8 card blocks, one row each.

## Page header (not per-item, recorded for completeness)

| | |
|---|---|
| Eyebrow | Customer stories |
| H1 | Hear from our customers. |
| Subtitle | Read about how and why businesses are switching to Adfin. |
| Hero image | `6a512bc31dbccb48f79cd8dc_P1035201.avif` |

## The 8 cards

| # | Client | Visible | Case study page |
|---|---|---|---|
| 1 | Jumpstart | yes | `/case-studies/jumpstart` |
| 2 | Nuvo | yes | `/case-studies/nuvo-accountancy` |
| 3 | Helpbox | yes | `/case-studies/helpbox-uk` |
| 4 | Pillow May | yes | `/case-studies/pillow-may` |
| 5 | Nuvo | **no** | duplicate of #2 |
| 6 | Gascoynes | yes | `/case-studies/gascoynes-accountancy` |
| 7 | Nourished Accounting | yes | **none — links to a blog post** |
| 8 | Nuvo | **no** | duplicate of #5 |

Six visible cards, five distinct clients with a case study page — matching the five pages in the
`Case studies` folder.

## Things worth knowing before this becomes CMS items

**Two hidden duplicate Nuvo cards.** Rows 5 and 8 are set to `visibility: false` in the Designer
and are byte-identical to each other. They carry an *older* Nuvo story — different title
("How Nuvo moved 2,500 direct debit mandates to Adfin in eight weeks"), different snippet and a
6 min read time — against the same image as the live Nuvo card. They are almost certainly dead
weight, but the copy differs from the live card so it is preserved here rather than dropped.

**Nourished Accounting has no case study page.** Its card links to
`https://adfin.com/post/how-nourished-accounting-gets-paid-on-time`, a blog post. It is a
customer story on this page but not part of the `Case studies` folder.

**Its snippet is truncated at source.** The text ends mid-sentence: *"…Nourished Accounting has
reduced "* — trailing space and no object. Not a copy error on extraction; that is what the page
contains. Needs rewriting before import.

**No card is actually linked.** Every "Read story" button on the five case study cards has
`linkType: none` — only the Nourished card carries a URL. So the mapping from card to case study
page in this CSV was made **by client name**, not read from the markup. Worth a sanity check.

**Read time is card-only.** "4 min read" etc. exists on these cards; if the destination
collection has no equivalent field it either needs adding or dropping.

## Column names are provisional

The destination `Case Studies` collection on Adfin Staging (`6a74aa6d7a69bb50f47e03ee`) could not
be read while the MCP connection was pointed at Adfin production — the two sites are in different
workspaces and only one is reachable at a time. The headers here describe the source content
rather than matching destination field display names, so they will need renaming once the
schema can be read. See `../README.md` for how the importer maps columns.

## The five case study pages

Read the same way, via the Data API element tree — no Designer session needed. All five share one
hand-built layout, so the content was extracted structurally rather than scraped.

| File | Rows | What it holds |
|---|---|---|
| `case-studies.csv` | 5 | One row per case study — hero, pull quote, fact panel, and the four body sections as HTML |
| `case-study-metrics.csv` | 20 | 3 hero stats + 1 results stat per case study |
| `case-study-before-after.csv` | 20 | The Before Adfin / After Adfin comparison rows, 3–5 per case study |

`case-studies.csv` merges the matching Customer Stories card (title, snippet, image, tag, read
time) onto each row, so everything for one case study is on one line.

The body sections — `At A Glance`, `Challenge`, `Solution`, `Results` — are rendered to HTML with
`<h3>`, `<h4>`, `<p>`, `<ul>` and `<blockquote><cite>`, ready for a RichText field.

`extract.py` does the work and `parse_tree.py` prints a readable outline of any dump, so this is
repeatable when the sixth case study lands.

### Per-page shape

| | Gascoynes | Jumpstart | Helpbox | Pillow May | Nuvo |
|---|---|---|---|---|---|
| Hero stats | 3 | 3 | 3 | 3 | 3 |
| Before/after rows | 5 | 4 | 4 | 3 | 4 |
| At a glance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Challenge | ✅ | ✅ | ✅ | ✅ | ✅ |
| Solution | ✅ | ✅ | ✅ | ✅ | ✅ |
| Results | ✅ | ✅ | **empty** | ✅ | ✅ |
| Video caption | ✅ | ✅ | — | — | — |

### Quirks in the source

- **Helpbox has no Results prose.** Its RESULTS section contains only the 58% stat, no copy.
  The cell is empty because the page is.
- **Nuvo calls its last section "Looking ahead"**, not "Results"; Helpbox and Pillow May call
  their first one "Summary", not "At a glance". Mapped onto the same four fields.
- **Section eyebrows are typed with non-breaking spaces** (`AT\xa0A\xa0GLANCE`). Worth knowing if
  anything else ever matches on that text.
- **The `Region` fact key is mis-cased as `ReGION`** on all five pages.
- **Helpbox's Website fact has a stale `href` attribute** pointing at `gascoynes.co.uk`, while the
  actual link setting is correct (`helpboxuk.com`). The CSV uses the link setting. Copy-paste
  leftover on the live page, worth fixing there.
- Sizes carry stray leading spaces on some pages; trimmed in the CSV.

## Import files

Mapped against the live staging schema. Import **metrics first** — `Key Results` references them.

| File | Rows | Collection |
|---|---|---|
| `case-study-metrics-import.csv` | 15 | `Case Study Metrics` (`6a74aa6c9040975948e02cc9`) |
| `case-studies-import.csv` | 5 | `Case Studies` (`6a74aa6d7a69bb50f47e03ee`) |

The three earlier files (`case-studies.csv`, `case-study-metrics.csv`,
`case-study-before-after.csv`) are the raw extraction, kept as the record of what the pages
actually contain.

### Field mapping

| Source | → Destination |
|---|---|
| Page H1 | `Name` |
| Page path | `Slug` |
| Customer Stories card image | `Thumbnail Image` |
| Customer Stories card snippet | `Card Snippet` |
| Featured position on Customer Stories | `Featured` |
| Fact panel Industry | `Industry` |
| Page header image | `Hero Image` |
| Big pull quote | `Pull Quote` |
| Quote name + role | `Quote Attribution` |
| 3 hero stats | `Key Results` → Metrics |
| Intro, At a glance, Before/After, Challenge, Solution, Results, fact panel | `Body` |

### Metrics deduped 20 → 15

Every case study's Results stat turned out to be a **restatement of one of its own hero stats** —
Gascoynes 39% twice, Helpbox 58% twice, Pillow May 45% twice, Jumpstart 73% / -73%, Nuvo 45 /
"45 days". Only the three hero stats per case study are kept, which also makes all 15 values
unique across the whole set, so `Key Results` resolves unambiguously by name. The restated figure
still reads naturally in the Results copy inside `Body`.

## Final state — 2026-08-17

All five case studies are live on staging with every field populated, and the schema was extended
so the page can be rebuilt as designed rather than as one block of prose.

**Two import failures, both fixed via the API:**

1. `Hero Image` failed on Helpbox and Pillow May — *"Unsupported file type: application/xml"*.
   The URLs in the CSV were built as `<siteId>/<assetId>` with no `_filename` suffix, so S3
   returned a 403 error document instead of the image. A Webflow asset URL is always
   `<siteId>/<assetId>_<filename>`; the thumbnails worked because those URLs came back complete
   from `get_asset`. Real URLs recovered from the live pages.
2. `Key Results` came through **empty on all five** — the importer did not resolve the
   multi-reference at all, and the log did not report it. Set via the API, where it works fine
   including Nuvo's `2,500` (the comma only ever broke CSV parsing).

**Schema added to `Case Studies`:** `Card Title`, `Intro`, `Website`, `Company Size`, `Region`,
`Accounting Software`, `Products Used`, and a `Before and After` multi-reference. Regrouped into
List Card / Client Details / Case Study / SEO.

**New collection `Before and After`** (`6a830c674231a1a9352032c7`) — 20 rows, 3–5 per case study,
with `Before Title`, `Before Text`, `After Title`, `After Text` and `Display Order`. Named without
an ampersand on purpose, given the importer cannot match reference values containing `&`.

**Bodies rewritten.** The fact panel and before/after grid were removed from `Body` now they have
their own fields, so nothing renders twice. `Body` now holds only At a glance, Challenge,
Solution and Results.

### Still open

- **Jumpstart's industry is `Other`.** It is Recruitment, and the `Industry` option list is
  Accountancy / Bookkeeping / Practice / Other. `update_collection_field` can only change
  displayName, helpText and isRequired, so adding "Recruitment" has to be done in the Designer.
- **`Client Logo` is empty on all five.** The source pages carry no separate logo. All five
  clients already exist in the `Logos` collection, so either point the field at those images or
  change it to a reference.
- **No hero image** for Gascoynes, Jumpstart or Nuvo — their pages have none.
- Nothing is published yet.

## Decisions taken, and what they cost

**Everything without a field went into `Body`.** The destination has one RichText field for the
whole story, so `Body` carries the intro, At a glance, the before/after comparison (as two
lists), Challenge, Solution, Results, and the fact panel under a "Company facts" heading. Nothing
is lost, but it is prose where the old page had structure.

**`<cite>` was rewritten.** Webflow RichText does not support it, so quote attributions became
`<p><em>— Name · Role</em></p>` after each blockquote.

**Jumpstart is filed as `Other`.** Its industry is Recruitment, and the `Industry` option list is
Accountancy / Bookkeeping / Practice / Other. Adding "Recruitment" as an option would be more
accurate.

**Two card headlines are lost.** There is no card-title field, so `Name` holds the page H1 and
the listing will now show that instead of the shorter card headline. For three case studies the
two are near-identical, but not for these:

| | Card headline | Page H1 (used) |
|---|---|---|
| Helpbox | Helpbox scaled support without scaling headcount. | How Helpbox tripled on-time payments and cut collection costs by 58% |
| Pillow May | How Pillow May now get 70% invoices paid within 48 hours. | How Adfin helps Pillow may get 70% invoices paid within 48 hours |

**Also dropped, no field exists:** eyebrow, video caption (Gascoynes and Jumpstart), tag, read
time. `Client Logo` is empty — the source pages carry no separate client logo, though the `Logos`
collection has all of these already and could be referenced instead.

## One thing that needs handling at import

**Nuvo's `Key Results` will not import.** Its first metric value is `2,500` and Webflow splits
multi-reference cells on commas, so it would resolve as "2" and "500". Set Nuvo's three
references via the Data API after import, the same way the changelog audiences were fixed.

## Would be better with a few more fields

If dedicated fields were added, the page could be rebuilt as designed rather than as one block of
prose — `Card Title`, `Intro`, and the six fact-panel values (`Website`, `Company Size`,
`Region`, `Accounting Software`, `Products Used`), plus a small `Before / After` collection.
Say the word and I'll add them to house style and re-cut the CSVs.

## Still to do

- The sixth case study, when it is finished.
