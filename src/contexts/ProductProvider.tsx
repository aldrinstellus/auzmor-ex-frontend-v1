import React, { FC, ReactNode, createContext, useState } from 'react';
import { getProduct } from 'utils/misc';

export enum ProductEnum {
  Lxp = 'lxp',
  Office = 'office',
}

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
