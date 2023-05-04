import React from 'react';
import { Metadata } from '../types';
import Card from 'components/Card';
import ClosePreview from './ClosePreview';

type ImagePreviewProps = {
  metaData: Metadata;
  setPreviewUrl: (previewUrl: string) => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  metaData,
  setPreviewUrl,
}) => {
  return (
    <Card className="mx-6 mb-9">
      <div className="relative">
        <img
          src={
            metaData?.open_graph?.images && metaData?.open_graph?.images[0]?.url
          }
          alt={metaData?.title}
          className="w-full h-40 rounded-md object-cover"
        />
        <ClosePreview setPreviewUrl={setPreviewUrl} />
      </div>
      <div className="flex flex-col bg-neutral-50 p-4">
        <div className="font-bold text-sm text-neutral-900">
          {metaData?.title}
        </div>
        <div className="text-xs text-neutral-500 font-normal mt-2">
          {metaData?.canonical_url}
        </div>
      </div>
    </Card>
  );
};

export default ImagePreview;
