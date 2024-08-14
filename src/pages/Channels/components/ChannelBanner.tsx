import React, { FC } from 'react';
import DefaultCoverImage from 'images/png/CoverImage.png';
import { IChannel } from 'stores/channelStore';

interface IChannelBannerProps {
  channel: IChannel;
}

const ChannelBanner: FC<IChannelBannerProps> = ({ channel }) => {
  if (channel?.banner) {
    return (
      <div className="w-full h-full relative">
        <img
          className="object-cover h-full w-full rounded-t-9xl"
          src={channel.banner?.original}
          alt="Channel Cover Banner"
        />
        <div className="w-full h-full bg-black top-0 left-0 absolute rounded-t-9xl opacity-30"></div>
      </div>
    );
  }
  return (
    <img
      className="object-cover h-full w-full rounded-t-9xl"
      src={DefaultCoverImage}
      alt="Channel Cover Image"
    />
  );
};

export default ChannelBanner;
