import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import Feed, { FeedModeEnum, WidgetEnum } from 'components/Feed';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';

type HomeProps = {
  channelData: IChannel;
};
const Home: FC<HomeProps> = ({ channelData }) => {
  return (
    <Feed
      mode={FeedModeEnum.Channel}
      leftWidgets={[WidgetEnum.AppLauncher, WidgetEnum.Links]}
      rightWidgets={[
        WidgetEnum.ChannelMember,
        WidgetEnum.ChannelRequest,
        WidgetEnum.ChannelAdmin,
      ]}
      widgetProps={{
        [WidgetEnum.Links]: { channelData },
        [WidgetEnum.ChannelMember]: { channelData },
        [WidgetEnum.ChannelRequest]: {
          mode: ChannelRequestWidgetModeEnum.Channel,
        },
      }}
      modeProps={{
        [FeedModeEnum.Channel]: {
          params: {
            entityId: channelData.id,
            entityType: 'CHANNEL',
          },
          channel: channelData,
        },
      }}
    />
  );
};

export default Home;
