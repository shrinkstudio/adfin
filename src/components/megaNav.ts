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
//       [data-nav-main] / [data-nav-aside]      group columns / right column
//       [data-nav-item]                         Nav Links CMS items (nav_group_item), with
//                                               CMS-bound data-nav-group, data-nav-layout
//                                               (Item|Quick), data-nav-aside (Column:
//                                               Main|Right column); external links are detected
//     [data-nav-bg]                             desktop panel background, morphs height
//     [data-nav-burger] / [data-nav-menu]       phone menu button / menu
//     [data-nav-back] / [data-nav-logo]         phone Back button / the logo it replaces
//     [data-nav-actions]                        locale + CTAs; moved into the phone menu
//     .nav_hidden.u-display-none                templates: .nav_group_wrap,
//                                               .nav_group_list.is-split, .nav_group_highlight
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
/* groups with this many links run in two columns */
const SPLIT_AT = 7;
/* scrolled state past this, auto-hide only past the top of the page */
const SCROLLED_AT = 10;
const HIDE_AFTER = 100;
/* cubic-bezier(0.165, 0.84, 0.44, 1), the live nav's curve */
const EASE = 'power3.out';

const DUR = { open: 0.35, morph: 0.4, close: 0.25, contentIn: 0.3, contentOut: 0.2, stagger: 0.25 };

/* locale subdirectories (as in localeNudge); CMS Link fields stay unprefixed */
const LOCALES = ['ie', 'us'];
const localePrefix = () => {
  const first = window.location.pathname.split('/')[1]?.toLowerCase() || '';
  return LOCALES.includes(first) ? `/${first}` : '';
};

/* the CMS Column option ("Right column"), or a plain true/on flag */
const isOn = (value: string | null) => /^(true|on|yes|1|right.*)$/i.test((value || '').trim());

/**
 * Trims one CMS item down to the markup its fields ask for, so the Designer
 * needs no conditional visibility: Item or Quick layout, the logo tile when a
 * logo is set (otherwise the icon tile), and the external arrow and new tab
 * only for external links. Internal links get the locale prefix on /ie and /us.
 */
const prepareItem = (item: HTMLElement): void => {
  const layout = (item.getAttribute('data-nav-layout') || '').trim().toLowerCase();
  if (layout) {
    item
      .querySelectorAll(layout === 'quick' ? '.nav_row_wrap' : '.nav_quick_wrap')
      .forEach((el) => el.remove());
  }
  const logo = item.querySelector<HTMLImageElement>('.nav_row_logo');
  const hasLogo =
    !!logo && !logo.classList.contains('w-dyn-bind-empty') && !!logo.getAttribute('src');
  item.querySelector(hasLogo ? '.nav_row_icon_wrap' : '.nav_row_logo_wrap')?.remove();
  const link = item.querySelector<HTMLAnchorElement>('a[href]');
  const external =
    isOn(item.getAttribute('data-nav-external')) ||
    (!!link && !!link.hostname && link.hostname !== window.location.hostname);
  if (!external) {
    item.querySelectorAll('.nav_row_external').forEach((el) => el.remove());
    const prefix = localePrefix();
    item.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (prefix && !href.startsWith('//') && href !== prefix && !href.startsWith(`${prefix}/`))
        a.setAttribute('href', prefix + href);
    });
  } else
    item.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
    });
};

/**
 * Sorts a panel's Nav Links CMS items into labelled groups. The list arrives
 * sorted by group order then link order, so consecutive items that share a
 * group become one `nav_group_wrap` (cloned from the hidden template), placed
 * in the right column when the item's "Right column" flag is visible.
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
  // CMS items carry data-nav-aside too (their Column value), so skip them here
  const aside = panel.querySelector<HTMLElement>(`[data-nav-aside]:not(${ITEM})`) || main;
  const isAside = (item: HTMLElement) =>
    isOn(item.getAttribute('data-nav-aside')) ||
    !!item.querySelector('[data-nav-aside-flag]:not(.w-condition-invisible)');

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
      // main groups are the bordered columns; right column groups just stack
      group.classList.toggle('is-column', !isAside(item));
      (isAside(item) ? aside : main).appendChild(group);
      groups.push(group);
      current = name;
    }
    list.appendChild(item);
  });

  groups.forEach((group) => {
    const groupList = group.querySelector<HTMLElement>(LIST);
    if (groupList && groupList.children.length >= SPLIT_AT) groupList.classList.add('is-split');
  });
  // the emptied Collection List wrappers would only add stray gaps
  panel.querySelectorAll('.w-dyn-list').forEach((l) => {
    if (!l.querySelector(ITEM)) l.remove();
  });
  return groups;
};

/**
 * One highlight per group glides between its links, the same mechanics as
 * the bar's navHover pill. Desktop pointers only.
 */
const addHighlights = (root: HTMLElement, groups: HTMLElement[]): void => {
  const { gsap } = window;
  const template = root.querySelector<HTMLElement>(`${TEMPLATES} .nav_group_highlight`);
  if (!gsap || !template) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  groups.forEach((group) => {
    const list = group.querySelector<HTMLElement>(LIST);
    if (!list) return;
    const links = [...list.children].filter((c): c is HTMLElement => c instanceof HTMLElement);
    const highlight = template.cloneNode(true) as HTMLElement;
    highlight.setAttribute('aria-hidden', 'true');
    list.prepend(highlight);
    gsap.set(highlight, {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
    });

    let between = false;
    const fade = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        between = false;
      },
    });
    fade.to(highlight, { opacity: 1, duration: 0.2 });

    const moveTo = (target: HTMLElement) => {
      const box = target.getBoundingClientRect();
      const base = list.getBoundingClientRect();
      const to = {
        x: box.left - base.left,
        y: box.top - base.top,
        width: box.width,
        height: box.height,
      };
      if (between && !reduced) gsap.to(highlight, { ...to, duration: 0.3, ease: 'power1.inOut' });
      else gsap.set(highlight, to);
      between = true;
      fade.play();
    };

    links.forEach((link) => {
      on(link, 'mouseenter', () => moveTo(link));
      on(link, 'focusin', () => moveTo(link));
    });
    on(list, 'mouseleave', () => fade.reverse());
    on(list, 'focusout', (e: FocusEvent) => {
      if (!list.contains(e.relatedTarget as Node)) fade.reverse();
    });
  });
};

/**
 * Adfin's nav: one desktop panel background that morphs between the Product,
 * Customers and Resources panels (hover intent, content fades in, keyboard),
 * a screen per panel on phones (Back in the bar), and a bar that hides on scroll down and returns on
 * scroll up. Panel content comes from the Nav Links CMS, grouped here. Inert
 * until the page has `[data-nav]`, so the current nav is untouched.
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
  if (window.matchMedia(HOVER).matches) addHighlights(root, groups);

  const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : 1;
  const d = (key: keyof typeof DUR) => DUR[key] * speed;
  const desktopMq = window.matchMedia(DESKTOP);

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

  const resetDesktop = () => {
    kill();
    panels.forEach((p) => {
      gsap.set(p, { autoAlpha: 0, x: 0, clearProps: 'height,overflow,pointerEvents,transform' });
      gsap.set(content(p), { autoAlpha: 1, x: 0, xPercent: 0, y: 0 });
    });
    if (bg) gsap.set(bg, { height: 0 });
    state.active = null;
    state.closing = false;
    setActive(null);
  };

  const open = (key: string) => {
    const panel = panelOf(key);
    if (!panel) return;
    if (state.active === key && !state.closing) return;
    if (state.active && state.active !== key && !state.closing) {
      switchTo(state.active, key);
      return;
    }
    kill();
    state.active = key;
    state.closing = false;
    setActive(key);
    panels.forEach((p) => p !== panel && gsap.set(p, { autoAlpha: 0 }));
    const tl = gsap.timeline();
    state.tl = tl;
    if (bg) tl.to(bg, { height: panel.offsetHeight, duration: d('open'), ease: EASE }, 0);
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

  const switchTo = (from: string, to: string) => {
    const fromEl = panelOf(from);
    const toEl = panelOf(to);
    if (!fromEl || !toEl) return;
    const dir =
      toggles.indexOf(toggleOf(to) as HTMLElement) > toggles.indexOf(toggleOf(from) as HTMLElement)
        ? 1
        : -1;
    kill();
    state.active = to;
    setActive(to);
    const out = d('contentOut');
    const tl = gsap.timeline();
    state.tl = tl;
    tl.to(content(fromEl), { autoAlpha: 0, x: dir * -24, duration: out, ease: 'power2.in' }, 0);
    tl.set(fromEl, { autoAlpha: 0 }, out);
    tl.set(content(fromEl), { x: 0 }, out);
    if (bg) tl.to(bg, { height: toEl.offsetHeight, duration: d('morph'), ease: EASE }, 0.05);
    tl.set(toEl, { autoAlpha: 1 }, out * 0.5);
    tl.fromTo(
      content(toEl),
      { autoAlpha: 0, x: dir * 24, y: 0 },
      {
        autoAlpha: 1,
        x: 0,
        duration: d('contentIn'),
        ease: EASE,
        stagger: { amount: d('stagger') },
      },
      out * 0.6
    );
  };

  const close = () => {
    const panel = panelOf(state.active);
    if (!panel || state.closing) return;
    kill();
    state.closing = true;
    const tl = gsap.timeline({ onComplete: resetDesktop });
    state.tl = tl;
    tl.to(
      content(panel),
      { autoAlpha: 0, y: -4, duration: d('contentOut') * 0.7, ease: 'power2.in' },
      0
    );
    if (bg) tl.to(bg, { height: 0, duration: d('close'), ease: 'power2.in' }, 0.05);
    tl.set(panel, { autoAlpha: 0 });
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
      ? [...menu.children].flatMap((child) =>
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
      gsap.set(p, { clearProps: 'height,overflow,transform', autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(content(p), { clearProps: 'all' });
    });
    gsap.set([...rows(), ...chrome()], { clearProps: 'opacity,visibility,transform' });
    if (menu) gsap.set(menu, { clearProps: 'overflowY' });
    if (bg) gsap.set(bg, { clearProps: 'height' });
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
      if (!desktopMq.matches) return;
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
  root.querySelectorAll<HTMLElement>('.nav_links_list a').forEach((a) => {
    if (a.closest(PANEL)) return;
    on(a, 'mouseenter', () => desktopMq.matches && state.active && scheduleClose());
  });
  on(root, 'mouseleave', () => desktopMq.matches && scheduleClose());
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

  // ---- scroll: scrolled state, hide on the way down, show on the way up ----
  let lastY = window.scrollY;
  let hidden = false;
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    bar?.classList.toggle(ACTIVE, y > SCROLLED_AT);
    const busy = !!state.active || state.menuOpen;
    const hide = !busy && y > Math.max(HIDE_AFTER, root.offsetHeight) && y > lastY;
    if (hide !== hidden && (hide || y < lastY || busy)) {
      hidden = hide;
      gsap.to(root, { yPercent: hide ? -100 : 0, duration: 0.35 * speed, ease: EASE });
    }
    lastY = y;
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
      if (menu) gsap.set(menu, { clearProps: 'opacity,visibility' });
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
