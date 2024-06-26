import Card from 'components/Card';
import React, { FC, useMemo } from 'react';
import FolderSvg from 'images/folder.svg';
import { clsx } from 'clsx';

export type FolderType = {
  id?: string;
  remote_id?: string;
  created_at?: string;
  modifiedAt?: string;
  name: string;
  folder_url?: string;
  size: number;
  description?: string;
  parent_folder?: string;
  drive?: string;
  permissions?: any;
  remote_created_at?: string;
  remote_updated_at?: string;
  remote_was_deleted?: boolean;
  field_mappings?: any;
  remote_data?: any;
};

interface IFolderProps {
  folder: FolderType;
  onClick?: () => void;
}

const Folder: FC<IFolderProps> = ({ onClick, folder }) => {
  const style = useMemo(
    () =>
      clsx({
        'p-2 !bg-gray-50 flex w-64 cursor-pointer': true,
      }),
    [],
  );
  return (
    <Card className={style} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12">
          <img src={FolderSvg} alt="Folder" />
        </div>
        <div className="flex flex-col justify-between w-48">
          <p className="max-w-[150px] font-medium line-clamp-2">
            {folder.name}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Folder;
