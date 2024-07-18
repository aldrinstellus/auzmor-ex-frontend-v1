import Icon from 'components/Icon';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { IChannel } from 'stores/channelStore';

type ChannelRow = {
  channel: IChannel;
  className?: string;
};
const ChannelRow: FC<ChannelRow> = ({ channel }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/channels/${channel?.id}`)}
      className="bg-neutral-100 cursor-pointer flex gap-2 items-center justify-between w-full rounded-[32px] border-solid border-neutral-200 border pt-3 pr-5 pb-3 pl-5 my-4  "
    >
      <div className="text-neutral-900   text-sm font-medium  ">
        {channel?.name}
      </div>
      <div>
        <Icon
          name={channel?.settings?.visibility ? 'website' : 'lock'}
          className="grayscale"
          size={20}
          color="text-neutral-900"
        />
      </div>
    </div>
  );
};

export default ChannelRow;
