import { ProductContext } from 'contexts/ProductProvider';
import { useContext } from 'react';

const useProduct = () => {
  return useContext(ProductContext);
};

export default useProduct;
