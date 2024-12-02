import { FC } from 'react';
import Icon from 'components/Icon';
import IconWrapper, {
  Type as IconWrapperType,
} from 'components/Icon/components/IconWrapper';
import Truncate from 'components/Truncate';
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from 'components/Button';
import Card from 'components/Card';
import {
  CHANNEL_ROLE,
  ChannelVisibilityEnum,
  IChannel,
  useChannelStore,
} from 'stores/channelStore';
import useNavigate from 'hooks/useNavigation';
import { Variant } from 'components/IconButton';
import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useTranslation } from 'react-i18next';
import queryClient from 'utils/queryClient';
import ChannelBanner from './ChannelBanner';
import ChannelLogo from './ChannelLogo';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import useProduct from 'hooks/useProduct';
import useRole from 'hooks/useRole';
import useAuth from 'hooks/useAuth';

interface IChannelCardProps {
  channel: IChannel;
}

const ChannelCard: FC<IChannelCardProps> = ({ channel }) => {
  const { t } = useTranslation('channels');
  const { t: tc } = useTranslation('channelDetail');
  const updateChannel = useChannelStore((state) => state.updateChannel);
  const navigate = useNavigate();
  const { getApi } = usePermissions();
  const { isLxp } = useProduct();
  const { isAdmin } = useRole();
  const { user } = useAuth();

  const showRequestBtn =
    !(isLxp && isAdmin) &&
    channel.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channel.member &&
    !!!channel.joinRequest;
  const showInviteYourselfBtn =
    isLxp &&
    isAdmin &&
    channel.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channel.member;
  const showJoinChannelBtn =
    channel.settings?.visibility === ChannelVisibilityEnum.Public &&
    !!!channel.member &&
    !!!channel.joinRequest;
  const showWithdrawBtn =
    !(isLxp && isAdmin) &&
    channel.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channel.member &&
    !!channel.joinRequest;
  const defaulChannelDescription = t('defaultDescription', {
    visibilty: channel?.settings?.visibility,
    channelName: channel?.name,
  });

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
    <div
      className="w-full cursor-pointer outline-none group/channel-card"
      tabIndex={0}
      title={channel.name}
      onKeyUp={(e) =>
        e.code === 'Enter' ? navigate(`/channels/${channel.id}`) : ''
      }
      onClick={() => navigate(`/channels/${channel.id}`)}
    >
      <Card
        shadowOnHover
        className="h-full flex flex-col gap-2 relative group-focus-within/channel-card:shadow-xl"
      >
        <div className="w-full h-[80px] bg-slate-500 rounded-t-9xl">
          <ChannelBanner channel={channel} />
        </div>
        <div className="p-3 flex flex-col gap-1">
          <div className="flex w-full items-center">
            <Truncate
              text={channel.name}
              className="text-sm font-semibold text-neutral-900 max-w-[208px]"
            />
            {channel.settings?.visibility === ChannelVisibilityEnum.Private && (
              <Icon
                name={'lockFilled'}
                size={14}
                color="text-red-600"
                hover={false}
                className="ml-0.5"
              />
            )}
          </div>
          <p className="text-xs font-semibold text-neutral-500">
            {channel?.totalMembers} members
          </p>

          <Truncate
            text={channel?.description || defaulChannelDescription}
            className="text-xxs text-neutral-500 h-7 max-w-[208px]"
          />
          {showInviteYourselfBtn && (
            <Button
              label={t('publicChannel.joinRequestCTA')}
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Secondary}
              className="mt-2 font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                inviteYourselfMutation.mutate();
              }}
            />
          )}
          {showRequestBtn && (
            <Button
              label={t('privateChannel.joinRequestCTA')}
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Secondary}
              className="mt-2 font-semibold"
              leftIcon={'lock'}
              leftIconClassName={'text-neutral-900'}
              leftIconSize={16}
              leftIconHover={false}
              onClick={(e) => {
                e.stopPropagation();
                joinChannelMutation.mutate(channel.id);
              }}
            />
          )}
          {showWithdrawBtn && (
            <Button
              label={t('privateChannel.withdrawRequestCTA')}
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Secondary}
              className="mt-2 font-semibold text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                withdrawJoinChannelRequest.mutate(channel.joinRequest!.id!);
              }}
            />
          )}
          {showJoinChannelBtn && (
            <div className="flex  w-full mt-2">
              <Button
                label={t('publicChannel.joinRequestCTA')}
                size={ButtonSize.ExtraSmall}
                variant={Variant.Secondary}
                className="w-full font-semibold hover:border-red-600"
                loading={joinChannelMutation.isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  joinChannelMutation.mutate(channel.id);
                }}
              />
            </div>
          )}
        </div>
        <ChannelLogo
          channel={channel}
          className="w-10 h-10 rounded-full absolute left-4 top-[52px] bg-blue-300 border border-white z-0 flex justify-center items-center"
        />
        {channel?.member?.bookmarked && (
          <IconWrapper
            type={IconWrapperType.Square}
            className="cursor-pointer h-[24px] w-[24px] absolute top-2 right-2"
            dataTestId={`contact-info-edit`}
          >
            <Icon name="starFilled" color="text-yellow-200" hover={false} />
          </IconWrapper>
        )}
      </Card>
    </div>
  );
};

export default ChannelCard;
