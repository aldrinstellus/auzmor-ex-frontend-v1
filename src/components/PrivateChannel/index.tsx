import Card from 'components/Card';
import { FC } from 'react';
import PrivateChannelImage from 'images/png/PrivateChannelBanner.png';
import Button, { Variant } from 'components/Button';
import AvatarChips from 'components/AvatarChips';
import { useTranslation } from 'react-i18next';
import {
  deleteJoinChannelRequest,
  joinChannelRequest,
  useInfiniteChannelMembers,
} from 'queries/channel';
import { Role } from 'utils/enum';
import { IAvatarUser } from 'components/AvatarChip';
import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import {
  ChannelVisibilityEnum,
  IChannel,
  useChannelStore,
} from 'stores/channelStore';
import queryClient from 'utils/queryClient';

const CHIPS_COUNT = 7;

interface IChannelBannerProps {
  isRequested?: boolean;
  channel: IChannel;
}

const PrivateChannelBanner: FC<IChannelBannerProps> = ({
  channel,
  isRequested = false,
}) => {
  const updateChannel = useChannelStore((action) => action.updateChannel);
  const { t } = useTranslation('channels');
  const { data } = useInfiniteChannelMembers({
    channelId: channel.id,
    q: {
      limit: CHIPS_COUNT,
      userRole: Role.Admin,
    },
  });
  const admins = (data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((admin: any) => {
      try {
        return { id: admin.id, role: admin.role, ...admin.user };
      } catch (e) {
        console.log('Error', { admin });
      }
    });
  }) || []) as IAvatarUser[];

  // Join public/private channel request mutation
  const joinChannelMutation = useMutation({
    mutationKey: ['join-public-channel-request'],
    mutationFn: (channelId: string) => joinChannelRequest(channelId),
    onError: () =>
      failureToastConfig({
        content: t('joinRequestError'),
      }),
    onSuccess: async (data) => {
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

  // Withdraw join request
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
            isRequested ? 'channel-withdraw-request' : 'channel-request-to-join'
          }
        />
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
