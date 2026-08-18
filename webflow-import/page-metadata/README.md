# Page metadata — Adfin production

Pulled from the live Adfin site (`663608d6085a91363816e0cb`) on 2026-08-18 via the Data API.
`page-metadata.csv` holds all **94 pages**, one row each.

## Columns

`published_path` · `title` · `slug` · `page_type` · `destination` · `draft` · `archived` ·
`seo_title` · `seo_description` · `og_title` · `og_description` · `og_title_copies_seo` ·
`og_description_copies_seo` · `og_image_url` · `json_ld` · `page_id` · `collection_id`

## Read this before porting

**Open Graph titles and descriptions are empty on all 94 pages — and that is correct.** Every page
has `titleCopied` / `descriptionCopied` set true, so Webflow mirrors the SEO title and description
into OG at render time. Port the **flags**, not the values. If you copy the blank `og_title` cells
across as literal values you will strip social previews site-wide.

**Only 4 distinct OG images across 77 pages**, already resolved to absolute URLs in the CSV:

| Asset | Pages | File |
|---|---|---|
| `6a0adb5e…` | 65 | Open Graph 1.png — the site default |
| `6840567b…` | 7 | opengraphs.png |
| `6a021e1e…` | 4 | image (1).png |
| `68a22f4a…` | 1 | Group 2087327333 (2).png |

17 pages have no OG image at all.

**JSON-LD exists on only 6 pages**, and two of them are wrong:

| Page | Schema |
|---|---|
| `/` | `SoftwareApplication` — correct, port verbatim. See `homepage-jsonld.json`. |
| `/case-studies/gascoynes-accountancy` | `Article` — correct |
| `/case-studies/helpbox-uk` | `Article` — correct |
| `/case-studies/pillow-may` | `Article` — correct |
| `/case-studies/jumpstart` | `Article` — **wrong: holds Gascoynes' headline, description and canonical URL** |
| `/case-studies/nuvo-accountancy` | `Article` — **wrong: same Gascoynes content** |

Both broken pages declare `url` and `mainEntityOfPage` as
`https://adfin.com/customer-stories-gascoynes`, so search engines are being told two case studies
are a third one that lives at a path which no longer exists.

Do **not** port these five per-page. Build one `Article` template on the Case Studies collection
template page, bound to the CMS fields — that produces correct markup for all five (and the sixth
when it lands) and removes the copy-paste failure mode that caused this.

## Static → dynamic

Where `destination` says `CMS item -> X`, the page-level SEO must land in the **CMS item's** SEO
fields (`meta-title`, `meta-description`, `og-*`), not on a page. Where `page_type` is
`CMS template`, SEO is set once on the template with dynamic field bindings.

| Destination | Pages |
|---|---|
| Stays static | 18 |
| CMS item → Legal | 8 |
| CMS item → Customers | 7 |
| CMS item → Integrations | 7 |
| CMS item → Case Studies | 5 |
| CMS item → Competitor Comparisons | 4 |
| CMS item → Downloads / Download Success | 2 + 2 |
| NOT MIGRATED (301 to filtered /blog) | 4 |
| System pages | 3 |
| CMS template pages | 13 |
| **Needs a decision** | **24** |

## The 24 that need a decision

Grouped by what they look like. None of these map cleanly onto the collections in the handoff doc.

**Event landing pages (9)** — `/accountex-london-2026` plus four `-meet-{name}` variants,
`/avn-webinar-call`, `/fineo-roundtable-book-call`, `/tea-party`, `/leeds`. These are bespoke
per-event pages, richer than an Events CMS item. Either they become Events items and lose layout,
or they stay static.

**Campaign and partner pages (7)** — `/abc`, `/abc-club`, `/back-to-school`, `/icb-accreditation`,
`/engager-users`, `/developer-tooling`, `/outsourced-credit-control`. Some are arguably Customers
items; `/developer-tooling` and `/outsourced-credit-control` read more like product pages.

**Commercial (3)** — `/accountant-referral-corey`, `/scaling-businesses-demo`,
`/learn-about-adfin`. Probably static alongside `/book-demo`.

**Other (5)** — `/services` (titled `[Legal] Services`, so possibly Legal), `/home-old` (retired),
the two menu-dropdown nav helper templates, and `/referral`.

## Flags worth acting on

**The team's own markers are in the page titles.** Five are prefixed `*FIX` and one `*KILL`:

| Page | Title |
|---|---|
| `/leeds` | `*KILL [Events] Leeds` |
| `/accountant-referral-corey` | `*FIX [Commercial] Accountant Referral Corey` |
| `/accountex-london-2026` | `*FIX Accountex London 2026` |
| `/accountex-london-2026-meet-andy` | `*FIX Accountex London 2026 - Andy` |
| `/accountex-london-2026-meet-corey` | `*FIX Accountex London 2026 - Corey` |
| `/accountex-london-2026-meet-freddie` | `*FIX Accountex London 2026 - Freddie` |
| `/accountex-london-meet-tamara` | `*FIX Accountex London 2026 - Tamara` |

`*KILL` suggests `/leeds` should simply be dropped. Confirm before porting any of these.

**17 pages are drafts** and are not live: `/abc`, `/accountant-referral-corey`, the four
`accountex…meet-*` pages, `/back-to-school`, `/developer-tooling`, `/engager-users`, `/home-old`,
`/integrations/actionstep`, `/integrations/freeagent`, `/leeds`, `/legal-firms`,
`/outsourced-credit-control`, `/platforms`, `/style-guide`.

Two of those matter: **`/platforms` and `/legal-firms` are draft**, yet both are referenced as
`linked-page` by live Audiences items (`/platforms`, `/legal-firms`). And `/integrations/actionstep`
and `/integrations/freeagent` are draft Integrations pages — decide whether they migrate.

**18 pages have no meta description**, and 6 have no SEO title (`/authors`,
`/blog-post-categories`, `/category`, `/comparisons`, and the two menu-dropdown templates — all
CMS templates, so expected).

## Two pages share `/changelog`

`6722e686f7fc78abf431533a` (static listing) and `6722dcefed289f6f784e5ed8` (the Changelogs
collection template) both report `publishedPath` `/changelog`. Not an error — the listing and the
item template sit at the same prefix — but worth knowing when building redirects.

---

## What was applied to staging — 2026-08-18

Production was read only; nothing on it was changed. On staging, no page title or slug was touched.

**SEO + Open Graph written to 9 static pages.** `/` · `/pricing` · `/credit-control` ·
`/accept-payments` · `/customer-stories` · `/resources/blog` · `/resources/events` · `/404` ·
`/401`. Both OG copy flags set true to match production's behaviour, and the OG image URL set
where production had one (`/customer-stories`, `/404` and `/401` had none).

**SEO + OG written to all 5 Case Studies CMS items** — `meta-title`, `meta-description`,
`og-title`, `og-description`, `og-image`. Webflow re-ingested the OG image into the staging CDN.

Note on `og-title` / `og-description`: on production these are blank because the page-level "copy
from SEO" flags are on, so production *renders* og:title as the SEO title. CMS items have no such
flag — the fields are literal. They were set to the same strings the production pages emit, so the
rendered output matches. Nothing was invented.

`ai-summary` was left empty on all five. Production has no equivalent.

### JSON-LD could not be written — API permissions

Both `bulk_update_pages_schema_markup` and `bulk_update_pages` return
**403 `insufficient_permissions`** on this token. Single-page `update_page_settings` works for SEO
and OG, but silently ignores `jsonLdSchema` — it returns success and stores nothing (verified by
reading the page back: still null).

**The homepage schema therefore still needs pasting in by hand.** It is in
`homepage-jsonld.json`, ready to paste into Page Settings on staging's Home page. One thing to
decide first: `provider.logo.url` points at the **production** CDN
(`cdn.prod.website-files.com/663608d6…`). Ported verbatim as instructed, but it means the new site
would reference the old site's asset. Worth re-pointing at a staging asset once one exists.

### Case study schema — deliberately not ported

The three correct ones (Gascoynes, Helpbox, Pillow May) were not copied across, because per-item
JSON-LD is not settable through the API and pasting one static blob onto the Case Studies template
would apply the same markup to all five items.

The two broken ones (Jumpstart, Nuvo) were not ported at all. They contain Gascoynes' headline,
description and canonical URL. Porting them verbatim would carry known-wrong structured data onto
the new site; correcting them would mean writing schema that does not exist on production. Neither
is mine to choose — flagging instead.

**Recommendation:** build one `Article` template on the Case Studies template page with the fields
bound to CMS values. That produces correct markup for all five, and for the sixth when it lands.
The three correct production schemas are the reference for which properties to include.
