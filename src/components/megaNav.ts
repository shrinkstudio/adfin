import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('megaNav');

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gsap?: any;
  }
}

// Markup (Lumos classes, CSS in Webflow; see NAV-PLAN.md):
//   [data-nav]                                  nav_wrap, root
//     [data-nav-bar]                            nav_bar, .is-active once scrolled
//     [data-nav-toggle="product"]               nav_menu_link button, one per menu
//     [data-nav-panel="product"]                nav_panel_wrap, one per menu
//       [data-nav-main]                         group columns
//       [data-nav-item]                         Nav Links CMS items (nav_group_item), with
//                                               CMS-bound data-nav-group and data-nav-layout
//                                               (Item|Quick); external links are detected
//     [data-nav-bg]                             desktop panel background, morphs height
//     [data-nav-burger] / [data-nav-menu]       phone menu button / menu
//     [data-nav-back] / [data-nav-logo]         phone Back button / the logo it replaces
//     [data-nav-actions]                        locale + CTAs; moved into the phone menu
//     .nav_hidden.u-display-none                template: .nav_group_wrap
// State written: .is-active + aria-expanded on toggles and the burger, .is-active
// on the open panel and the phone menu. Hover and colour live in CSS. On phones
// each panel is its own screen over the menu, with Back in the bar.
const ROOT = '[data-nav]';
const BAR = '[data-nav-bar]';
const TOGGLE = '[data-nav-toggle]';
const PANEL = '[data-nav-panel]';
const BG = '[data-nav-bg]';
const BURGER = '[data-nav-burger]';
const MENU = '[data-nav-menu]';
const BACK = '[data-nav-back]';
const LOGO = '[data-nav-logo]';
const ACTIONS = '[data-nav-actions]';
const ITEM = '[data-nav-item]';
const GROUP = '.nav_group_wrap';
const LIST = '.nav_group_list';
const LABEL = '.nav_group_label';
const TEMPLATES = '.nav_hidden';
const ACTIVE = 'is-active';

const DESKTOP = '(min-width: 62em)';
const HOVER = '(hover: hover) and (pointer: fine)';
const HOVER_ENTER = 120;
const HOVER_LEAVE = 150;
/* scrolled state past this */
const SCROLLED_AT = 10;
/* cubic-bezier(0.165, 0.84, 0.44, 1), the live nav's curve */
const EASE = 'power3.out';

const DUR = {
  open: 0.35,
  morph: 0.4,
  close: 0.25,
  contentIn: 0.3,
  contentOut: 0.2,
  stagger: 0.25,
  swap: 0.14,
};

/* the CMS Column option ("Right column"), or a plain true/on flag */
const isOn = (value: string | null) => /^(true|on|yes|1|right.*)$/i.test((value || '').trim());

/**
 * Trims one CMS item down to the markup its layout asks for, so the Designer
 * needs no conditional visibility, and opens external links in a new tab. Links
 * are text only, so the icon and logo tiles go.
 */
const prepareItem = (item: HTMLElement): void => {
  const layout = (item.getAttribute('data-nav-layout') || '').trim().toLowerCase();
  if (layout) {
    item
      .querySelectorAll(layout === 'quick' ? '.nav_row_wrap' : '.nav_quick_wrap')
      .forEach((el) => el.remove());
  }
  item
    .querySelectorAll(
      '.nav_row_icon_wrap, .nav_row_logo_wrap, .nav_row_external, .nav_row_text.w-dyn-bind-empty'
    )
    .forEach((el) => el.remove());
  const link = item.querySelector<HTMLAnchorElement>('a[href]');
  const external =
    isOn(item.getAttribute('data-nav-external')) ||
    (!!link && !!link.hostname && link.hostname !== window.location.hostname);
  item.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
    a.setAttribute('data-trigger', 'hover-other');
    if (!external) return;
    a.target = '_blank';
    a.rel = 'noopener';
  });
};

/**
 * Sorts a panel's Nav Links CMS items into labelled columns. The list arrives
 * sorted by group order then link order, so consecutive items that share a
 * group become one `nav_group_wrap` (cloned from the hidden template).
 */
const buildGroups = (root: HTMLElement, panel: HTMLElement): HTMLElement[] => {
  const items = [...panel.querySelectorAll<HTMLElement>(ITEM)];
  if (!items.length) return [...panel.querySelectorAll<HTMLElement>(GROUP)];

  const template = root.querySelector<HTMLElement>(`${TEMPLATES} ${GROUP}`);
  if (!template) {
    log('no group template in .nav_hidden; leaving the list as is');
    return [];
  }
  const main = panel.querySelector<HTMLElement>('[data-nav-main]') || panel;

  const groups: HTMLElement[] = [];
  let list: HTMLElement | null = null;
  let current = '';
  items.forEach((item) => {
    prepareItem(item);
    const name = (item.getAttribute('data-nav-group') || '').trim();
    if (!list || name !== current) {
      const group = template.cloneNode(true) as HTMLElement;
      const label = group.querySelector<HTMLElement>(LABEL);
      if (label) label.textContent = name;
      list = group.querySelector<HTMLElement>(LIST) || group;
      list.replaceChildren();
      list.setAttribute('data-trigger', 'group');
      group.classList.add('is-column');
      main.appendChild(group);
      groups.push(group);
      current = name;
    }
    list.appendChild(item);
  });

  // only a closing link under other links keeps its arrow
  groups.forEach((group) => {
    if (group.querySelector('.nav_row_wrap')) return;
    group.querySelectorAll('.nav_quick_arrow').forEach((el) => el.remove());
  });
  // hide the emptied Collection List wrappers: Finsweet List finds its list on
  // the next page by its index among .w-dyn-list, so these must stay in the DOM
  panel.querySelectorAll<HTMLElement>('.w-dyn-list').forEach((l) => {
    if (!l.querySelector(ITEM)) l.style.display = 'none';
  });
  return groups;
};

/**
 * Adfin's nav: one desktop panel background that morphs between the Product,
 * Customers and Resources panels (hover intent, content fades in, keyboard),
 * and a screen per panel on phones (Back in the bar). The bar stays put on
 * scroll. Panel content comes from the Nav Links CMS, grouped here. Inert until
 * the page has `[data-nav]`, so the current nav is untouched.
 */
export const megaNav = (): void => {
  const { gsap } = window;
  const root = document.querySelector<HTMLElement>(ROOT);
  if (!gsap || !root) return;

  const toggles = [...root.querySelectorAll<HTMLElement>(TOGGLE)];
  const panels = [...root.querySelectorAll<HTMLElement>(PANEL)];
  const bar = root.querySelector<HTMLElement>(BAR);
  const bg = root.querySelector<HTMLElement>(BG);
  const burger = root.querySelector<HTMLElement>(BURGER);
  const menu = root.querySelector<HTMLElement>(MENU);
  const back = root.querySelector<HTMLElement>(BACK);
  const logo = root.querySelector<HTMLElement>(LOGO);
  const actions = root.querySelector<HTMLElement>(ACTIONS);
  if (!toggles.length || !panels.length) return;

  const groups = panels.flatMap((p) => buildGroups(root, p));
  const hoverMq = window.matchMedia(HOVER);

  const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : 1;
  const d = (key: keyof typeof DUR) => DUR[key] * speed;
  const desktopMq = window.matchMedia(DESKTOP);
  /* tablets get the desktop panels, opened by tap only */
  const hovers = () => desktopMq.matches && hoverMq.matches;

  const name = (el: HTMLElement) => el.getAttribute('data-nav-toggle') || '';
  const panelOf = (key: string | null) =>
    panels.find((p) => p.getAttribute('data-nav-panel') === key) || null;
  const toggleOf = (key: string | null) => toggles.find((t) => name(t) === key) || null;
  const content = (panel: HTMLElement) => panel.querySelectorAll(GROUP);
  const links = (panel: HTMLElement) => [...panel.querySelectorAll<HTMLElement>('a, button')];

  toggles.forEach((toggle) => {
    const panel = panelOf(name(toggle));
    if (!panel) return;
    panel.id ||= `nav-panel-${name(toggle)}`;
    toggle.setAttribute('aria-controls', panel.id);
    toggle.setAttribute('aria-expanded', 'false');
  });

  const state = {
    active: null as string | null,
    closing: false,
    menuOpen: false,
    enterTimer: 0,
    leaveTimer: 0,
    tl: null as any,
  };

  const setActive = (key: string | null) => {
    toggles.forEach((t) => {
      const on = name(t) === key;
      t.classList.toggle(ACTIVE, on);
      t.setAttribute('aria-expanded', String(on));
    });
    panels.forEach((p) => p.classList.toggle(ACTIVE, p.getAttribute('data-nav-panel') === key));
  };

  const clearTimers = () => {
    window.clearTimeout(state.enterTimer);
    window.clearTimeout(state.leaveTimer);
  };

  const kill = () => {
    state.tl?.kill();
    state.tl = null;
    gsap.killTweensOf([bg, ...panels]);
    panels.forEach((p) => gsap.killTweensOf(content(p)));
  };

  // ---- desktop ------------------------------------------------------------

  // a killed timeline never reaches its own hide, so a fast flick strands its panel
  const hideOthers = (...keep: HTMLElement[]) => {
    panels.forEach((p) => {
      if (keep.includes(p)) return;
      gsap.set(p, { autoAlpha: 0 });
      gsap.set(content(p), { autoAlpha: 1, x: 0, y: 0 });
    });
  };

  // the background grows and shrinks more slowly than the panels change, so
  // panels are cut to it: nothing shows past its bottom border or covers it
  const clipToBg = () => {
    const height = Number(gsap.getProperty(bg, 'height'));
    const border = parseFloat(getComputedStyle(bg as HTMLElement).borderBottomWidth);
    panels.forEach((p) => {
      p.style.clipPath = `inset(0 0 ${Math.max(0, p.offsetHeight - height + border)}px 0)`;
    });
  };
  const unclip = () => panels.forEach((p) => p.style.removeProperty('clip-path'));

  /* tall panels scroll inside the space left under the nav */
  const fit = (panel: HTMLElement) => {
    panel.style.maxHeight = `${window.innerHeight - root.getBoundingClientRect().bottom}px`;
    panel.style.overflowY = 'auto';
  };

  const resetDesktop = () => {
    kill();
    unclip();
    panels.forEach((p) => {
      gsap.set(p, {
        autoAlpha: 0,
        x: 0,
        clearProps: 'height,maxHeight,overflow,overflowY,pointerEvents,transform',
      });
      gsap.set(content(p), { autoAlpha: 1, x: 0, xPercent: 0, y: 0 });
    });
    if (bg) gsap.set(bg, { height: 0, autoAlpha: 0 });
    state.active = null;
    state.closing = false;
    setActive(null);
  };

  const open = (key: string) => {
    const panel = panelOf(key);
    if (!panel) return;
    if (state.active === key && !state.closing) return;
    if (state.active && state.active !== key && !state.closing) {
      switchTo(key);
      return;
    }
    kill();
    state.active = key;
    state.closing = false;
    setActive(key);
    hideOthers(panel);
    fit(panel);
    const tl = gsap.timeline();
    state.tl = tl;
    if (bg) {
      tl.set(bg, { autoAlpha: 1 }, 0);
      tl.to(
        bg,
        {
          height: panel.offsetHeight,
          duration: d('open'),
          ease: EASE,
          onUpdate: clipToBg,
          onComplete: unclip,
        },
        0
      );
    }
    tl.set(panel, { autoAlpha: 1 }, 0.05);
    tl.fromTo(
      content(panel),
      { autoAlpha: 0, y: 8 },
      {
        autoAlpha: 1,
        y: 0,
        duration: d('contentIn'),
        ease: EASE,
        stagger: { amount: d('stagger') },
      },
      0.08
    );
  };

  // one crossfade from whatever is showing, so a flick over a middle item never
  // cuts to an empty background
  const switchTo = (to: string) => {
    const toEl = panelOf(to);
    if (!toEl) return;
    kill();
    fit(toEl);
    state.active = to;
    setActive(to);
    const tl = gsap.timeline();
    state.tl = tl;
    tl.to(
      panels.filter((p) => p !== toEl),
      { autoAlpha: 0, duration: d('swap'), ease: 'none' },
      0
    );
    if (bg) {
      tl.to(
        bg,
        {
          height: toEl.offsetHeight,
          duration: d('morph'),
          ease: EASE,
          onUpdate: clipToBg,
          onComplete: unclip,
        },
        0
      );
    }
    tl.set(content(toEl), { autoAlpha: 1, x: 0, y: 0 }, 0);
    tl.to(toEl, { autoAlpha: 1, duration: d('swap'), ease: 'none' }, 0);
  };

  const close = () => {
    const panel = panelOf(state.active);
    if (!panel || state.closing) return;
    kill();
    state.closing = true;
    const tl = gsap.timeline({ onComplete: resetDesktop });
    state.tl = tl;
    // every panel: one interrupted mid-switch may still be showing
    tl.to(
      panels.flatMap((p) => [...content(p)]),
      { autoAlpha: 0, y: -4, duration: d('contentOut') * 0.7, ease: 'power2.in' },
      0
    );
    if (bg) {
      tl.to(bg, { height: 0, duration: d('close'), ease: 'power2.in', onUpdate: clipToBg }, 0.05);
    }
    tl.set(panels, { autoAlpha: 0 });
  };

  const scheduleClose = () => {
    clearTimers();
    state.leaveTimer = window.setTimeout(close, HOVER_LEAVE);
  };

  const focusFirst = (key: string) => {
    window.setTimeout(() => {
      const panel = panelOf(key);
      if (!panel) return;
      // a hidden panel can't take focus, so don't wait on the fade
      gsap.set(panel, { autoAlpha: 1 });
      links(panel)[0]?.focus();
    }, 80);
  };

  // ---- phones -------------------------------------------------------------
  // A panel opens as its own screen over the menu: the menu rows slide out to
  // the left, the panel slides in from the right and Back replaces the logo.

  /* the menu's visible rows: each item's link (not its panel) and the actions */
  const rows = (): Element[] =>
    menu
      ? [...menu.children]
          .filter((child) => !child.matches('.nav_hover_pill'))
          .flatMap((child) =>
            child.querySelector(PANEL)
              ? [...child.children].filter((c) => !c.matches(PANEL))
              : [child]
          )
      : [];
  const chrome = () => [back, logo].filter((el): el is HTMLElement => !!el);

  const resetPhone = () => {
    kill();
    gsap.killTweensOf([...rows(), ...chrome()]);
    panels.forEach((p) => {
      p.classList.remove(ACTIVE);
      gsap.set(p, {
        clearProps: 'height,maxHeight,overflow,overflowY,transform',
        autoAlpha: 0,
        pointerEvents: 'none',
      });
      gsap.set(content(p), { clearProps: 'all' });
    });
    gsap.set([...rows(), ...chrome()], { clearProps: 'opacity,visibility,transform' });
    if (menu) gsap.set(menu, { clearProps: 'overflowY' });
    if (bg) gsap.set(bg, { clearProps: 'height,opacity,visibility' });
    unclip();
    state.active = null;
    setActive(null);
  };

  const openScreen = (key: string) => {
    const panel = panelOf(key);
    if (!panel || !menu) return;
    kill();
    gsap.killTweensOf([...rows(), ...chrome()]);
    state.active = key;
    setActive(key);
    menu.scrollTop = 0;
    panel.scrollTop = 0;
    gsap.set(menu, { overflowY: 'hidden' });

    const tl = gsap.timeline();
    state.tl = tl;
    tl.to(
      rows(),
      {
        xPercent: -10,
        autoAlpha: 0,
        duration: 0.3 * speed,
        stagger: 0.02 * speed,
        ease: 'power2.in',
      },
      0
    );
    if (logo) tl.to(logo, { autoAlpha: 0, duration: 0.2 * speed, ease: 'power2.in' }, 0);
    if (back) tl.to(back, { autoAlpha: 1, duration: 0.25 * speed, ease: EASE }, 0.15 * speed);
    tl.set(panel, { autoAlpha: 1, pointerEvents: 'auto' }, 0.2 * speed);
    tl.fromTo(
      content(panel),
      { xPercent: 8, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: d('contentIn'), stagger: 0.04 * speed, ease: EASE },
      0.2 * speed
    );
    window.setTimeout(() => back?.focus(), 300 * speed);
  };

  const closeScreen = () => {
    const key = state.active;
    const panel = panelOf(key);
    if (!panel) return;
    kill();
    gsap.killTweensOf([...rows(), ...chrome()]);
    state.active = null;
    setActive(null);

    const tl = gsap.timeline({
      onComplete: () => {
        if (menu) gsap.set(menu, { clearProps: 'overflowY' });
        // the row is hidden until here, and a hidden button can't take focus
        toggleOf(key)?.focus();
      },
    });
    state.tl = tl;
    tl.to(panel, { xPercent: 20, autoAlpha: 0, duration: 0.3 * speed, ease: 'power2.in' }, 0);
    tl.set(panel, { xPercent: 0, pointerEvents: 'none' });
    if (back) tl.to(back, { autoAlpha: 0, duration: 0.2 * speed, ease: 'power2.in' }, 0);
    if (logo) tl.to(logo, { autoAlpha: 1, duration: 0.25 * speed, ease: EASE }, 0.15 * speed);
    tl.fromTo(
      rows(),
      { xPercent: -20, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: 0.35 * speed, stagger: 0.03 * speed, ease: EASE },
      0.2 * speed
    );
  };

  const setMenu = (openMenu: boolean) => {
    if (!menu || !burger) return;
    state.menuOpen = openMenu;
    burger.classList.toggle(ACTIVE, openMenu);
    burger.setAttribute('aria-expanded', String(openMenu));
    menu.classList.toggle(ACTIVE, openMenu);
    document.documentElement.style.overflow = openMenu ? 'hidden' : '';
    if (openMenu) {
      // the banner sits above the bar, so the menu starts wherever the bar ends
      if (bar) gsap.set(menu, { top: bar.getBoundingClientRect().bottom });
      gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 * speed, ease: EASE });
      gsap.fromTo(
        rows(),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3 * speed, ease: EASE, stagger: 0.04 * speed }
      );
    } else {
      kill();
      if (state.active) {
        if (back) gsap.to(back, { autoAlpha: 0, duration: 0.2 * speed });
        if (logo) gsap.to(logo, { autoAlpha: 1, duration: 0.2 * speed });
      }
      gsap.to(menu, {
        autoAlpha: 0,
        duration: 0.25 * speed,
        ease: 'power2.in',
        onComplete: () => !desktopMq.matches && resetPhone(),
      });
    }
  };

  /* the actions (locale, Sign in, Book a demo) sit at the end of the phone menu */
  const actionsHome = actions && {
    parent: actions.parentElement,
    next: actions.nextElementSibling,
  };
  const placeActions = (phone: boolean) => {
    if (!actions || !actionsHome?.parent || !menu) return;
    if (phone) menu.appendChild(actions);
    else actionsHome.parent.insertBefore(actions, actionsHome.next);
  };

  // ---- shared events ------------------------------------------------------

  toggles.forEach((toggle) => {
    const key = name(toggle);
    on(toggle, 'mouseenter', () => {
      if (!hovers()) return;
      clearTimers();
      state.enterTimer = window.setTimeout(() => open(key), state.active ? 0 : HOVER_ENTER);
    });
    on(toggle, 'click', (e: MouseEvent) => {
      e.preventDefault();
      if (!desktopMq.matches) {
        if (state.active !== key) openScreen(key);
      } else if (state.active === key && !state.closing) close();
      else open(key);
    });
    on(toggle, 'keydown', (e: KeyboardEvent) => {
      if (!desktopMq.matches) return;
      if (e.key === 'ArrowDown' || ((e.key === 'Enter' || e.key === ' ') && state.active !== key)) {
        e.preventDefault();
        open(key);
        focusFirst(key);
      }
    });
  });

  panels.forEach((panel) => {
    on(panel, 'keydown', (e: KeyboardEvent) => {
      if (!desktopMq.matches || !state.active) return;
      const list = links(panel);
      const idx = list.indexOf(document.activeElement as HTMLElement);
      const toggle = toggleOf(state.active);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        list[(idx + 1) % list.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx <= 0) toggle?.focus();
        else list[idx - 1].focus();
      } else if (e.key === 'Tab' && !e.shiftKey && idx === list.length - 1) {
        // past the last link: on to the next item in the bar
        const next = toggles[toggles.indexOf(toggle as HTMLElement) + 1];
        if (next) {
          e.preventDefault();
          close();
          next.focus();
        } else close();
      }
    });
  });

  // plain links in the bar close an open panel on hover
  root.querySelectorAll<HTMLElement>(`${MENU} a`).forEach((a) => {
    if (a.closest(PANEL) || a.matches(TOGGLE)) return;
    on(a, 'mouseenter', () => hovers() && state.active && scheduleClose());
  });
  on(root, 'mouseleave', () => hovers() && scheduleClose());
  on(root, 'mouseenter', () => window.clearTimeout(state.leaveTimer));

  on(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (desktopMq.matches && state.active) {
      const toggle = toggleOf(state.active);
      close();
      toggle?.focus();
    } else if (!desktopMq.matches && state.active) {
      closeScreen();
    } else if (state.menuOpen) {
      setMenu(false);
      burger?.focus();
    }
  });
  on(document, 'click', (e: MouseEvent) => {
    if (desktopMq.matches && state.active && !root.contains(e.target as Node)) close();
  });

  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    if (menu) {
      menu.id ||= 'nav-menu';
      burger.setAttribute('aria-controls', menu.id);
    }
    on(burger, 'click', () => setMenu(!state.menuOpen));
  }
  if (back) on(back, 'click', closeScreen);

  // ---- scroll: scrolled state ----------------------------------------------
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    bar?.classList.toggle(ACTIVE, window.scrollY > SCROLLED_AT);
  };
  on(
    window,
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  // ---- breakpoint ---------------------------------------------------------
  const setMode = () => {
    if (desktopMq.matches) {
      if (state.menuOpen) setMenu(false);
      if (menu) gsap.set(menu, { clearProps: 'opacity,visibility,top' });
      gsap.set(chrome(), { clearProps: 'opacity,visibility' });
      placeActions(false);
      resetDesktop();
    } else {
      placeActions(true);
      resetPhone();
      if (menu && !state.menuOpen) gsap.set(menu, { autoAlpha: 0 });
    }
  };
  on(desktopMq, 'change', setMode);
  setMode();
  onScroll();

  log('armed', { menus: toggles.length, groups: groups.length });
};
