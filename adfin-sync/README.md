# Astro + Webflow Cloud

Example Astro app configured for [Webflow Cloud](https://webflow.com/cloud).

[![Deploy to Webflow](https://webflow.com/img/deploy-dark.svg)](https://webflow.com/dashboard/cloud/deploy?repo=https://github.com/Webflow-Examples/hello-world-astro-devlink)

## Project structure

```text
/
├── public/
├── src/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── wrangler.json
└── package.json
```

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `http://localhost:4321` |
| `npm run build`   | Production build to `./dist/`               |
| `npm run preview` | Build and preview with Wrangler locally     |
| `npm run deploy`  | Deploy with Webflow Cloud CLI               |

## Set up Webflow CLI

Install Webflow CLI (global install is optional; you can also run the CLI without `npx` in the export step below).

```bash
npm install -g @webflow/webflow-cli
```

Log in to Webflow and select your desired workspace from the opened browser window. You can append `--force` to reset any existing authentication.

```bash
npx webflow auth login # --force
```

Then, install the needed dependencies.

```bash
npm install
```

Sync all the Webflow components into your local filesystem. Answer the prompts to generate and configure your `webflow.json`.

```bash
npx webflow devlink export
```

Select your desired Webflow site from the sites listed.

You can also view <a href="https://developers.webflow.com/devlink/reference/overview" target="_blank" rel="noopener noreferrer">our DevLink documentation</a> to learn more about all the options, features, and supported elements.

The `webflow.json` `devlink-export` block tells the Webflow CLI where to write generated React components from your linked Webflow site. After running `webflow cloud init` (or `webflow auth login` + `webflow devlink export`) the CLI populates `./webflow/` with components you can import directly into your Astro app.

## Learn more

- [Astro documentation](https://docs.astro.build)
- [Webflow Cloud](https://webflow.com/feature/cloud)
