import {
  HIDDEN_COMPONENTS_FOR_LXP_ONLY,
  VISIBLE_COMPONENTS_FOR_LXP_ONLY,
} from 'utils/productMapping';
import useProduct from './useProduct';

export const useShouldRender = (id: string) => {
  const { isLxp } = useProduct();

  // If product is LXP, Hide components with given id
  if (isLxp && HIDDEN_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    return false;
  }

  if (isLxp && VISIBLE_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    // If product is LXP, Show components with given id
    return true;
  } else if (!isLxp && VISIBLE_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    // If product is not LXP, Hide component if it exist on visible components for lxp
    return false;
  }
  return true;
};
