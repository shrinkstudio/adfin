# Adfin: project brain

Read this first in every session. It points to the rest of the brain and sets the build rules.

## The brain

| File | What it holds | Keep it current by |
|---|---|---|
| `CLAUDE.md` (this) | Ground rules, IDs, how we build | Changing a rule as soon as Ben changes it |
| `LUMOS.md` | Lumos naming rules for Figma and Webflow, the nav class map, the hook allowlist | Adding a class to the map before it is used |
| `NAV-PLAN.md` | The nav rebuild: CMS editing, hover and motion, build steps | Ticking steps and recording decisions the same day |

## Project

- Adfin (adfin.com), a payments and credit-control platform. Shrink rebuilt the site, Greg built the structure, and the clients are Karol and Tom.
- Webflow site `6a69cb89a361f85b63b37d60` on Lumos. Locales: en-GB primary, en-IE `/ie`, en-US `/us` (publishing off until launch).
- Figma "Adfin / July 2026" `XTzsrBUInVH9Rk4UbqvwJd`, Components page `10505:21523`, Nav set `10520:440`.
- Bundle: this repo, built on the `production` branch by CI and served by jsDelivr. Since 29 Oct the site head loader pins `PROD_URL` to a build commit (`@<sha>`), because `@production` stayed stale for hours after purges. After each push, bump that sha in Site settings > Custom code to `git log -1 origin/production`, then publish. Code components live in `webflow-components/` (`npm run import`, library "Adfin Tools").
- Nav Links CMS collection `6ae394e1b9a37c76bf124bcb` (nav content, see `NAV-PLAN.md`).
- CMS Data API token: `SYNC_WEBFLOW_TOKEN` in `adfin-sync/.env` (never print it).

## Build rules

**Before creating anything in Webflow or Figma, say in one line:**

1. Is there an existing component or class for this?
2. Is every value bound to a variable?
3. Does the name follow `LUMOS.md`?

Only then extend, and a new class or component comes last, added to `LUMOS.md` first.

- **Lumos everywhere.** Figma layers carry their Webflow class names. A global PreToolUse hook (`.claude/hooks/lumos-check.py`) blocks non-Lumos names on the Adfin Figma file and Adfin site, and a project prompt hook repeats the rule every message.
- **Solid lines only.** No dashed borders. Code components have no rounded corners.
- **Nav links and descriptions are signed off.** Never add, drop or reword them without Ben.

## Ownership and safety

- **CSS is Ben's (Webflow classes). Attributes and JS are Claude's**, with Ben's OK first.
- **Every site publish needs Ben's explicit OK, every time.** A navHover change once took the live nav down. Staging is fine.
- CMS edits through the API stay as drafts unless Ben says publish.

## Writing style

- No em dashes, anywhere.
