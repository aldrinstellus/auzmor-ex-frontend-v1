import useAuth from './useAuth';
import { CHANNEL_ROLE, IChannel } from 'stores/channelStore';
import useRole from './useRole';

export const useChannelRole = (channel: IChannel) => {
  const { user } = useAuth();
  const { isAdmin } = useRole();

  return {
    isUserAdminOrChannelAdmin:
      channel?.member?.role == CHANNEL_ROLE.Admin || isAdmin,
    isChannelAdmin: channel?.member?.role == CHANNEL_ROLE.Admin,
    isMember: channel?.member?.role == CHANNEL_ROLE.Member,
    isChannelOwner: user?.id === channel?.createdBy?.userId,
  };
};
