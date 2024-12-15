import React, { useEffect } from 'react';

import useProduct from 'hooks/useProduct';

const FontFamilySwitcher = ({ children }: any) => {
  const { isLxp } = useProduct();

  useEffect(() => {
    // Update the body font-family based on the product type
    document.body.style.fontFamily = isLxp
      ? "'Lato', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
      : "'Manrope', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

    // Also update the Quill editor font if it exists
    const quillElements = document.querySelectorAll('.quill > .ql-container');
    quillElements.forEach((element) => {
      //@ts-ignore
      return (element.style.fontFamily = isLxp ? 'Lato' : 'Manrope');
    });

    // Update Quill placeholder font
    const quillPlaceholders = document.querySelectorAll(
      '.quill > .ql-container > .ql-editor.ql-blank::before',
    );
    quillPlaceholders.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.fontFamily = isLxp ? 'Lato' : 'Manrope';
      }
    });
  }, [isLxp]);

  return <>{children}</>;
};

export default FontFamilySwitcher;
