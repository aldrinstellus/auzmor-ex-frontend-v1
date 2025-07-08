import { FC } from 'react';
import { Metadata } from 'interfaces';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type ImagePreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
  isAnnouncementWidgetPreview?: boolean;
  previewUrl?: string;
  showViewLink?: boolean;
  imgHeight?: string;
  textHeight?: string;
};

const ImagePreview: FC<ImagePreviewProps> = ({
  metaData,
  dataTestId,
  isAnnouncementWidgetPreview,
  previewUrl,
  showViewLink,
  imgHeight,
  textHeight,
}) => {
  const { t } = useTranslation('channelDetail', {
      keyPrefix: 'documentTab',
    });
  return (
    <a
      href={metaData.url}
      target="_blank"
      rel="noreferrer"
      data-testid={dataTestId}
    >
      <img
        src={metaData?.image}
        alt={metaData?.title}
        className={`w-full ${
          isAnnouncementWidgetPreview ? 'h-20' : 'h-[180px]'
        } object-cover rounded-t-9xl ${imgHeight}`}
        data-testid="createpost-sharedlink-img"
      />
      <div
        className={`${
          isAnnouncementWidgetPreview ? 'hidden' : 'flex'
        } items-center justify-between bg-neutral-50 rounded-b-9xl p-4 ${textHeight}`}
      >
        <div className='flex flex-col'>
        <div
          className="font-bold text-sm text-neutral-900 break-normal [overflow-wrap:anywhere]"
          data-testid="createpost-sharedlink-title"
        >
          {metaData?.title}
        </div>
        <div
          className="text-xs text-neutral-500 font-normal mt-2 break-normal [overflow-wrap:anywhere] line-clamp-1"
          data-testid="createpost-sharedlink"
        >
          {metaData?.url}
        </div>
          {showViewLink && (
            <div
              className="text-xs text-neutral-500 font-normal mt-2 break-normal [overflow-wrap:anywhere] line-clamp-1"
              data-testid="createpost-sharedlink"
            >
              {previewUrl}
            </div>
          )}
        </div>
        {(showViewLink && previewUrl) && (
          <Link
            to={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs py-1 px-2 flex bg-white border border-neutral-300 font-bold rounded-full"
          >
            {t('viewLink')}
          </Link>
        )}
      </div>
    </a>
  );
};

export default ImagePreview;
