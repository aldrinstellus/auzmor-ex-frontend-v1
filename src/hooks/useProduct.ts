import { ProductContext } from 'contexts/ProductProvider';
import { useContext, useEffect, useState } from 'react';
import { ProductEnum } from 'utils/apiService';

const useProduct = () => {
  const { product, setProduct } = useContext(ProductContext);
  const [isLxp, setIsLxp] = useState<boolean>(product === ProductEnum.Lxp);
  const [isOffice, setIsOffice] = useState<boolean>(
    product === ProductEnum.Office,
  );

  // Set product flags
  useEffect(() => {
    setIsLxp(product === ProductEnum.Lxp);
    setIsOffice(product === ProductEnum.Office);
  }, [product]);

  useEffect(() => {
    // Set lxp branding favicon
    if (product === ProductEnum.Lxp) {
      document
        .querySelector('link[rel="icon"]')
        ?.setAttribute('href', '/lxp-favicon.svg');
    }
  }, [product]);

  return { product, setProduct, isLxp, isOffice };
};
export default useProduct;
