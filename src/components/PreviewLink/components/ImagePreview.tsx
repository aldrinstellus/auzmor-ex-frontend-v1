import { FC } from 'react';
import { Metadata } from 'interfaces';

type ImagePreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
  isAnnouncementWidgetPreview?: boolean;
};

const ImagePreview: FC<ImagePreviewProps> = ({
  metaData,
  dataTestId,
  isAnnouncementWidgetPreview,
}) => {
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
        } object-cover rounded-t-9xl`}
        data-testid="createpost-sharedlink-img"
      />
      <div
        className={`${
          isAnnouncementWidgetPreview ? 'hidden' : 'flex'
        } flex-col bg-neutral-50 p-4 rounded-s-9xl`}
      >
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
      </div>
    </a>
  );
};

export default ImagePreview;
