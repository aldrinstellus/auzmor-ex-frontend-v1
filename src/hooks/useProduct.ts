import { ProductContext } from 'contexts/ProductProvider';
import { useContext, useEffect, useState } from 'react';
import { ProductEnum } from 'utils/apiService';
import { getPalette } from 'utils/branding';

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

  // Set lxp branding colors
  if (product === ProductEnum.Lxp) {
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
      // set primary color
      const primaryColorPalette = getPalette(`#ff3366`, '--primary-');
      Object.keys(primaryColorPalette).forEach((key: string) => {
        root.style.setProperty(key, primaryColorPalette[key]);
      });

      // set secondary color
      const secondaryColorPalette = getPalette('#5c5c5c', '--secondary-');
      Object.keys(secondaryColorPalette).forEach((key: string) => {
        root.style.setProperty(key, secondaryColorPalette[key]);
      });
    }
    document
      .querySelector('link[rel="icon"]')
      ?.setAttribute('href', '/lxp-favicon.svg');
  }

  return { product, setProduct, isLxp, isOffice };
};
export default useProduct;
