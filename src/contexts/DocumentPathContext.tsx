import React, { FC, ReactNode, createContext, useState } from 'react';

export type Item = {
  id: string;
  label: string;
};

interface IDocumentPathContextState {
  items: Item[];
}
interface IDocumentPathContextAction {
  setItems: (items: Item[]) => void;
  appendItem: (folder: Item) => void;
  sliceItems: (folderId: string) => void;
  getCurrentItem: () => Item;
}
export const DocumentPathContext = createContext<
  IDocumentPathContextState & IDocumentPathContextAction
>({
  items: [{ id: 'root', label: 'Documents' }],
  setItems: () => {},
  appendItem: () => {},
  sliceItems: () => {},
  getCurrentItem: () => ({ id: 'root', label: 'Documents' }),
});

interface IDocumentPathProviderProps {
  children: ReactNode;
}

const DocumentPathProvider: FC<IDocumentPathProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([
    { id: 'root', label: 'Documents' },
  ]);

  const appendItem = (folder: Item) => {
    setItems([...items, folder]);
  };

  const sliceItems = (folderId: string) => {
    const sliceIndex = items.findIndex((folder) => folder.id === folderId) + 1;

    if (sliceIndex > 0) {
      setItems([...items.slice(0, sliceIndex)]);
    }
  };

  const getCurrentItem = () => {
    if (items.length === 1 && items[0].id === 'root') {
      return { id: 'null', label: 'Documents' };
    }
    return items[items.length - 1];
  };
  return (
    <DocumentPathContext.Provider
      value={{
        items,
        setItems,
        appendItem,
        sliceItems,
        getCurrentItem,
      }}
    >
      {children}
    </DocumentPathContext.Provider>
  );
};

export default DocumentPathProvider;
