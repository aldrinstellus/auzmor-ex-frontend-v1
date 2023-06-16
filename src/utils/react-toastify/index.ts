import { cssTransition } from 'react-toastify';
import './styles.css';

export const slideInAndOutTop = cssTransition({
  enter: 'slide-in-top',
  exit: 'slide-out-top',
});

export const slideInAndOutBottom = cssTransition({
  enter: 'slide-in-bottom',
  exit: 'slide-out-bottom',
});
