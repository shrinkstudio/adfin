import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: "/sync",
  output: "server",
  // Webflow Cloud's proxy rewrites the request host, so the browser's Origin
  // header never matches what the worker sees and every POST gets a 403.
  // Auth here is the passcode cookie, not origin matching.
  security: { checkOrigin: false },
  compressHTML: true,
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),

  integrations: [react()],
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : undefined,
    },
}
});