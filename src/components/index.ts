import { anchorId } from './anchorId';
import { anchorLinks } from './anchorLinks';
import { anchorScroll } from './anchorScroll';
import { askAi } from './askAi';
import { customerLogos } from './customerLogos';
import { duoTab } from './duoTab';
import { emailHandoff } from './emailHandoff';
import { progressTab } from './progressTab';
import { rotatingTitle } from './rotatingTitle';
import { toc } from './toc';
import { transition } from './transition';
import { uiScreenshot } from './uiScreenshot';
import { wheel } from './wheel';

export const components = (): void => {
  anchorId();
  anchorLinks();
  anchorScroll();
  askAi();
  customerLogos();
  duoTab();
  emailHandoff();
  progressTab();
  rotatingTitle();
  toc();
  transition();
  uiScreenshot();
  wheel();
};
