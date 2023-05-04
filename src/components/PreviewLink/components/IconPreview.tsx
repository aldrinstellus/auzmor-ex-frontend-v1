import Card from 'components/Card';
import React from 'react';
import { Metadata } from '../types';
import ClosePreview from './ClosePreview';

type IconPreviewProps = {
  metaData: Metadata;
  setPreviewUrl: (previewUrl: string) => void;
  setIsPreviewRemove: (isPreviewRemove: boolean) => void;
};

const IconPreview: React.FC<IconPreviewProps> = ({
  metaData,
  setPreviewUrl,
  setIsPreviewRemove,
}) => {
  return (
    <Card className="bg-[#F7F8FB] h-40 mx-6 mb-11 relative">
      <a href={metaData?.url} target="_blank" rel="noreferrer">
        <div className="flex p-8">
          <img
            src={metaData?.favicon}
            alt={metaData?.title}
            className="w-11 h-11"
          />
          <div className="flex flex-col ml-5 space-y-2">
            <div className="text-black text-sm font-bold">
              {metaData?.title}
            </div>
            <div className="text-[#666666] font-normal text-xs">
              {metaData?.url}
            </div>
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

export default IconPreview;
