# Nav rebuild plan

Status: Figma signed off (AB Handshake pattern, text styles applied by Ben). Nav Links CMS seeded as drafts. Next: bundle (step 3). The panel follows the **AB Handshake nav** (Ben, 29 Oct: keep it simple): plain links with a 24px outlined icon tile, title and optional one-line description, group columns with mono labels, a ruled right column, and a mobile accordion. Names follow `LUMOS.md`, and all signed-off links stay exactly as live.

## 1. Letting the client edit the nav

### What exists today

- **The live nav is fully static:** 12 dropdowns and 0 Collection Lists.
- **Integrations** (`6a74ab207dea62235e48ec24`):
  - Fields: name, logo, short-description, internal-link (`/partners/*`), featured, category.
  - Items: all 5 have a logo. Sodium is published; Xero, Socket, Engager and Quickbooks are drafts.
  - Soluto and Actionstep are missing.
- **Customer Stories** (16 items): featured, card-snippet, client reference (logo), slug `/customer-stories/*`.
- **Industries** (8 items):
  - Fields: name, plural and display-order only.
  - The names differ from the nav: SMBs, Accountancy and Managed Service Provider; there's no Legal and no link field.
  - The `/for/*` pages are static.
- **Products** (2) and **Audiences** (3) are too small to be worth wiring.

### The constraint

Webflow allows 20 Collection Lists per page, and the nav is on every page, so every nav list costs one slot site-wide. The mobile drill-in must reuse the desktop DOM rather than duplicate the lists.

### Recommendation: one "Nav Links" collection, 3 Collection Lists

Ben (29 Oct): props would have to be maintained on every page and could drift, so no nav content lives in instance props. Everything comes from one new collection, so an edit is made once and every page updates.

**Nav Links collection fields:**
- `name` (link title) and `description` (optional, clamped to 2 lines)
- `link`, plus `external` (Switch: new tab plus arrow)
- `menu` (Option: Product / Customers / Resources)
- `group` (Option: Platform, Partners, Quicklinks, By stage, By Industry, Customer stories, Read, Reports, Engage, Company, Legal), with `group-order` (Number)
- `order` (Number) and `show` (Switch)
- `layout` (Option: Item / Quick): Item = tile + title + optional description; Quick = title + arrow
- `aside` (Switch on the group's items): the bundle places these groups in the right column (Quicklinks, Customer stories, Reports, Legal)
- `logo` (Image, optional) and `icon` (Phosphor name)
  - If `logo` is set, the tile shows the logo (partners, customer stories).
  - Otherwise it shows the icon (Ben: "if no logo, use icon").

**How it renders:**
- **Lists:** one Collection List per menu, filtered by `menu` and `show`, sorted by `group-order` then `order`. That's 3 lists on every page, well inside the 20-list cap, and the mobile drill-in reuses the same markup.
- **Grouping:** the bundle (`megaNav.ts`) wraps consecutive items of the same `group` (a `data-nav-group` attribute bound to the field) into a `nav_group_wrap` with its label. The last group gets `.is-last`, the tinted column. The panel only shows on hover, so the grouping is in place before anyone sees it.
- **Icons:** `icon` binds to `data-nav-icon`, and `navIcons.ts` swaps in the inline Phosphor SVG (currentColor, so it follows the theme).
- **Existing collections are untouched:** Integrations, Customer Stories and Industries stay as they are, and nothing else on the site changes. The seed items copy today's links and copy word for word, with partner logos from Integrations and client logos for the three stories.
- **Localisation:** items localise per locale, so IE and US can show different stories or partners later.
- **Editing:** Karol edits in the CMS (Editor or Designer): add, hide, reorder, swap a logo. Only new menus or new groups need us.

## 2. Hover and motion ("like ours")

The source is the studio nav: `~/shrink/src/modules/mega-nav.ts` and `hover-list.ts`. The panel uses Adfin's live curve `cubic-bezier(0.165, 0.84, 0.44, 1)`.

| Moment | Behaviour | Timing |
|---|---|---|
| Top links | Existing `nav_hover_pill` slides between links; chevron turns 180° | as live |
| Open | Hover intent, then height grows from 0, content fades and rises 0.25rem with a stagger | intent 120ms in, 150ms out; open 0.35s; stagger 0.25s total |
| Switch menu | One container morphs width and height; content slides 30px the way the pointer moved | 0.4s |
| Close | Content fades up, height to 0 | 0.25s |
| Within a group | One `nav_group_highlight` travels between cards and rows (GSAP Flip); fades and scales in on group enter, out on leave | 0.3s power1.inOut; fill 0.8 to 1 over 0.2s |
| Card | Icon tile tint 8% to 14%, arrow nudges 0.25rem (Lumos `data-trigger="hover focus"`, `--_trigger---on`) | 300ms |
| Partner row | Rule brightens 20% to 100% and draws left to right; logo goes from muted to full | 300ms |
| Quick link | Arrow nudges 0.25rem | 300ms |
| Keyboard | Highlight follows focus-visible; arrow keys move within the panel; Esc closes and returns focus to the trigger | |
| Touch | No follower; press tint; mobile drill-in slides 20% and fades; burger turns to an X | 0.3s |
| Reduced motion | No morph or slide; panel fades; highlight jumps | |

Text colour never changes on hover (Ben: white stays crisp white on Brand, green on Light).

## 3. Build steps

1. [x] **Figma** (done 29 Oct, awaiting Ben's sign-off). Nav set `10520:440` (20 variants, every layer Lumos-named), `Nav Link` set `10543:522` (Layout x Tile x State, props Title/Text/External/Icon), `Nav Icons` `10543:339`, `Doc / Nav logos` `10542:339`, motion spec section 7 "Link hover".
   - Roll B out to Product, Customers and Resources × Brand and Light, plus the 6 mobile drill-ins, with Lumos-named layers.
   - `Nav Link` component (Layout = Item / Quick, Tile = Icon / Logo / None, State = Default / Hover).
   - Update the motion spec and rename the review frames to `Doc / `.
   - Delete the directions frame.
2. [x] **CMS prep** (done 29 Oct): **Nav Links** collection `6ae394e1b9a37c76bf124bcb`, 38 draft items seeded word for word from the live nav (URLs scraped from adfin.com), 5 partner logos, verified not live (item URLs 404).
   - Field slugs: `name`, `description`, `link`, `open-in-new-tab`, `menu`, `group`, `group-order`, `order`, `layout`, `right-column`, `icon`, `logo`, `show-in-nav`. Item slugs are `menu-group-title`.
   - Like every collection it has a template page (`/nav-links/...`). **Set it to Draft** in the Pages panel before any items are published, so no item pages go live.
3. [x] **Bundle** (done 29 Oct, built, not pushed): `src/components/megaNav.ts`, `navIcons.ts` (+ `navIconPaths.ts`, 26 Phosphor icons). Inert until the page has `[data-nav]`, so the live nav is untouched. Tested in `tests/fixtures/nav.html` (all 38 links, desktop and 375px): grouping, hover intent, morph, Escape, click outside, keyboard, scroll hide/show, phone accordion and burger.

   **Markup contract** (Lumos classes from `LUMOS.md`, CSS is Ben's):
   - `[data-nav]` on `nav_component`; `[data-nav-bar]` on `nav_desktop_wrap` (gets `.is-active` once scrolled past 10px; style the 72 to 60px state from it).
   - `[data-nav-toggle="product|customers|resources"]` on each `nav_links_link` button; `.is-active` + `aria-expanded` when open (chevron reads the Lumos state var).
   - `[data-nav-panel="…"]` on each `nav_dropdown_mega_layout`, inside its `nav_links_item`. Desktop: absolute under the bar, full width, hidden by default (JS fades it). Phone: static in the menu (JS animates height for the accordion). `.is-active` when open.
   - Inside each panel: `[data-nav-main]` (`nav_dropdown_mega_main`) and `[data-nav-aside]` (`nav_aside_wrap`), plus one Nav Links Collection List filtered by Menu + Show in nav, sorted Group order then Order.
   - Each Collection Item: `[data-nav-item]` + `data-nav-group` bound to Group, and a `[data-nav-aside-flag]` div visible only when Right column is on (conditional visibility). Item content = `nav_row_wrap` (Layout = Item) or `nav_quick_wrap` (Layout = Quick) via conditional visibility; icon tile `[data-nav-icon]` bound to Icon, logo image shown when Logo is set.
   - `[data-nav-bg]` on `nav_dropdown_bg`: one desktop background under the bar, height animated by JS. It must sit **behind** the panels (lower z-index), or it paints over them because it comes later in the DOM.
   - `[data-nav-burger]` on `nav_menu_button_wrap`, `[data-nav-menu]` on the phone menu; both get `.is-active` when open.
   - `.nav_hidden.u-display-none` holding the templates JS clones: `nav_group_wrap` (`nav_group_label_wrap > nav_group_label`, `nav_group_list`), a `nav_group_list is-split` (keeps the combo class), and `nav_group_highlight`.
   - The existing `navHover` pill keeps working on `.nav_links_list`.
4. [ ] **Webflow staging.**
   - Build the new nav component in Lumos classes: Ben does the CSS, Claude does the attributes and wiring.
   - Add the 3 Collection Lists and the static instances.
   - QA on adfin.webflow.io:
     - links match the signed-off list 1:1
     - IE/US locales
     - keyboard, touch and reduced motion
     - the Collection List budget on the heaviest pages
5. [ ] **Publish**, with Ben's OK.

## Open questions

- Decided: no props. Everything is in the Nav Links CMS. Customer stories use the quote icon (logos were too big). Partners show logos; any item without a logo shows its icon. Mobile = accordion, not drill-in.
- Soluto and Actionstep logos: until Karol sends them, they show the icon fallback.
