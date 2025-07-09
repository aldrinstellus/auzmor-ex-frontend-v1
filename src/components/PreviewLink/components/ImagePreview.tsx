import { FC } from 'react';
import { Metadata } from 'interfaces';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PREVIEW_CARD_VARIANT } from 'utils/constants';

type ImagePreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
  isAnnouncementWidgetPreview?: boolean;
  previewUrl?: string;
  variant?: string;
};

const ImagePreview: FC<ImagePreviewProps> = ({
  metaData,
  dataTestId,
  isAnnouncementWidgetPreview,
  previewUrl,
  variant,
}) => {
  const { t } = useTranslation('common');
  const renderCardInfo = () => {
    if (variant === PREVIEW_CARD_VARIANT.document) {
      return (
        <>
          <img
            src={metaData?.image}
            alt={metaData?.title}
            className="w-full p-4 h-[480px] object-cover rounded-t-9xl"
            data-testid="preview-img"
          />
          <div className="flex items-center justify-between p-4 rounded-b-9xl">
            <div className="flex flex-col">
              <div className="font-bold text-sm text-neutral-900 break-normal [overflow-wrap:anywhere]" data-testid="link-preview-title">
                {metaData?.title}
              </div>
              <div className="text-xs text-neutral-500 font-normal mt-2 break-normal [overflow-wrap:anywhere] line-clamp-1" data-testid="preview-link">
                {previewUrl}
              </div>
            </div>
            {previewUrl && (
              <Link
                to={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs py-1 w-[80px] h-[28px] flex justify-center items-center bg-white border border-neutral-300 font-bold rounded-9xl"
              >
                {t('viewLink')}
              </Link>
            )}
          </div>
        </>
      )
    } else {
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
            className={`w-full ${isAnnouncementWidgetPreview ? 'h-20' : 'h-[180px]'} object-cover rounded-t-9xl`}
            data-testid="createpost-sharedlink-img"
          />
          <div className={`${isAnnouncementWidgetPreview ? 'hidden' : 'flex'} flex-col bg-neutral-50 p-4 rounded-s-9xl`}>
            <div className="font-bold text-sm text-neutral-900 break-normal [overflow-wrap:anywhere]" data-testid="createpost-sharedlink-title">
              {metaData?.title}
            </div>
            <div className="text-xs text-neutral-500 font-normal mt-2 break-normal [overflow-wrap:anywhere] line-clamp-1" data-testid="createpost-sharedlink">
              {metaData?.url}
            </div>
          </div>
        </a>
      )
    }
  }
  return renderCardInfo();
};

export default ImagePreview;
