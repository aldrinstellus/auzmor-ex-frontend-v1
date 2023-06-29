import React from 'react';
import { Metadata } from '../types';

type ImagePreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  metaData,
  dataTestId,
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
        className="w-full h-[180px] rounded-9xl object-cover"
        data-testid="createpost-sharedlink-img"
      />
      <div className="flex flex-col bg-neutral-50 p-4 rounded-s-9xl">
        <div
          className="font-bold text-sm text-neutral-900"
          data-testid="createpost-sharedlink-title"
        >
          {metaData?.title}
        </div>
        <div
          className="text-xs text-neutral-500 font-normal mt-2"
          data-testid="createpost-sharedlink"
        >
          {metaData?.url}
        </div>
      </div>
    </a>
  );
};

export default ImagePreview;
