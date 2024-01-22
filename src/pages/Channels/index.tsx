import Button from 'components/Button';
import Card from 'components/Card';
import { FC } from 'react';
import ChannelCard from './components/ChannelCard';
import { IChannel, useChannelStore } from 'stores/channelStore';

interface IChannelsProps {}

export const Channels: FC<IChannelsProps> = () => {
  const getChannels = useChannelStore((state) => state.getChannels);
  return (
    <Card className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-neutral-900">Channels</p>
        <Button
          label="Create channel"
          leftIcon="add"
          leftIconClassName="text-white pointer-events-none group-hover:text-white"
        />
      </div>
      <div className="flex">Filters</div>
      <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
        {getChannels().map((channel: IChannel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </Card>
  );
};
