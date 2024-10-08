import {
  HIDDEN_COMPONENTS_FOR_LXP_ONLY,
  VISIBLE_COMPONENTS_FOR_ADMIN_LXP_ONLY,
  VISIBLE_COMPONENTS_FOR_LEARNER_LXP_ONLY,
  VISIBLE_COMPONENTS_FOR_LXP_ONLY,
} from 'utils/productMapping';
import useProduct from './useProduct';
import useRole from './useRole';

export const useShouldRender = (id: string) => {
  const { isLxp } = useProduct();
  const { isAdmin } = useRole();

  // If product is LXP, Hide components with given id
  if (isLxp && HIDDEN_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    return false;
  }

  if (isLxp) {
    // If product is LXP, Show components with given id
    if (isAdmin && VISIBLE_COMPONENTS_FOR_ADMIN_LXP_ONLY.includes(id)) {
      return true;
    }
    // for learner role , show components with given id
    else if (!isAdmin && VISIBLE_COMPONENTS_FOR_LEARNER_LXP_ONLY.includes(id)) {
      return true;
    }
    return false;
  } else if (!isLxp && VISIBLE_COMPONENTS_FOR_LXP_ONLY.includes(id)) {
    // If product is not LXP, Hide component if it exist on visible components for lxp
    return false;
  }
  return true;
};
