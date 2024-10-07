import { icon } from './icon';
import { filledIcon } from './filledIcon';
import { outlineIcon } from './outlineIcon';
import { LearnIcon } from './leranNotification';
import { LxpOfficeNotification } from './lxpOfficeNotification';
export const iconMap: Record<string, any> = {
  ...icon,
  ...filledIcon,
  ...outlineIcon,
  ...LearnIcon,
  ...LxpOfficeNotification,
};
