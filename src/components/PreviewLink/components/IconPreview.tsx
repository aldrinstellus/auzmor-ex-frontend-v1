import React from 'react';
import { Metadata } from '../types';

type IconPreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
};

const IconPreview: React.FC<IconPreviewProps> = ({ metaData, dataTestId }) => {
  return (
    <a
      href={metaData?.url}
      target="_blank"
      rel="noreferrer"
      data-testid={dataTestId}
    >
      <div className="flex p-8">
        <img
          src={metaData?.favicon}
          alt={metaData?.title}
          className="w-[100px] h-[80px] rounded-7xl"
        />
        <div className="flex flex-col ml-5 space-y-2 justify-center">
          <div className="text-black text-sm font-bold">{metaData?.title}</div>
          <div className="text-[#666666] font-normal text-xs">
            {metaData?.url}
          </div>
        </div>
      </div>
    </a>
  );
};

export default IconPreview;
