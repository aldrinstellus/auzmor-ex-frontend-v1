import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import Feed, { WidgetEnum } from 'components/Feed';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';
import { FeedModeEnum } from 'stores/feedStore';

type HomeProps = {
  channelData: IChannel;
};
const Home: FC<HomeProps> = ({ channelData }) => {
  const isMember = !!channelData?.member;
  return (
    <Feed
      showCreatePostCard={isMember}
      showFeedFilterBar={isMember}
      emptyFeedComponent={
        !isMember ? (
          <div className="text-center pt-4"> No post is available</div>
        ) : null
      }
      isReadOnlyPost={!isMember}
      mode={FeedModeEnum.Channel}
      leftWidgets={[WidgetEnum.Links]}
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
