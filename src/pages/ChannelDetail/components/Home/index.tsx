import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import Feed, { WidgetEnum } from 'components/Feed';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';
import { FeedModeEnum } from 'stores/feedStore';
import { useChannelRole } from 'hooks/useChannelRole';

type HomeProps = {
  channelData: IChannel;
};
const Home: FC<HomeProps> = ({ channelData }) => {
  const { isChannelJoined } = useChannelRole(channelData.id);

  return (
    <Feed
      mode={FeedModeEnum.Channel}
      showCreatePostCard={isChannelJoined}
      showFeedFilterBar={isChannelJoined}
      emptyFeedComponent={
        !isChannelJoined ? (
          <div className="text-center pt-4"> No post is available</div>
        ) : null
      }
      isReadOnlyPost={!isChannelJoined}
      leftWidgets={[WidgetEnum.Links]}
      rightWidgets={[
        WidgetEnum.ChannelRequest,
        WidgetEnum.ChannelMember,
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
