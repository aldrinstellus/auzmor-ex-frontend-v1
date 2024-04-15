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
}
export const DocumentPathContext = createContext<
  IDocumentPathContextState & IDocumentPathContextAction
>({
  path: [{ id: 'root', label: 'Documents' }],
  setPath: () => {},
  appendFolder: () => {},
  slicePath: () => {},
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
  return (
    <DocumentPathContext.Provider
      value={{
        path,
        setPath,
        appendFolder,
        slicePath,
      }}
    >
      {children}
    </DocumentPathContext.Provider>
  );
};

export default DocumentPathProvider;
