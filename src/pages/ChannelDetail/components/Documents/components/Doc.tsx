import { clsx } from 'clsx';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Truncate from 'components/Truncate';
import React, { FC, useMemo } from 'react';

export type DocType = {
  id?: string;
  remote_id?: string;
  created_at?: string;
  modified_at?: string;
  name: string;
  file_url: string;
  file_thumbnail_url: string;
  size: number;
  mime_type: string;
  description?: string;
  folder?: string;
  permissions?: Array<Record<string, any>>;
  drive?: string;
  remote_created_at?: string;
  remote_updated_at?: string;
  remote_was_deleted?: boolean;
  field_mappings?: any;
  remote_data?: any;
};

interface IDocProps {
  file: DocType;
}

const Doc: FC<IDocProps> = ({ file }) => {
  const getIconName = (mimeType: string) => {
    const MIME_TO_ICON: Record<string, string> = {
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'doc',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'ppt',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/zip': 'zip',
    };
    return MIME_TO_ICON[mimeType];
  };

  const style = useMemo(
    () =>
      clsx({
        'p-4 bg-white flex flex-col w-64 cursor-pointer gap-4': true,
      }),
    [],
  );

  return (
    <Card className={style}>
      <div className="border border-neutral-300 overflow-hidden rounded-7xl w-full h-28">
        {file.file_thumbnail_url ? (
          <img src={file.file_thumbnail_url} />
        ) : (
          <Icon name={getIconName(file.mime_type)} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 items-center flex">
          <Icon name={getIconName(file.mime_type)} />
        </div>
        <Truncate text={file.name} className="max-w-[190px] font-medium" />
      </div>
    </Card>
  );
};

export default Doc;
