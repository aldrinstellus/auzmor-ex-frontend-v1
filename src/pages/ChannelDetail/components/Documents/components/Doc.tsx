import { clsx } from 'clsx';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Truncate from 'components/Truncate';
import React, { FC, useMemo } from 'react';
import { Doc as DocType } from 'interfaces';
import Avatar from 'components/Avatar';
import { humanizeTime } from 'utils/time';

interface IDocProps {
  doc: DocType;
}

export const getIconFromMime = (mimeType?: string) => {
  if (
    mimeType?.includes('image/') ||
    ['jpeg', 'jpg', 'png', 'svg'].includes(mimeType ?? '')
  )
    return 'imageFile';
  if (
    mimeType?.includes('video/') ||
    ['avi', 'mp4', 'mov', 'wmv', 'mpg', 'm4v'].includes(mimeType ?? '')
  )
    return 'videoFile';

  const MIME_TO_ICON: Record<string, string> = {
    doc: 'doc',
    docx: 'doc',
    ppt: 'ppt',
    pptx: 'ppt',
    xls: 'xls',
    xlsx: 'xls',
    pdf: 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'doc',
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'ppt',
    'application/vnd.google-apps.presentation': 'ppt',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.google-apps.spreadsheet': 'xls',
    'application/vnd.google-apps.document': 'doc',
    'application/vnd.google-apps.folder': 'folder',
    'application/vnd.google-apps.form': 'form',
  };
  return MIME_TO_ICON[mimeType ?? ''] || 'file';
};

const Doc: FC<IDocProps> = ({ doc }) => {
  const style = useMemo(
    () =>
      clsx({
        'flex flex-col gap-2 px-3 py-2 rounded-9xl border border-neutral-200 min-w-[223px] cursor-pointer [&>*]:select-none':
          true,
      }),
    [],
  );

  const iconName = doc.isFolder ? 'dir' : getIconFromMime(doc.mimeType);
  return (
    <>
      <Card className={style}>
        <div className="flex justify-center items-center py-[15px] border border-neutral-200">
          <Icon name={iconName} size={70} />
        </div>
        <div className="flex flex-col gap-1">
          <Truncate
            text={doc.name}
            className="text-xs font-medium leading-[18px] w-[200px]"
          />
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Avatar size={16} image={doc?.ownerImage} name={doc.ownerName} />
              <span className="text-[8px] text-neutral-500 font-medium">
                {doc.ownerName}
              </span>
            </div>
            <div className="flex w-[3px] h-[3px] bg-neutral-300"></div>
            <span className="text-[8px] text-neutral-500 font-medium">
              Updated{' '}
              {doc.externalUpdatedAt
                ? humanizeTime(doc.externalUpdatedAt)
                : 'while ago'}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Doc;
