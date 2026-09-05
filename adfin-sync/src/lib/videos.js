/**
 * YouTube channel video source. Two modes:
 * - RSS (default): the channel's public feed, no key needed, latest ~15 videos.
 * - Data API v3: full uploads playlist, used when YOUTUBE_API_KEY is set.
 */

const rssVideos = async (channelId) => {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: { accept: 'application/atom+xml' },
  });
  if (!res.ok) throw new Error(`YouTube RSS ${res.status} for channel ${channelId}`);
  const xml = await res.text();
  const entries = xml.split('<entry>').slice(1);
  return entries.map((entry) => {
    const pick = (re) => (entry.match(re) ?? [])[1] ?? null;
    return {
      youtubeId: pick(/<yt:videoId>([^<]+)<\/yt:videoId>/),
      title: decodeXml(pick(/<title>([^<]*)<\/title>/) ?? ''),
      publishedAt: pick(/<published>([^<]+)<\/published>/),
      thumbnail: pick(/<media:thumbnail url="([^"]+)"/),
    };
  });
};

const decodeXml = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const apiVideos = async (channelId, apiKey) => {
  // The uploads playlist id is the channel id with UC -> UU.
  const playlistId = channelId.replace(/^UC/, 'UU');
  const videos = [];
  let pageToken;
  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    for (const item of data.items ?? []) {
      const sn = item.snippet ?? {};
      const thumbs = sn.thumbnails ?? {};
      const best = thumbs.maxres ?? thumbs.standard ?? thumbs.high ?? thumbs.medium ?? thumbs.default;
      videos.push({
        youtubeId: item.contentDetails?.videoId ?? sn.resourceId?.videoId,
        title: sn.title ?? '',
        publishedAt: item.contentDetails?.videoPublishedAt ?? sn.publishedAt ?? null,
        thumbnail: best?.url ?? null,
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return videos;
};

export const listChannelVideos = async (env) => {
  if (!env.YOUTUBE_CHANNEL_ID) throw new Error('YOUTUBE_CHANNEL_ID is not set');
  const videos = env.YOUTUBE_API_KEY
    ? await apiVideos(env.YOUTUBE_CHANNEL_ID, env.YOUTUBE_API_KEY)
    : await rssVideos(env.YOUTUBE_CHANNEL_ID);
  return videos.filter((v) => v.youtubeId);
};
