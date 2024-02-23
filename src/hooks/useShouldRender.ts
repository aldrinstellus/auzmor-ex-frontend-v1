import { lxp } from 'utils/productMapping';
import useProduct from './useProduct';

export const useShouldRender = (id: string) => {
  const { isLxp } = useProduct();
  return !!!(isLxp && lxp.includes(id));
};
