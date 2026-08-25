import { anchorLinks } from './anchorLinks';
import { productTab } from './productTab';
import { toc } from './toc';
import { wheel } from './wheel';

export const components = (): void => {
  anchorLinks();
  productTab();
  toc();
  wheel();
};
