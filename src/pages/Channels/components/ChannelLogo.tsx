import { clsx } from 'clsx';
import React, { FC, useMemo } from 'react';
import { IChannel } from 'stores/channelStore';
import { getChannelLogoImage } from 'utils/misc';

interface IChannelLogoProps {
  channel: IChannel;
  className?: string;
}

const ChannelLogo: FC<IChannelLogoProps> = ({ channel, className = '' }) => {
  const style = useMemo(
    () =>
      clsx({
        [className]: true,
      }),
    [className],
  );

  return (
    <div className={style}>
      <img
        className="object-cover  object-center w-full rounded-t-9xl "
        src={getChannelLogoImage(channel)}
        data-testid="channel-logo-pic"
      />
    </div>
  );
};

export default ChannelLogo;
