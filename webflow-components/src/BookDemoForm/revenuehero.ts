/**
 * RevenueHero routing + scheduling via its programmatic API. Because Code
 * Components render in Shadow DOM, page-level `hero.schedule('#form')` can't see
 * our form — so we drive it directly: submit the collected data, then open the
 * scheduler dialog (which RevenueHero renders at <body> level, outside the shadow).
 * https://help.revenuehero.io/Inbound-router-installation
 */
const SCHEDULER_SRC = 'https://assets.revenuehero.io/scheduler.min.js';

interface RevenueHeroInstance {
  submit(data: Record<string, string>): Promise<unknown>;
  dialog: { open(session: unknown): void };
}
interface RevenueHeroCtor {
  new (opts: { routerId: string }): RevenueHeroInstance;
}
declare global {
  interface Window {
    RevenueHero?: RevenueHeroCtor;
    hero?: RevenueHeroInstance;
    __adfinHeroRouter?: string;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScheduler(): Promise<void> {
  if (window.RevenueHero) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCHEDULER_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load RevenueHero')));
      if (window.RevenueHero) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = SCHEDULER_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load RevenueHero'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Submit the lead for routing/qualification and open the scheduler dialog. */
export async function submitAndOpen(routerId: string, data: Record<string, string>): Promise<void> {
  await loadScheduler();
  if (!window.RevenueHero) throw new Error('RevenueHero unavailable');
  // Reuse a single instance per router id across the page.
  if (!window.hero || window.__adfinHeroRouter !== routerId) {
    window.hero = new window.RevenueHero({ routerId });
    window.__adfinHeroRouter = routerId;
  }
  const session = await window.hero.submit(data);
  window.hero.dialog.open(session);
}
