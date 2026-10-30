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

   **Markup contract** (as built on the test page, 29 Oct; Lumos classes are new so Greg's nav classes stay untouched):
   - `[data-nav]` on `nav_wrap u-theme-brand` (sticky root); `[data-nav-bar]` on `nav_bar` (`.is-active` once scrolled past 10px) > `nav_bar_layout` > `nav_bar_logo`, `nav_menu_list[data-nav-menu]`, `nav_burger_wrap[data-nav-burger]` > `nav_burger_line` x2.
   - `nav_menu_item` > `nav_menu_link[data-nav-toggle="product|customers|resources"]` (`nav_menu_text`, `nav_menu_icon`) + `nav_panel_wrap[data-nav-panel]` > `nav_panel_main[data-nav-main]` + `nav_aside_wrap[data-nav-aside]`. Pricing is a plain `nav_menu_link`. `nav_menu_link` sits above the navHover pill (`position: relative; z-index: 2`); navHover now targets `.nav_menu_list` too.
   - One Nav Links Collection List per panel, inside `nav_panel_main`. Filter: Menu = that menu AND Show in nav is on. Sort: Group order, then Order (ascending).
   - Collection Item `nav_group_item[data-nav-item]` with attributes bound to CMS: `data-nav-group` (Group), `data-nav-layout` (Layout), `data-nav-aside` (Column). Switch fields can't bind to attributes, so "Right column" became the Option field **Column** (Main / Right column) and "Open in new tab" was removed: the bundle treats any link to another host as external (new tab + arrow).
   - Item content (no conditional visibility needed, the bundle trims it): `nav_row_wrap` (link bound to Link) > `nav_row_icon_wrap[data-nav-icon=Icon]`, `nav_row_logo_wrap > nav_row_logo` (image bound to Logo), `nav_row_content > nav_row_title (Name), nav_row_text (Description)`, `nav_row_external[data-nav-icon=arrow-up-right]`; and `nav_quick_wrap` (link bound) > `nav_quick_title (Name)`, `nav_quick_arrow[data-nav-icon=arrow-right]`.
   - `nav_panel_bg[data-nav-bg]`: desktop background under the bar, behind the panels (z-index 1 vs 2).
   - `nav_hidden u-display-none` templates: `nav_group_wrap > nav_group_label_wrap > nav_group_label` + `nav_group_list`, a `nav_group_list is-split`, and `nav_group_highlight`.

4. [ ] **Webflow staging.**
   - Build the new nav component in Lumos classes: Ben does the CSS, Claude does the attributes and wiring.
   - Add the 3 Collection Lists and the static instances.
   - QA on adfin.webflow.io:
     - links match the signed-off list 1:1
     - IE/US locales
     - keyboard, touch and reduced motion
     - the Collection List budget on the heaviest pages
   - 29 Oct, staging test page "Locale Navigation (Test)" with build `65a5deb` (fix `e48700a`: the aside column lookup skipped CMS items, which also carry `data-nav-aside`). Passed: grouping and order, aside groups, Quick vs Item trimming, 5 partner logos, Help centre external only, hover open/switch/morph, pill, row fill, Escape, keyboard focus, burger + scroll lock, accordion. Still to do: list budget, link check.
   - IE/US (`77d5488`): CMS Link fields hold plain URLs that Webflow doesn't localise, so the bundle prefixes internal links with `/ie` or `/us` on those locales. Tested on the fixture only: locale publishing is off, so `/ie` and `/us` 404 on staging. Re-check on staging once publishing is on.
   - Reduced motion (`77d5488`): open, morph, the phone menu and the scroll-hide were already near-instant; the row highlight and the menu pill now jump instead of sliding.
   - 29 Oct, phone + locale (`0674a88`, loader pinned to it): panels open as their own screen on phones (rows slide out, `[data-nav-back]` replaces `[data-nav-logo]`); `[data-nav-actions]` (locale, Sign in, Book a demo) moves to the end of the phone menu; `navLocale` drives `[data-nav-locale]` around the native Locales list (flag + Display Name bound to the locale). Carets turn via `data-state="expanded"` on the toggles (this site's Lumos reads aria-expanded, not `.is-active`). The Webflow style API reduces any value containing a variable to the bare variable except inside transforms, so avoid `calc()`/`color-mix()` with variables through the API.
   - 30 Oct, fast flick: `switchTo` hid the outgoing panel at the end of its timeline, so a second flick killed that hide and left two panels showing. `hideOthers` now clears everything but the two in play before each switch, and `close` fades every panel. Touch: hover paths need desktop width plus a fine pointer, so tablets open by tap only and narrow windows get no pill or row highlight. The bar's plain links now close an open panel (the selector still named the old list).
   - 30 Oct, locale names: the native list only shows the language code (`en` on all three), so `navLocale` swaps in UK, IRE and USA by `hreflang`, on the list and the toggle.
   - 30 Oct, component: nav is now component **Nav (New)** `35ceae18-cb05-e98f-3b36-63156648c35e` (group Global), variants Light (base) and Brand `3ecd5f38-a4b7-a8ed-7f4f-9e25db7e530e`, set as a Theme mode on `nav_wrap` like Greg's Nav. Props: Banner, Locale Switcher, Sign In, Sign In Text, Book A Demo, Book A Demo Text. No link props: menu links stay in Nav Links. It carries the skip link, Nav Banner and Greg's banner and skip embed. The API refuses to convert anything holding a Collection List, so the three lists were parked in a `nav_hidden` holder on the test page, labelled PASTE into Product/Customers/Resources panel main; they go back into `nav_panel_main` in the Designer. Greg's Position prop is a conditional attribute and was not carried over; check whether any instance turns it off before rollout.
   - 30 Oct, lists pasted into Nav (New) by Ben, holder removed. Staging tests on the real component: 38 links in the right groups, 5 partner logos, 9 of 9 flicks, Pricing closes panels, phone menu below the banner, drill-down works, no console errors. Locale Switcher default is off until launch. Next: swap Nav (New) in for Nav on each page, keeping each page's Default/Brand and banner setting.
   - 30 Oct, sizing: `nav_menu_list` column gap 0, `nav_menu_link` and `nav_locale_toggle` 2.75rem high (auto on phones) so the pill matches Book a demo at 44px. The phone menu now starts at the bar's measured bottom, because the banner sits above it.
   - jsDelivr can keep `@production` on an old build for hours after a purge. To test a new build on staging, swap in the commit-pinned build (`@<build sha>`).
5. [ ] **Publish**, with Ben's OK.

## Open questions

- Decided: no props. Everything is in the Nav Links CMS. Customer stories use the quote icon (logos were too big). Partners show logos; any item without a logo shows its icon. Mobile = accordion, not drill-in.
- Soluto and Actionstep logos: until Karol sends them, they show the icon fallback.
