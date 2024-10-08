import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import Feed, { WidgetEnum } from 'components/Feed';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';
import { FeedModeEnum } from 'stores/feedStore';
import { useChannelRole } from 'hooks/useChannelRole';
import { ChannelPermissionEnum } from '../utils/channelPermission';

type HomeProps = {
  channelData: IChannel;
  permissions: ChannelPermissionEnum[];
};
const Home: FC<HomeProps> = ({ channelData, permissions }) => {
  const { isChannelJoined } = useChannelRole(channelData.id);

  return (
    <Feed
      mode={FeedModeEnum.Channel}
      showCreatePostCard={permissions.includes(
        ChannelPermissionEnum.CanPostContent,
      )}
      showFeedFilterBar={permissions.includes(
        ChannelPermissionEnum.CanPostContent,
      )}
      emptyFeedComponent={
        !isChannelJoined ? (
          <div className="text-center pt-4"> No post is available</div>
        ) : null
      }
      isReadOnlyPost={permissions.includes(
        ChannelPermissionEnum.CanViewContentOnly,
      )}
      leftWidgets={[WidgetEnum.Links]}
      rightWidgets={[
        WidgetEnum.ChannelRequest,
        WidgetEnum.ChannelMember,
        WidgetEnum.ChannelAdmin,
      ]}
      widgetProps={{
        [WidgetEnum.Links]: {
          canEdit: permissions.includes(ChannelPermissionEnum.CanEditSettings),
        },
        [WidgetEnum.ChannelMember]: { channelData, permissions },
        [WidgetEnum.ChannelRequest]: {
          mode: ChannelRequestWidgetModeEnum.Channel,
          permissions,
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
