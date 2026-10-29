import { createLogger } from '$utils/log';

import { NAV_ICONS } from './navIconPaths';

const log = createLogger('navIcons');

const SOURCE = '[data-nav-icon]';
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Nav icons from the Nav Links CMS. Each `[data-nav-icon]` carries a Phosphor
 * name (the CMS `icon` field bound to the attribute) and gets that icon drawn
 * inside it as an inline SVG, so it takes the theme text colour. Unknown or
 * empty names are left blank. Logos are plain CMS images and don't come here.
 */
export const navIcons = (): void => {
  const targets = document.querySelectorAll<HTMLElement>(SOURCE);
  if (!targets.length) return;

  const missing: string[] = [];
  targets.forEach((el) => {
    if (el.querySelector('svg')) return;
    const name = (el.getAttribute('data-nav-icon') || '').trim();
    const paths = NAV_ICONS[name];
    if (!paths) {
      if (name) missing.push(name);
      return;
    }
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 256 256');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'nav_icon_svg');
    paths.forEach((d) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    el.appendChild(svg);
  });

  log('drawn', { icons: targets.length, missing });
};
