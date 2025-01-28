import { clsx } from 'clsx';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Truncate from 'components/Truncate';
import React, { FC, useMemo } from 'react';
import { Doc as DocType } from 'interfaces';
import Avatar from 'components/Avatar';
import { humanizeTime } from 'utils/time';
import { useTranslation } from 'react-i18next';

interface IDocProps {
  doc: DocType;
  isFolder?: boolean;
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

  const ICON_TO_MIME: Record<string, string[]> = {
    doc: [
      'doc',
      'docx',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.google-apps.document',
      'application/rtf',
      'text/plain',
      'application/wordperfect',
    ],
    ppt: [
      'ppt',
      'pptx',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.google-apps.presentation',
      'application/vnd.ms-powerpoint.template.macroenabled.12',
      'application/vnd.ms-powerpoint.addin.macroenabled.12',
      'application/vnd.oasis.opendocument.presentation',
    ],
    xls: [
      'xls',
      'xlsx',
      'application/vnd.ms-excel',
      'application/vnd.google-apps.spreadsheet',
      'application/vnd.ms-excel.sheet.macroenabled.12',
      'application/vnd.oasis.opendocument.spreadsheet',
    ],
    pdf: [
      'pdf',
      'application/pdf',
      'application/x-pdf',
      'application/vnd.adobe.pdfxml',
    ],
    videoFile: ['application/mp4', 'application/vnd.apple.mpegurl'],
    folder: ['application/vnd.google-apps.folder', 'inode/directory'],
    form: [
      'application/vnd.google-apps.form',
      'application/x-www-form-urlencoded',
    ],
  };

  if (mimeType) {
    for (const [key, values] of Object.entries(ICON_TO_MIME)) {
      if (values.includes(mimeType)) {
        return key;
      }
    }
  }
  return 'file';
};

const Doc: FC<IDocProps> = ({ doc, isFolder }) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const style = useMemo(
    () =>
      clsx({
        'flex flex-col gap-2 p-3 rounded-9xl border border-neutral-200 min-w-[223px] cursor-pointer [&>*]:select-none shadow-none':
          true,
      }),
    [],
  );

  const iconName =
    doc.isFolder || isFolder ? 'folder' : getIconFromMime(doc.mimeType);
  return (
    <Card className={style}>
      <div className="flex justify-center items-center py-[15px] bg-neutral-100 rounded-md">
        <Icon name={iconName} size={70} />
      </div>
      <div className="flex flex-col gap-1">
        <Truncate
          text={doc.name}
          className="text-xs font-medium leading-[18px] w-[200px] text-neutral-900"
        />
        <div className="flex items-center gap-1">
          {doc?.ownerName && (
            <>
              <div className="flex items-center gap-0.5">
                <Avatar
                  size={16}
                  image={doc?.ownerImage}
                  name={doc.ownerName}
                />
                <span className="text-xxs text-neutral-500 font-medium">
                  {doc.ownerName}
                </span>
              </div>
              <div className="flex w-[3px] h-[3px] bg-neutral-300"></div>
            </>
          )}
          {doc?.externalUpdatedAt && (
            <span className="text-xxs text-neutral-500 font-medium">
              {t('updated', { data: humanizeTime(doc.externalUpdatedAt) })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Doc;
