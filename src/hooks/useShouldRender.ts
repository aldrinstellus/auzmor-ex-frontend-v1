import {
  HIDDEN_COMPONENTS_FOR_LXP_ONLY,
  VISIBLE_COMPONENTS_FOR_LXP_ONLY,
} from 'utils/productMapping';
import useProduct from './useProduct';

export const useShouldRender = (id: string) => {
  const { isLxp } = useProduct();
  if (isLxp && HIDDEN_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    return false;
  }
  if (isLxp && VISIBLE_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    return true;
  }
  return false;
};
