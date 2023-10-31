import { FC } from 'react';
import { Metadata } from '../types';

type IconPreviewProps = {
  metaData: Metadata;
  dataTestId?: string;
};

const IconPreview: FC<IconPreviewProps> = ({ metaData, dataTestId }) => {
  return (
    <a
      href={metaData?.url}
      target="_blank"
      rel="noreferrer"
      data-testid={dataTestId}
    >
      <div className="flex gap-5 p-2">
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
      </div>
    </a>
  );
};

export default IconPreview;
