import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { twConfig } from 'utils/misc';
import { ReactNode } from 'react';

export const toastConfig = (closeButton: ReactNode) => ({
  closeButton,
  style: {
    border: `1px solid ${twConfig.theme.colors.primary['300']}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  autoClose: TOAST_AUTOCLOSE_TIME,
  transition: slideInAndOutTop,
  theme: 'dark',
});
