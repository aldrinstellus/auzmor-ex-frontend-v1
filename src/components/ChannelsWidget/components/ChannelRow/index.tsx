import Icon from 'components/Icon';
import React, { FC } from 'react';

type ChannelRow = {
  channel: any;
  isPublic?: boolean;
  className?: string;
  onChannelClick?: () => void;
};

const ChannelRow: FC<ChannelRow> = ({
  channel,
  onChannelClick,
  isPublic = true,
}) => {
  return (
    <div
      onClick={() => onChannelClick}
      className="bg-neutral-100 cursor-pointer flex gap-2 items-center justify-between w-full rounded-[32px] border-solid border-neutral-200 border pt-3 pr-5 pb-3 pl-5  "
    >
      <div className="text-neutral-900   text-sm font-medium  ">
        {channel?.name || 'dummy channel'}
      </div>
      <div>
        <Icon
          name={isPublic ? 'website' : 'lock'}
          className="grayscale"
          size={20}
          color="text-neutral-900"
        />
      </div>
    </div>
  );
};

export default ChannelRow;
