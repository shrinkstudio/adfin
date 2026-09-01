import { anchorId } from './anchorId';
import { anchorLinks } from './anchorLinks';
import { duoTab } from './duoTab';
import { progressTab } from './progressTab';
import { toc } from './toc';
import { transition } from './transition';
import { uiScreenshot } from './uiScreenshot';
import { wheel } from './wheel';

export const components = (): void => {
  anchorId();
  anchorLinks();
  duoTab();
  progressTab();
  toc();
  transition();
  uiScreenshot();
  wheel();
};
