import { anchorLinks } from './anchorLinks';
import { productTab } from './productTab';
import { toc } from './toc';
import { transition } from './transition';
import { wheel } from './wheel';

export const components = (): void => {
  anchorLinks();
  productTab();
  toc();
  transition();
  wheel();
};
