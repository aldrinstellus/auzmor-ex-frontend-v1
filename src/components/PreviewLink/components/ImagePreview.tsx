import React from 'react';
import { Metadata } from '../types';
import Card from 'components/Card';
import ClosePreview from './ClosePreview';

type ImagePreviewProps = {
  metaData: Metadata;
  setPreviewUrl: (previewUrl: string) => void;
  setIsPreviewRemove: (isPreviewRemove: boolean) => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  metaData,
  setPreviewUrl,
  setIsPreviewRemove,
}) => {
  return (
    <Card className="mx-6 mb-9 cursor-pointer relative">
      <a href={metaData.url} target="_blank" rel="noreferrer">
        <img
          src={metaData?.image}
          alt={metaData?.title}
          className="w-full h-40 rounded-md object-cover"
        />
        <div className="flex flex-col bg-neutral-50 p-4">
          <div className="font-bold text-sm text-neutral-900">
            {metaData?.title}
          </div>
          <div className="text-xs text-neutral-500 font-normal mt-2">
            {metaData?.url}
          </div>
        </div>
      </a>
      <ClosePreview
        setPreviewUrl={setPreviewUrl}
        setIsPreviewRemove={setIsPreviewRemove}
      />
    </Card>
  );
};

export default ImagePreview;
