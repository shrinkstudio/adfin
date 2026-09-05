/**
 * Runtime env on Webflow Cloud does not (currently) deliver dashboard
 * variables to CLI-uploaded deployments, so the build bakes values in from
 * the app's local .env (SYNC_* names, gitignored; server bundle only).
 * Runtime values win whenever they exist, so if dashboard vars ever start
 * arriving they take over automatically.
 */

const BUILD = {
  WEBFLOW_API_TOKEN: import.meta.env.SYNC_WEBFLOW_TOKEN,
  LUMA_API_KEY: import.meta.env.SYNC_LUMA_KEY,
  YOUTUBE_API_KEY: import.meta.env.SYNC_YT_KEY,
  YOUTUBE_CHANNEL_ID: import.meta.env.SYNC_YT_CHANNEL,
};

export const withFallback = (env) => {
  const merged = { ...env };
  for (const [key, value] of Object.entries(BUILD)) {
    if (typeof merged[key] !== 'string' || !merged[key]) merged[key] = value;
  }
  return merged;
};
