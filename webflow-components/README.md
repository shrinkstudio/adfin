# Adfin — Webflow Code Components

React components published into Adfin's Webflow workspace as a Code Component library via DevLink. Self-contained sub-package; does not touch the site bundle in `../src`.

First component: **Pricing Calculator** — a faithful rebuild of the adfin.com/pricing savings calculator (payment collection + credit control fee comparison), with the rates and copy exposed as Designer props.

## Requirements
- Node.js ≥ 22.13 · npm (this package is npm-only).
- A Webflow **workspace with DevLink / Code Components access** (auto-enabled on workspaces with a Webflow Cloud app; otherwise request access).
- A **Workspace API token** from a Workspace admin (Webflow → Workspace settings → Apps & integrations → API access).

## Scripts
```bash
npm install
npm run check     # tsc type-check
npm test          # parity test — asserts the engine matches the LIVE calculator (12 cases)
npm run bundle    # local library bundle (needs library.id in webflow.json, set on first import)
npm run import    # publish the library to a Webflow workspace (see below)
```

## Publishing (DevLink import)
Run this in an interactive terminal the first time (it links the library to your workspace and writes `library.id` back into `webflow.json`):

```bash
# option A: token via env
export WEBFLOW_API_TOKEN=<workspace-api-token>
npm run import

# option B: token as a flag
npx webflow devlink import --api-token <workspace-api-token>
```

Publish to the **Shrink staging workspace** first (site `ss-adfin-staging`), verify in the Designer, then repeat against Adfin's production workspace with that workspace's own token.

After a successful import, the **Pricing Calculator** appears in the Designer's Components panel under the **Adfin** group. Drop it on a page; every rate and copy field is editable in the Properties panel.

## Layout
```
webflow-components/
├── webflow.json                 # library manifest (name + components glob; id added on first import)
├── package.json · tsconfig.json
├── tests/calc.test.ts           # parity lock vs the live calculator
└── src/PricingCalculator/
    ├── calc.ts                  # pure pricing engine — 1:1 port of the live math (parity-verified)
    ├── PricingCalculator.tsx    # the React component (form + live results)
    ├── styles.ts                # Shadow-DOM-scoped CSS (Adfin brand)
    └── PricingCalculator.webflow.tsx  # declareComponent + Designer props
```

## Notes
- **Shadow DOM:** Code Components render in a shadow root, so the component ships its own CSS (`styles.ts`) — site classes and fonts don't cross the boundary.
- **Fonts:** the component embeds **Söhne** (Buch 400, Kräftig 500) inside the Shadow DOM. Söhne is a commercial Klim font, so the woff2 files and the generated `src/PricingCalculator/fonts.ts` are **gitignored** (licensed for the site, not for public redistribution). To build after a fresh clone: place the subset woff2 files in `src/PricingCalculator/fonts/` (see `scripts/embed-fonts.mjs` for the subset command) and run `npm run embed-fonts`. Without it, `styles.ts` won't resolve `./fonts` — falls back cleanly once regenerated.
- **Parity:** `calc.ts` is a verbatim port of the live inline calculator and is locked by `tests/calc.test.ts`. Do not change the math without re-running `npm test`.
