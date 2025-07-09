import { FC } from 'react';
import { Metadata } from 'interfaces';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PREVIEW_CARD_VARIANT } from 'utils/constants';

type IconPreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
  previewUrl?: string;
  variant?: string;
};

const IconPreview: FC<IconPreviewProps> = ({ metaData, dataTestId, previewUrl, variant}) => {
  const { t } = useTranslation('common');
  const renderCardInfo = () => {
    if (variant === PREVIEW_CARD_VARIANT.document) {
      return (
        <>
          <img
            src={metaData?.favicon}
            alt={metaData?.title}
            className="w-full h-[480px] object-contain p-4 rounded-t-9xl bg-neutral-100 border-[16px] border-white"
            data-testid="preview-img"
          />
          <div className="flex items-center bg-white justify-between rounded-b-9xl p-4">
            <div className="flex flex-col">
              <div className="font-bold text-sm text-neutral-900 break-normal [overflow-wrap:anywhere]" data-testid="preview-link-title">
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
                className="text-xs py-1 px-2 flex bg-white border border-neutral-300 font-bold rounded-full"
              >
                {t('viewLink')}
              </Link>
            )}
          </div>
        </>
      );
    } else {
      return (
        <a
          href={metaData?.url}
          target="_blank"
          rel="noreferrer"
          data-testid={dataTestId}
        >
          <div className="flex gap-5 p-2">
            <img
              src={metaData?.favicon}
              alt={metaData?.title}
              className="w-12 h-12 rounded-7xl"
            />
            <div className="flex flex-col justify-center">
              <div className="text-black text-sm font-bold break-normal [overflow-wrap:anywhere]">
                {metaData?.title}
              </div>
              <div className="text-[#666666] font-normal text-xs break-normal [overflow-wrap:anywhere] line-clamp-1">
                {metaData?.url}
              </div>
            </div>
          </div>
        </a>
      )
    }
  }
  return renderCardInfo();
};

export default IconPreview;
