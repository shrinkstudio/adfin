# Adfin: Lumos naming rules (Figma and Webflow)

Adfin's Webflow site is built on Lumos. Figma layers use the exact class each element gets in Webflow, so a Figma frame reads like the Navigator and the build is a straight copy. The hook `.claude/hooks/lumos-check.py` enforces this on every Figma write to the Adfin file and every Webflow class write to the Adfin site. It reads the allowlist at the bottom of this file, so edit it here.

## Rules

1. **Every layer inside a component is named after its Webflow class.** For example `nav_card_title`, and utilities may follow after a space: `nav_card_title u-text-style-main`.
2. **The Lumos class pattern is `[component]_[type]_[element]`.** At most 3 underscores, lowercase, and hyphens only inside a part (`nav_row_logo-wrap` is wrong, use `nav_row_logo_wrap`). Deeper nesting starts a new subcomponent (`nav_card_icon_wrap`, not `nav_dropdown_card_icon_wrap`).
3. **`_wrap` marks a component or subcomponent root**, and any interactive root (`<a>`, `<button>`). Preferred names are `_title`, `_text`, `_img`, `_icon`, `_logo` and `_line`.
4. **Modifiers are combo classes:** `is-active`, `is-first`, `is-last`, `is-story`. Utilities are `u-*`.
5. **Decorative layers get a class too.** Hover fills are `nav_card_bg` and rules are `nav_row_line`. Never use "Border", "Hover" or "Tint".
6. **Exceptions:**
   - Variant names (`Device=Desktop, Theme=Brand, ...`).
   - Component and set names listed in the allowlist below.
   - Review and documentation frames prefixed `Doc / `, kept outside component sets.
7. **Colours bind to the Theme variables.** Borders are solid only, never dashed.
8. **In Figma scripts, set names with `node.name = '...'` or a `name:` property**, so the hook can read them. Don't pass names positionally through helper functions.
9. **In Webflow, hover uses Lumos triggers** (`data-trigger="hover focus"` and `--_trigger---on`), never `:hover`. Toggled state is `.is-active` only. For open/closed visuals on a toggle with `data-state="expanded"`, read `--_state---false`: it is 0 when closed and 1 when open (`--_state---true` is the reverse).

Greg's live classes stay as they are, even where they predate these rules (`nav_component`, `nav_dropdown_mega_*`). New work follows the rules.

## Nav class map

### Bar (live, keep)

| Element | Class |
|---|---|
| Nav root | `nav_component` |
| Desktop bar | `nav_desktop_wrap` > `nav_desktop_contain` > `nav_desktop_layout` |
| Logo | `nav_desktop_logo` |
| Top links | `nav_links_component` > `nav_links_list` > `nav_links_item` > `nav_links_link` (`nav_links_text`, `nav_links_icon`) |
| Right side, actions | `nav_desktop_right`, `nav_links_divider`, `nav_actions_wrap` > `nav_locale_wrap`, `nav_signin_wrap` (`nav_signin_text`, `nav_signin_icon`, `nav_signin_border`), `nav_demo_wrap` > `nav_demo_text` |
| Mobile bar and menu | `nav_mobile_header` (`nav_mobile_logo`, `nav_menu_button_wrap` > `nav_menu_button_line`), `nav_menu_list` > `nav_menu_link` (`nav_menu_text`, `nav_menu_icon`), `nav_menu_locale_wrap` |
| Hover pill (bundle) | `nav_hover_pill` |
| Dropdown | `nav_dropdown_component` > `nav_dropdown_mega_wrap` > `nav_dropdown_mega_contain` > `nav_dropdown_mega_scroll` > `nav_dropdown_mega_layout` |

### New nav (built 29 Oct; replaces the live classes above once it ships)

| Element | Class |
|---|---|
| Root, bar | `nav_wrap` (+ `u-theme-brand`), `nav_bar` > `nav_bar_layout` > `nav_bar_logo` |
| Menu | `nav_menu_list` > `nav_menu_item` > `nav_menu_link` (`nav_menu_text u-text-style-small`, `nav_menu_icon` > Phosphor Icon `ph-caret-down`) |
| Actions | `nav_bar_actions[data-nav-actions]` > `nav_locale_wrap` + Button Main instances (Sign in, Book a demo); the bundle moves it to the end of the phone menu |
| Locale switcher | `nav_locale_wrap[data-nav-locale]` > `nav_locale_toggle` (button: `nav_locale_flag`, `nav_locale_text`, `nav_locale_icon`) + `nav_locale_list` (native Locales wrapper) > `nav_locale_items` > `nav_locale_item` > `nav_locale_link` (`nav_locale_flag`, `nav_locale_text`) |
| Phone back | `nav_bar_back[data-nav-back]` (button: `nav_bar_back_icon`, `nav_bar_back_text`), takes the logo's place while a panel is open |
| Panel | `nav_panel_wrap` > `nav_panel_main` + `nav_aside_wrap`; `nav_panel_bg` |
| Phone | `nav_burger_wrap` > `nav_burger_line` |
| CMS item | `nav_group_item` |

### Panel (AB Handshake pattern, 29 Oct)

| Element | Class | Notes |
|---|---|---|
| Panel body | `nav_panel_wrap` > `nav_panel_main` + `nav_aside_wrap` | main = group columns; aside = right column with a 1px left rule `nav_aside_line`, no tint |
| Group | `nav_group_wrap` (+ `is-column` on main groups, added by the bundle: full-height column with a 1px right rule) > `nav_group_label_wrap` > `nav_group_label`, `nav_group_list` | mono uppercase label; 2-column lists use CSS grid |
| Travelling hover fill | `nav_group_highlight` | one per group, moved by JS |
| Link | `nav_row_wrap` | `<a>`, `data-trigger="hover focus"` |
| Tile | `nav_row_icon_wrap` > `nav_row_icon` + `nav_row_icon_border`, or `nav_row_logo_wrap` > `nav_row_logo` | 24px outlined icon tile; Paper White logo tile when the CMS item has a logo |
| Text | `nav_row_content` > `nav_row_title`, `nav_row_text` | text optional, max 2 lines |
| Extras | `nav_row_external`, `nav_row_bg`, `nav_icon_svg` | external arrow; hover tint; SVG drawn by navIcons |
| Quick link | `nav_quick_wrap` > `nav_quick_title`, `nav_quick_arrow`, `nav_quick_bg` | |
| Mobile accordion | `nav_menu_list` > `nav_menu_link` + `nav_menu_panel` (groups reused) | expands in place under its row |

## Allowlist (Figma component and set names)

```lumos-allow
Nav
Nav Link
Nav Label
Nav Icons
Icon / *
Locale Switcher
Locale Item
Flags
Flag / *
Doc / *
```
