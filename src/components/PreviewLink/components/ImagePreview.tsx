import React from 'react';
import { Metadata } from '../types';
import Card from 'components/Card';

type ImagePreviewProps = {
  metaData: Metadata;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ metaData }) => {
  return (
    <a href={metaData.url} target="_blank" rel="noreferrer">
      <img
        src={metaData?.image}
        alt={metaData?.title}
        className="w-full h-[180px] rounded-9xl object-cover"
      />
      <div className="flex flex-col bg-neutral-50 p-4 rounded-s-9xl">
        <div className="font-bold text-sm text-neutral-900">
          {metaData?.title}
        </div>
        <div className="text-xs text-neutral-500 font-normal mt-2">
          {metaData?.url}
        </div>
      </div>
    </a>
  );
};

export default ImagePreview;
