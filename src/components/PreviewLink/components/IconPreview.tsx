import Card from 'components/Card';
import React from 'react';
import { Metadata } from '../types';
import Icon from 'components/Icon';

type IconPreviewProps = {
  metaData: Metadata;
  setShowPreview: (show: boolean) => void;
};

const IconPreview: React.FC<IconPreviewProps> = ({
  metaData,
  setShowPreview,
}) => {
  return (
    <Card className="bg-[#F7F8FB] h-40 mx-6 mb-11">
      <div className="relative">
        <button
          className="absolute top-0 right-0 p-2 bg-white border-1 border-neutral-200 border-solid rounded-7xl m-4 h-8 w-8"
          onClick={() => {
            setShowPreview(false);
          }}
        >
          <Icon name="cancel" size={10} />.
        </button>
      </div>
      <div className="flex p-8">
        <img
          src={metaData?.favicon}
          alt={metaData?.title}
          className="w-11 h-11"
        />
        <div className="flex flex-col ml-5 space-y-2">
          <div className="text-black text-sm font-bold">{metaData?.title}</div>
          <div className="text-[#666666] font-normal text-xs">
            {metaData?.canonical_url}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IconPreview;
