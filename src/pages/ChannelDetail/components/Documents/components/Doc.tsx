import { clsx } from 'clsx';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Truncate from 'components/Truncate';
import React, { FC, useMemo, useState } from 'react';
import useModal from 'hooks/useModal';
import { DocType } from 'queries/files';
import FilePreviewModal from './FilePreviewModal';

interface IDocProps {
  file: DocType;
}

export const getIconName = (mimeType: string) => {
  const MIME_TO_ICON: Record<string, string> = {
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'doc',
    'image/jpeg': 'img',
    'image/png': 'img',
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'ppt',
    'application/vnd.google-apps.presentation': 'ppt',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
    'image/gif': 'img',
    'application/vnd.google-apps.document': 'doc',
  };
  return MIME_TO_ICON[mimeType];
};

const Doc: FC<IDocProps> = ({ file }) => {
  const [filePreview, openFilePreview, closeFilePreview] = useModal(
    false,
    true,
  );

  const [imgSrc, setImgSrc] = useState<string | undefined>(
    file.fileThumbnailUrl,
  );
  const onError = () => setImgSrc('');

  const style = useMemo(
    () =>
      clsx({
        'p-4 bg-white flex flex-col w-64 cursor-pointer gap-4': true,
      }),
    [],
  );

  const iconName = getIconName(file.mimeType);
  return (
    <>
      <Card
        className={style}
        onClick={() =>
          imgSrc ? openFilePreview() : window.open(file.fileUrl, '_blank')
        }
      >
        <div className="border border-neutral-300 overflow-hidden rounded-7xl w-full h-28">
          {imgSrc ? (
            <img src={imgSrc} onError={onError} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Icon name={iconName} size={56} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 items-center flex">
            <Icon name={iconName} />
          </div>
          <Truncate text={file.name} className="max-w-[190px] font-medium" />
        </div>
      </Card>
      {filePreview && imgSrc && (
        <FilePreviewModal
          file={file}
          open={filePreview}
          closeModal={closeFilePreview}
        />
      )}
    </>
  );
};

export default Doc;
