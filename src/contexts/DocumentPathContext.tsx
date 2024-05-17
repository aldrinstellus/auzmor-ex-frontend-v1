import React, { FC, ReactNode, createContext, useState } from 'react';

export type FolderNameType = {
  id: string;
  label: string;
};

interface IDocumentPathContextState {
  path: FolderNameType[];
}
interface IDocumentPathContextAction {
  setPath: (path: FolderNameType[]) => void;
  appendFolder: (folder: FolderNameType) => void;
  slicePath: (folderId: string) => void;
  getCurrentFolder: () => FolderNameType;
}
export const DocumentPathContext = createContext<
  IDocumentPathContextState & IDocumentPathContextAction
>({
  path: [{ id: 'root', label: 'Documents' }],
  setPath: () => {},
  appendFolder: () => {},
  slicePath: () => {},
  getCurrentFolder: () => ({ id: 'root', label: 'Documents' }),
});

interface IDocumentPathProviderProps {
  children: ReactNode;
}

const DocumentPathProvider: FC<IDocumentPathProviderProps> = ({ children }) => {
  const [path, setPath] = useState<FolderNameType[]>([
    { id: 'root', label: 'Documents' },
  ]);

  const appendFolder = (folder: FolderNameType) => {
    setPath([...path, folder]);
  };

  const slicePath = (folderId: string) => {
    const sliceIndex = path.findIndex((folder) => folder.id === folderId) + 1;

    if (sliceIndex > 0) {
      setPath([...path.slice(0, sliceIndex)]);
    }
  };

  const getCurrentFolder = () => {
    if (path.length === 1 && path[0].id === 'root') {
      return { id: 'null', label: 'Documents' };
    }
    return path[path.length - 1];
  };
  return (
    <DocumentPathContext.Provider
      value={{
        path,
        setPath,
        appendFolder,
        slicePath,
        getCurrentFolder,
      }}
    >
      {children}
    </DocumentPathContext.Provider>
  );
};

export default DocumentPathProvider;
