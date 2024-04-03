import Spinner from 'components/Spinner';
import React, { FC, ReactNode, createContext, useState } from 'react';
import { ProductEnum, getProduct } from 'utils/apiService';
import { getSubDomain } from 'utils/misc';

interface IProductContextState {
  product: ProductEnum | null;
}
interface IProductContextAction {
  setProduct: (product: ProductEnum) => void;
}
export const ProductContext = createContext<
  IProductContextState & IProductContextAction
>({
  product: ProductEnum.Office,
  setProduct: () => {},
});
interface IProductProviderProps {
  children: ReactNode;
}
const ProductProvider: FC<IProductProviderProps> = ({ children }) => {
  const [product, setProduct] = useState<ProductEnum | null>(getProduct());

  // Redirect to learn if user lands on lxp generic page.
  if (
    getProduct() === ProductEnum.Lxp &&
    !!!getSubDomain(window.location.host)
  ) {
    if (process.env.NODE_ENV !== 'development') {
      window.location.replace(
        process.env.REACT_APP_LEARN_BASE_URL || `https://learn.auzmor.com`,
      );
      return <Spinner />;
    }
  }
  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
