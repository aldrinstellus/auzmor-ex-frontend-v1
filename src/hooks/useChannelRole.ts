import useAuth from './useAuth';
import { CHANNEL_ROLE, useChannelStore } from 'stores/channelStore';
import useRole from './useRole';

export const useChannelRole = (channelId: any) => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const channel = useChannelStore((action) => action.getChannel)(channelId);

  return {
    isUserAdminOrChannelAdmin:
      channel?.member?.role == CHANNEL_ROLE.Admin || isAdmin,
    isChannelAdmin: channel?.member?.role == CHANNEL_ROLE.Admin,
    isChannelMember: channel?.member?.role == CHANNEL_ROLE.Member,
    isChannelJoined:
      channel?.member?.role == CHANNEL_ROLE.Admin ||
      channel?.member?.role == CHANNEL_ROLE.Member,
    isChannelOwner: user?.id === channel?.createdBy?.userId,
    isAdmin: isAdmin,
  };
};
