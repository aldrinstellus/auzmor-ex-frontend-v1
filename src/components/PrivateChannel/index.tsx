import Card from 'components/Card';
import { FC } from 'react';
import PrivateChannelImage from 'images/png/PrivateChannelBanner.png';
import Button, { Variant } from 'components/Button';
import AvatarChips from 'components/AvatarChips';
import { useTranslation } from 'react-i18next';
import { IAvatarUser } from 'components/AvatarChip';
import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import {
  CHANNEL_ROLE,
  ChannelVisibilityEnum,
  IChannel,
  useChannelStore,
} from 'stores/channelStore';
import queryClient from 'utils/queryClient';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { ChannelPermissionEnum } from 'pages/ChannelDetail/components/utils/channelPermission';
import useAuth from 'hooks/useAuth';
import useProduct from 'hooks/useProduct';

const CHIPS_COUNT = 7;

interface IChannelBannerProps {
  isRequested?: boolean;
  permissions: ChannelPermissionEnum[];
  channel: IChannel;
}

const PrivateChannelBanner: FC<IChannelBannerProps> = ({
  channel,
  permissions,
  isRequested = false,
}) => {
  const updateChannel = useChannelStore((action) => action.updateChannel);
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('channelDetail');
  const { user } = useAuth();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();
  const useInfiniteChannelMembers = getApi(ApiEnum.GetChannelMembers);
  const { data } = useInfiniteChannelMembers({
    channelId: channel.id,
    q: {
      limit: CHIPS_COUNT,
      userRole: CHANNEL_ROLE.Admin,
    },
  });
  const admins = (data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((admin: any) => {
      try {
        return { id: admin.id, role: admin.role, ...admin.user };
      } catch (e) {
        console.log('Error', { admin });
      }
    });
  }) || []) as IAvatarUser[];

  // Join public/private channel request mutation
  const joinChannelRequest = getApi(ApiEnum.CreateJoinChannelRequest);
  const joinChannelMutation = useMutation({
    mutationKey: ['join-public-channel-request'],
    mutationFn: (channelId: string) => joinChannelRequest(channelId),
    onError: () =>
      failureToastConfig({
        content: t('joinRequestError'),
      }),
    onSuccess: async (data: any) => {
      successToastConfig({
        content:
          channel.settings?.visibility === ChannelVisibilityEnum.Private
            ? t('joinPrivateChannelRequestSuccess')
            : t('joinPublicChannelRequestSuccess'),
      });
      await queryClient.invalidateQueries(['channel'], { exact: false });
      updateChannel(channel.id, {
        ...channel,
        joinRequest: { ...data.result.data.joinRequest },
      });
    },
  });

  // Join as Admin
  const inviteYourSelf = getApi(ApiEnum.AddChannelMembers);
  const inviteYourselfMutation = useMutation({
    mutationKey: ['add-channel-members', channel.id],
    mutationFn: () =>
      inviteYourSelf(channel.id, {
        users: [{ id: user!.id, role: CHANNEL_ROLE.Admin }],
      }),
    onError: () => {
      failureToastConfig({
        content: tc('joinAsAdmin.failure'),
      });
    },
    onSuccess: () => {
      successToastConfig({
        content: tc('joinAsAdmin.success'),
      });
      queryClient.invalidateQueries(['channel']);
    },
  });

  // Withdraw join request
  const deleteJoinChannelRequest = getApi(ApiEnum.DeleteJoinChannelRequest);
  const withdrawJoinChannelRequest = useMutation({
    mutationKey: ['withdraw-join-request'],
    mutationFn: (joinId: string) =>
      deleteJoinChannelRequest(channel.id, joinId),
    onError: () =>
      failureToastConfig({
        content: t('withdrawRequestError'),
      }),
    onSuccess: async () => {
      successToastConfig({ content: t('withdrawRequestSuccess') });
      await queryClient.invalidateQueries(['channel'], { exact: false });
      updateChannel(channel.id, {
        ...channel,
        joinRequest: null,
      });
    },
  });

  return (
    <Card>
      <div className="flex flex-col items-center justify-center p-8 ">
        <img src={PrivateChannelImage} alt="private channel banner" />
        <div
          className="text-2xl font-bold mt-8 mb-4"
          data-testid={'channel--privacynote'}
        >
          {t('privateChannel.bannerHeader')}
        </div>
        {isLxp && permissions.includes(ChannelPermissionEnum.CanInviteSelf) ? (
          <Button
            label={t('publicChannel.joinRequestCTA')}
            variant={Variant.Primary}
            onClick={() => inviteYourselfMutation.mutate()}
            loading={inviteYourselfMutation.isLoading}
            data-testid="channel-invite-your-self"
          />
        ) : (
          <Button
            label={
              isRequested
                ? t('privateChannel.withdrawRequestCTA')
                : t('privateChannel.joinRequestCTA')
            }
            variant={isRequested ? Variant.Danger : Variant.Primary}
            onClick={
              isRequested
                ? () =>
                    withdrawJoinChannelRequest.mutate(channel.joinRequest!.id!)
                : () => joinChannelMutation.mutate(channel.id)
            }
            loading={
              joinChannelMutation.isLoading ||
              withdrawJoinChannelRequest.isLoading
            }
            data-testid={
              isRequested
                ? 'channel-withdraw-request'
                : 'channel-request-to-join'
            }
          />
        )}
        <div
          className="text-neutral-500 mt-[80px] underline  mb-4 text-sm font-semibold"
          data-testid={'channel-admin-list'}
        >
          {t('privateChannel.bannerFotter')}
        </div>
        <AvatarChips
          users={admins}
          showCount={CHIPS_COUNT}
          dataTestId={'channel-admin-list-'}
        />
      </div>
    </Card>
  );
};

export default PrivateChannelBanner;
