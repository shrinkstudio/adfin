/**
 * YouTube channel → Videos CMS sync. Same contract as events:
 * YouTube owns title/date/url/id; editors own Summary, slug and publish
 * state; the thumbnail is seeded once and then left alone. Everything lands
 * as a DRAFT — curation (including leaving case-study videos unpublished)
 * happens in the Editor.
 */

import { listChannelVideos } from './videos.js';
import { listItems, createItem, updateItem } from './webflow.js';

const VIDEOS_COLLECTION_ID = '6a9c2a36920a7ddd524172cc';

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'video';

const videoFields = (video) => ({
  'youtube-id': video.youtubeId,
  'video-url': `https://www.youtube.com/watch?v=${video.youtubeId}`,
  // Normalised to Webflow's stored format so comparisons don't flag
  // "2026-05-13T15:27:25Z" vs "2026-05-13T15:27:25.000Z" forever.
  'published-on-2': video.publishedAt ? new Date(video.publishedAt).toISOString() : null,
});

const changed = (existing, incoming) =>
  Object.entries(incoming).some(([key, value]) => (existing[key] ?? null) !== (value ?? null));

const loadState = async (env) => {
  const [videos, items] = await Promise.all([
    listChannelVideos(env),
    listItems(env.WEBFLOW_API_TOKEN, VIDEOS_COLLECTION_ID),
  ]);
  const byYoutubeId = new Map(
    items.filter((i) => i.fieldData['youtube-id']).map((i) => [i.fieldData['youtube-id'], i])
  );
  return { videos, items, byYoutubeId };
};

const itemStatus = (item) => {
  if (!item) return 'new';
  if (item.isDraft) return 'draft';
  return item.lastPublished ? 'published' : 'staged';
};

export const videosReport = async (env) => {
  const { videos, byYoutubeId, items } = await loadState(env);
  const feedIds = new Set(videos.map((v) => v.youtubeId));
  const lastActivity = items
    .filter((i) => i.fieldData['youtube-id'])
    .reduce((max, i) => (max === null || i.lastUpdated > max ? i.lastUpdated : max), null);
  return {
    lastActivity,
    videos: videos.map((video) => {
      const item = byYoutubeId.get(video.youtubeId) ?? null;
      return {
        youtubeId: video.youtubeId,
        name: video.title,
        publishedAt: video.publishedAt,
        url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        thumb: item?.fieldData?.thumbnail?.url ?? video.thumbnail ?? null,
        status: itemStatus(item),
        pendingUpdate: item
          ? changed(item.fieldData, { ...videoFields(video), name: video.title })
          : false,
      };
    }),
    cmsOnly: items
      .filter((i) => i.fieldData['youtube-id'] && !feedIds.has(i.fieldData['youtube-id']))
      .map((i) => ({ name: i.fieldData.name, status: itemStatus(i) })),
    source: env.YOUTUBE_API_KEY ? 'api' : 'rss',
    cmsTotal: items.length,
  };
};

export const syncVideos = async (env, { limit = Infinity } = {}) => {
  const { videos, byYoutubeId, items } = await loadState(env);
  const usedSlugs = new Set(items.map((i) => i.fieldData.slug));

  const ops = [];
  for (const video of videos) {
    const existing = byYoutubeId.get(video.youtubeId);
    if (!existing) {
      ops.push({
        kind: 'create',
        name: video.title,
        run: () => {
          let slug = slugify(video.title);
          while (usedSlugs.has(slug)) slug = `${slug}-${video.youtubeId.slice(-4).toLowerCase()}`;
          usedSlugs.add(slug);
          return createItem(env.WEBFLOW_API_TOKEN, VIDEOS_COLLECTION_ID, {
            name: video.title,
            slug,
            ...videoFields(video),
            ...(video.thumbnail ? { thumbnail: { url: video.thumbnail } } : {}),
          });
        },
      });
      continue;
    }
    const incoming = { ...videoFields(video), name: video.title };
    if (!changed(existing.fieldData, incoming)) continue;
    ops.push({
      kind: 'update',
      name: video.title,
      run: () => updateItem(env.WEBFLOW_API_TOKEN, VIDEOS_COLLECTION_ID, existing.id, incoming),
    });
  }

  const created = [];
  const updated = [];
  const batch = ops.slice(0, limit);
  for (const op of batch) {
    await op.run();
    (op.kind === 'create' ? created : updated).push(op.name);
  }

  return {
    created,
    updated,
    remaining: ops.length - batch.length,
    total: videos.length,
    at: new Date().toISOString(),
  };
};
