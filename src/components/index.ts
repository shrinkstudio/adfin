import { anchorLinks } from './anchorLinks';
import { duoTab } from './duoTab';
import { progressTab } from './progressTab';
import { toc } from './toc';
import { wheel } from './wheel';

export const components = (): void => {
  anchorLinks();
  duoTab();
  progressTab();
  toc();
  wheel();
};
