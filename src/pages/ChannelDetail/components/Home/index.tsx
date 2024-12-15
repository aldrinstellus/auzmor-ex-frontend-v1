import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import Feed from 'components/Feed';
import { ChannelRequestWidgetModeEnum } from 'components/ChannelRequestWidget/components/ChannelWidgetUser';
import { FeedModeEnum } from 'stores/feedStore';
import { useChannelRole } from 'hooks/useChannelRole';
import { ChannelPermissionEnum } from '../utils/channelPermission';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';

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
      leftWidgets={[ComponentEnum.ChannelLinksWidget]}
      rightWidgets={[
        ComponentEnum.ChannelRequestWidget,
        ComponentEnum.ChannelMembersWidget,
        ComponentEnum.ChannelAdminsWidget,
      ]}
      widgetProps={{
        [ComponentEnum.ChannelLinksWidget]: {
          canEdit: permissions.includes(ChannelPermissionEnum.CanEditSettings),
        },
        [ComponentEnum.ChannelMembersWidget]: { channelData, permissions },
        [ComponentEnum.ChannelRequestWidget]: {
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
