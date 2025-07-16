import { FC } from 'react';
import { Metadata } from 'interfaces';
import { useTranslation } from 'react-i18next';
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
            className="w-full px-4 pt-4 h-[88%] object-cover rounded-t-9xl"
            data-testid="preview-img"
          />
          <div className="h-[12%] flex items-center justify-between px-4 py-3 rounded-b-9xl">
            <div className="flex flex-col">
              <div className="font-bold text-sm text-neutral-900 break-normal [overflow-wrap:anywhere]" data-testid="link-preview-title">
                {metaData?.title}
              </div>
              <div className="text-xs text-neutral-500 font-normal mt-2 break-normal [overflow-wrap:anywhere] line-clamp-1" data-testid="preview-link">
                {previewUrl}
              </div>
            </div>
            {previewUrl && (
              <button
                onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                className="text-xs px-4 py-2 rounded-9xl bg-white border border-neutral-300 font-bold text-neutral-900
                          hover:bg-neutral-100 hover:border-neutral-500 hover:shadow-md transition-all duration-200"
              >
                {t('viewLink')}
              </button>
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
