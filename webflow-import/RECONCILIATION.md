# Reconciliation — handoff doc vs. what was actually delivered

Checked 2026-08-18 against `adfin_cms_import_handoff.md` (Shrink: Ben + Claude).

**Caveat on method:** the Webflow MCP is currently pointed at **Adfin production**
(`663608d6085a91363816e0cb`). Adfin Staging is in a different workspace and only one is
reachable at a time, so staging's live schema could not be re-read. Everything below is
reconciled against the production site (read live today), the seven source exports, and the
local import records. Staging was reconnected and re-checked on 2026-08-18; items previously marked [VERIFY] are now
resolved and marked as such.

---

## 1. Findings on staging

### 1.1 Blog Topic — verified clean, all 99 correct ✅

Checked against staging 2026-08-18. Every post has a topic, and the distribution matches
`blogs.csv` exactly:

| Topic | Posts |
|---|---|
| Products & Tips | 47 |
| Life at Adfin | 21 |
| Success Stories | 20 |
| Insights | 11 |
| **No topic** | **0** |

**This disproves the "ampersand breaks references" rule** that had been recorded from earlier in
this migration. `Products & Tips` is a single `Reference` containing an ampersand and it resolved
correctly on all 47 posts. The corrected rule:

| Field type | Behaviour on CSV import | Evidence |
|---|---|---|
| `Reference` (single) | **Imports fine, ampersands included** | 47/47 `Products & Tips`; 98/99 authors |
| `MultiReference` | **Never imports — silently, no error in the log** | 0/125 changelog `audiences`; 0/5 case study `key-results` |

So the changelog audiences failure was never about the `&` in `Accountants & Bookkeepers` — it was
the MultiReference type, which matches what the handoff doc says independently and what the empty
`key-results` showed. Both were repaired via the Data API.

One genuine outlier remains: the `series-a` post imported with **no author**, where the cell read
`Tom Pope & Ciprian Diaconasu` and the Authors item is named exactly that. On the same row the
`blog-topic` cell matched fine, both cells are unquoted and identically formed in the file, and
both target collections predate the import. No cause found; n=1 out of 99, and it was set via the
API at the time. Treat it as a one-off, not a rule.

**Practical takeaway for future imports:** single references are safe as-is; every MultiReference
needs an API pass afterwards, and the import log will not tell you it was skipped.

### 1.2 SEO/AEO group is unpopulated almost everywhere

The doc specifies `meta-title`, `meta-description`, `og-title`, `og-description`, `og-image`,
`ai-summary` on every collection except the small taxonomy ones. Actual state:

| Collection | Items | SEO populated |
|---|---|---|
| Blogs | 99 | none |
| Events | 10 | none |
| Open Positions | 10 | none |
| Changelogs | 125 | `meta-title` + `meta-description` only |
| Case Studies | 5 | `meta-title` + `meta-description` only |

`ai-summary` (the 40–60 word answer-engine summary) is populated on **nothing**. Note the source
export has no SEO data to carry across — only 1 of 127 changelogs had an `SEO Title` — so this is
net-new copywriting, not a migration step. Needs owning by someone.

### 1.3 `card-summary` and `article-summary` hold identical text on all 99 blogs

The old site had a single `Summary` field. It was written into both destination fields, so the
listing-card text and the article summary are byte-identical on every post. Fine as a default,
wrong if the two were designed to differ.

### 1.4 Multi-reference fields never populated

| Collection | Field | State |
|---|---|---|
| Blogs | `related-articles` | never captured — no source data |
| Case Studies | `related-case-studies` | never captured |
| Case Studies | `key-results` | **set via API** ✅ |
| Changelogs | `audiences` | **repaired via API** ✅ |

`related-articles` / `related-case-studies` have no equivalent on the old site. They need
authoring, or driving off Blog Topic / Industry in the template instead.

### 1.5 Field display-name check — resolved ✅

The Blogs field with slug `card-summary` has the **display name "Card Snippet"**, so the header
used in `blogs.csv` matched correctly and the column landed. The doc lists slugs, the CSVs use
display names; on this field they simply differ. No action.

---

## 1.6 Read Time added to Blogs — 2026-08-18

New field on `Blogs`: **`read-time`**, type **Number**, display name "Read Time". Number rather
than text ("4 min read") so the value can be sorted and filtered on, and the wording lives in the
template instead of in 99 items. Populated on all 99 posts; 0 left empty.

Calculated from `post-body`: strip tags, decode entities, count whitespace-separated words, then
`ceil(words / 200)` with a floor of 1. 200 wpm is the usual convention for this.

Resulting spread — 180 to 1,691 words, median 752:

| Minutes | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Posts | 1 | 13 | 26 | 19 | 12 | 9 | 6 | 11 | 2 |

Note this field is **not** in the handoff doc's schema — add it there. Case Studies still has no
equivalent, though the old Customer Stories cards carried a read time; worth adding if that design
element survives.

Changes are staged, not published.

---

## 2. Schema on staging that the doc doesn't know about

The doc says its snapshot is "pulled live from the staging site on 2026-08-17" and instructs
*"Your job is content → CSV, not schema changes. Do not add or rename fields."*

The snapshot was taken **between roughly 09:30 and 13:28 that day**. It includes the Audiences,
Changelogs and Open Positions collections (built that morning) but not the afternoon work, which
Greg explicitly asked for. So staging currently has **19 collections, not 18**:

**New collection — `Before and After` (`6a830c674231a1a9352032c7`), 20 items.**
Fields: `before-title`, `before-text`, `after-title`, `after-text`, `display-order`. Named without
an ampersand deliberately, given §1.1. Holds the Before Adfin / After Adfin comparison rows, 3–5
per case study.

**Eight fields added to `Case Studies`:** `card-title`, `intro`, `website`, `company-size`,
`region`, `accounting-software`, `products-used`, and `before-and-after` (MultiReference).
Regrouped into List Card / Client Details / Case Study / SEO.

Reason: without these, the whole case study page collapses into one RichText blob and the two
shorter card headlines are lost. All five items are populated and the bodies were rewritten so
nothing renders twice.

**This needs a decision between you and Ben** — keep them and update the doc, or roll back and
accept prose-only case study pages. Recommend keeping; the doc's instruction predates the request.

---

## 3. Deliverable format — three gaps against §2 and §5 of the doc

### 3.1 `_source_url` — added and verified against live ✅

Added to `blogs.csv`, `changelogs.csv`, `events.csv`, `open-positions.csv` and
`case-studies-import.csv` as the last column. **Every one of the 239 candidate URLs was requested
against the live site** rather than assumed, and the column holds a URL only where the page
actually resolves (HTTP 200). Where nothing is live the cell is deliberately **blank** — there is
no page to redirect.

| File | Rows | Live URL | Blank |
|---|---|---|---|
| `blogs.csv` | 99 | 85 | 14 |
| `changelogs.csv` | 125 | 121 | 4 |
| `open-positions.csv` | 10 | 4 | 6 |
| `case-studies-import.csv` | 5 | 5 | 0 |
| `events.csv` | 10 | 0 | **10** |

Two things the live check turned up that assumption would have missed:

**Events have no individual pages.** `/events` is a static listing page (200), but
`/event/{slug}` and `/events/{slug}` both 404 for every item — the collection has no published
template. Each event links out to Luma via `rsvp-link` instead. So there is nothing to redirect
for events, and all 10 cells are blank. Their content came from the `/events` listing.

**Draft state does not predict liveness.** 24 items 404, but they are not the same 24 the source
export flags as Draft — five draft-flagged items are still live. That's why every URL was tested
individually.

### 3.1b `redirect-map.csv` — new

Generated alongside, since building the map is the point of the column. 215 rows, one per live
page, with `source_url`, `old_path`, `new_path`, `status`. Destination paths use the **actual**
staging collection slugs, read from the site rather than inferred from this doc:

| Old | New | Rows | |
|---|---|---|---|
| `/post/*` | `/blog/*` | 85 | moves |
| `/open-positions/*` | `/careers/*` | 4 | moves |
| `/changelog/*` | `/changelog/*` | 121 | unchanged |
| `/case-studies/*` | `/case-studies/*` | 5 | unchanged |

89 paths move, 126 stay put. Slugs were verified identical between the live site and staging for
all five collections before the map was built, so every destination resolves once staging is live.

### 3.2 Headers are display names, not field slugs

The doc asks for field slugs. All CSVs use **display names**, because that's what Webflow's native
importer matches on in its mapping UI — and the imports succeeded. Not a defect, but if Shrink
re-runs anything from these files, that's why.

### 3.3 Multi-reference cells are comma-separated, not pipe-separated

The doc asks for pipe. Commas were used — e.g. Key Results as `10%, 8%, 39%`. This is exactly what
broke Nuvo's `2,500` metric, which Webflow split into "2" and "500". Pipe would have avoided it.

---

## 4. Where the doc is out of date

- **Migration is largely done.** The doc reads as though nothing has been imported. Actually live
  on staging: Blogs 99, Authors 18, Blog Topics 4, Events 10, Changelogs 125, Open Positions 10,
  Audiences 4, Logos 19, Case Studies 5, Case Study Metrics 15, Before and After 20.
- **19 collections, not 18** — see §2.
- **Integrations, FAQs and Competitor Comparisons already exist as collections on production**
  (created 2026-02-27, slugs `integration-pages`, `faqs`, `comparisons`) but are **completely
  empty**. So the doc's plan to scrape those from static pages stands — just don't expect to find
  exportable CMS data behind them.

### Not in the doc at all: the Referrals collection

Production has **`Referrals` (`682b110c7340f3849ff37be9`, slug `referral`) with 5,225 items**, and
it is actively being written to — three new items were created this morning. Each holds a
`unique-sign-up-link` to `console.adfin.com`, keyed to a `billerid` and `userid`.

This is a live system, not legacy content. It has no counterpart in the 18-collection staging
schema. **If the rebuild goes live without it, 5,225 referral URLs break.** Needs raising with
Shrink — whether it's in scope, and whatever writes to it needs repointing.

Also unlisted, lower stakes: `Menu Dropdown – Resources` (1 item) and
`Menu Dropdown - Integrations` — navigation helper collections, presumably rebuilt by hand.

---

## 5. Gaps that are source-side, not migration defects

Nothing to fix in the CSVs — the data does not exist on the old site.

| Field | Situation |
|---|---|
| Authors `author-role` | export has name + image only; empty on all 18 |
| Events `latitude-2` / `longitude-2` | not in the export |
| Events `book-a-call-link` | not in the export |
| Events `description` | blank on 3 of 10 at source; `short-description` blank on 2 |
| Changelogs `walkthrough-video` | **0 of 127** have a `Youtube Video URL` — the field can stay empty |
| Case Studies `client-logo` | source pages carry no separate logo; all 5 clients exist in `Logos` |
| Case Studies `hero-image` | Gascoynes, Jumpstart and Nuvo have none on their pages |

Two source rows were deliberately dropped from the changelog import: slugs `lre` and `test`
(127 → 125). One imported changelog, `transactionsdashboard`, is lorem ipsum on the live site.

---

## 6. Still open from earlier, unchanged

- **Jumpstart's `industry` is `Other`** — it's Recruitment. The option list is Accountancy /
  Bookkeeping / Practice / Other, and `update_collection_field` can't add options. Needs the
  Designer.
- Alt text is null on every ingested image.
- Two new Blog Topics (`life-at-adfin`, `success-stories`) need tag colours.
- Nothing is published on staging.
- The 6th case study, when it's finished.

## 7. Not started — matches the doc's list

Downloads, Download Success, Legal, Competitor Comparisons, Integrations, FAQs, Testimonials,
Customers. All need scraping from live static pages.

---

## 8. Page metadata port — 2026-08-18

All 94 live page records exported to `page-metadata/` (see that folder's README for the full
picture). SEO and Open Graph applied to 9 staging static pages and all 5 Case Studies items.
Nothing on the live site was changed; no page title or slug was changed on staging.

**Two API limits Shrink should know about before planning any more of this through MCP:**

1. `bulk_update_pages` and `bulk_update_pages_schema_markup` both return **403
   `insufficient_permissions`** on this token. Single-page `update_page_settings` works.
2. `update_page_settings` **accepts `jsonLdSchema` and silently discards it** — success response,
   nothing stored. Confirmed by reading the page back. So JSON-LD cannot be ported through the API
   at all right now; it needs pasting in the Designer.

**Structured data on live is thinner than expected** — only 6 of 94 pages have any, and two of
those are wrong (Jumpstart and Nuvo both carry Gascoynes' Article schema, pointing at a dead
canonical URL). Neither was ported. See `page-metadata/README.md`.

**`redirect-map.csv` grew from 215 to 225 rows** with page-level entries. The blog and events
*listings* move under `/resources/`, which the earlier item-level map did not cover:

| Old | New |
|---|---|
| `/blog` | `/resources/blog` |
| `/events` | `/resources/events` |
| `/blog/insights`, `/blog/success-stories`, `/blog/life-at-adfin`, `/blog/product-and-tips` | `/resources/blog` |
| `/integration-pages` | `/integrations` |

Three old URLs have **no destination on staging** and need a decision: `/careers`, `/changelog`
and `/faq`. Staging has the CMS item template at each of those paths but no equivalent landing
page, so those URLs currently have nowhere to point.
