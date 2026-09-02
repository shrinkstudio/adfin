/** Minimal Webflow Data API v2 client for CMS upserts. */

const BASE = 'https://api.webflow.com/v2';

const request = async (token, method, path, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429) {
    const wait = Number(res.headers.get('retry-after') ?? 2);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return request(token, method, path, body);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Webflow ${res.status} ${method} ${path}: ${text.slice(0, 300)}`);
  }
  return res.status === 204 ? null : res.json();
};

/** Every item in a collection, paginated. */
export const listItems = async (token, collectionId) => {
  const items = [];
  let offset = 0;
  for (;;) {
    const page = await request(
      token,
      'GET',
      `/collections/${collectionId}/items?limit=100&offset=${offset}`
    );
    items.push(...(page.items ?? []));
    offset += page.items?.length ?? 0;
    if (offset >= (page.pagination?.total ?? 0) || !page.items?.length) return items;
  }
};

export const createItem = (token, collectionId, fieldData, { isDraft = true } = {}) =>
  request(token, 'POST', `/collections/${collectionId}/items`, { isDraft, fieldData });

export const updateItem = (token, collectionId, itemId, fieldData) =>
  request(token, 'PATCH', `/collections/${collectionId}/items/${itemId}`, { fieldData });
