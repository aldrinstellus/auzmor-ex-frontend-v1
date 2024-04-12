import Card from 'components/Card';
import React, { FC, useMemo } from 'react';
import FolderSvg from 'images/folder.svg';
import Truncate from 'components/Truncate';
import { clsx } from 'clsx';
import { getSizeInMB } from 'utils/misc';

export type FolderType = {
  id?: string;
  remote_id?: string;
  created_at?: string;
  modified_at?: string;
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
        'p-4 bg-white flex w-64 cursor-pointer': true,
      }),
    [],
  );
  return (
    <Card className={style} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12">
          <img src={FolderSvg} />
        </div>
        <div className="flex flex-col justify-between w-48">
          <Truncate text={folder.name} className="max-w-[150px] font-medium" />
          <div className="flex items-center gap-2">
            <p className="text-sm text-neutral-300">3 Files</p>
            <p className="text-sm text-neutral-300">
              {Math.round(getSizeInMB(folder.size))}MB
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Folder;
