import { FC } from 'react';
import { Metadata } from 'interfaces';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type IconPreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
  previewUrl?: string;
  showViewLink?: boolean;
  imgHeight?: string;
  textHeight?: string;
};

const IconPreview: FC<IconPreviewProps> = ({ metaData, dataTestId, previewUrl, showViewLink, imgHeight, textHeight }) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  return (
    <a
      href={metaData?.url}
      target="_blank"
      rel="noreferrer"
      data-testid={dataTestId}
    >
      {!showViewLink ? (<div className="flex gap-5 p-2">
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
      </div>) : (
          <>
            <img
              src={metaData?.favicon}
              alt={metaData?.title}
              className={`w-full ${imgHeight}  object-contain border-b border-neutral-200 rounded-t-9xl`}
              data-testid="createpost-sharedlink-img"
            />
            <div
              className={`flex items-center justify-between bg-neutral-100 rounded-b-9xl p-4 ${textHeight}`}
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
      )}
    </a>
  );
};

export default IconPreview;
