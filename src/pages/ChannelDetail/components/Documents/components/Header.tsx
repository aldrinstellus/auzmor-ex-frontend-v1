import React, { FC } from 'react';
import { useDocumentPath } from 'hooks/useDocumentPath';
import { FolderNameType } from 'contexts/DocumentPathContext';

interface IHeaderProps {}

const Header: FC<IHeaderProps> = ({}) => {
  const { path, slicePath } = useDocumentPath();
  return (
    <div className="flex w-11/12 overflow-x-auto">
      {path.map((folder: FolderNameType, index: number) => (
        <div
          key={folder.id}
          className={`flex text-neutral-900 text-xl`}
          onClick={() => {
            slicePath(folder.id);
          }}
        >
          {!!index && (
            <span className="px-2 font-bold cursor-default">&gt;</span>
          )}
          <p
            className={`cursor-pointer ${
              index === path.length - 1 && 'font-bold !cursor-default'
            }`}
          >
            {folder.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Header;
