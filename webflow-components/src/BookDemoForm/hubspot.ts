/**
 * Direct submission to HubSpot's Forms API (no server needed — the endpoint is
 * CORS-open). Records the form submission in HubSpot and fires its workflows,
 * exactly like the live book-demo form does via the Webflow HubSpot app.
 * https://developers.hubspot.com/docs/api/marketing/forms
 */
export interface HubSpotResult {
  ok: boolean;
  status: number;
  error?: string;
}

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export async function submitToHubSpot(
  portalId: string,
  formGuid: string,
  values: Record<string, string>,
): Promise<HubSpotResult> {
  if (!portalId || !formGuid) {
    return { ok: false, status: 0, error: 'Missing HubSpot portalId or formGuid' };
  }

  const hutk = getCookie('hubspotutk');
  const body = {
    fields: Object.entries(values)
      .filter(([, v]) => v !== '' && v != null)
      .map(([name, value]) => ({ name, value })),
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: window.location.href,
      pageName: document.title,
    },
  };

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portalId)}/${encodeURIComponent(formGuid)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, status: res.status, error: text || res.statusText };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  }
}
