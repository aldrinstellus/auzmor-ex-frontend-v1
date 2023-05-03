import React from 'react';
import { Metadata } from '../types';
import Card from 'components/Card';
import Icon from 'components/Icon';

type ImagePreviewProps = {
  metaData: Metadata;
  setShowPreview: (show: boolean) => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  metaData,
  setShowPreview,
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
        <button
          className="absolute top-0 right-0 p-2 bg-white border-1 border-neutral-200 border-solid rounded-7xl m-4 h-8 w-8"
          onClick={() => {
            setShowPreview(false);
          }}
        >
          <Icon name="cancel" size={10} />.
        </button>
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
