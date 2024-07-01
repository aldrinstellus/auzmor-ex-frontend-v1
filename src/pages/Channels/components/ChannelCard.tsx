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
  ChannelVisibilityEnum,
  IChannel,
  useChannelStore,
} from 'stores/channelStore';
import DefaultCoverImage from 'images/png/CoverImage.png';
import { useNavigate } from 'react-router-dom';
import { Variant } from 'components/IconButton';
import { useMutation } from '@tanstack/react-query';
import { deleteJoinChannelRequest, joinChannelRequest } from 'queries/channel';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useTranslation } from 'react-i18next';
import queryClient from 'utils/queryClient';

interface IChannelCardProps {
  channel: IChannel;
}

const ChannelCard: FC<IChannelCardProps> = ({ channel }) => {
  const { t } = useTranslation('channels');
  const updateChannel = useChannelStore((state) => state.updateChannel);
  const navigate = useNavigate();

  const showRequestBtn =
    channel.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channel.member &&
    !!!channel.joinRequest;
  const showJoinChannelBtn =
    channel.settings?.visibility === ChannelVisibilityEnum.Public &&
    !!!channel.member &&
    !!!channel.joinRequest;
  const showWithdrawBtn =
    channel.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channel.member &&
    !!channel.joinRequest;

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
        joinRequest: { ...channel.joinRequest, id: data.id },
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
        joinRequest: { ...channel.joinRequest, id: undefined },
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
      <Card className="flex flex-col gap-2 relative group-focus-within/channel-card:shadow-xl">
        <div className="w-full h-[80px] bg-slate-500 rounded-t-9xl">
          {channel.banner ? (
            <div className="w-full h-full relative">
              <img
                className="object-cover h-full w-full rounded-t-9xl"
                src={channel.banner?.original}
              />
              <div className="w-full h-full bg-black top-0 left-0 absolute rounded-t-9xl opacity-30"></div>
            </div>
          ) : (
            <img
              className="object-cover h-full w-full rounded-t-9xl"
              src={DefaultCoverImage}
              alt="Channel Cover Image"
            />
          )}
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
          <p className="text-xxs text-neutral-500 line-clamp-2 h-7">
            {channel?.description}
          </p>
          {showRequestBtn && (
            <Button
              label={t('privateChannel.joinRequestCTA')}
              size={ButtonSize.ExtraSmall}
              variant={ButtonVariant.Secondary}
              className="mt-2"
              leftIcon={'lock'}
              iconColor={'text-neutal-900'}
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
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                withdrawJoinChannelRequest.mutate(channel.joinRequest.id!);
              }}
            />
          )}
          {showJoinChannelBtn && (
            <div className="flex  w-full mt-2">
              <Button
                label={t('publicChannel.joinRequestCTA')}
                size={ButtonSize.ExtraSmall}
                variant={Variant.Secondary}
                className="w-full"
                loading={joinChannelMutation.isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  joinChannelMutation.mutate(channel.id);
                }}
              />
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full absolute left-4 top-[52px] bg-blue-300 border border-white z-0 flex justify-center items-center">
          <Icon name={'chart'} size={16} color="text-white" hover={false} />
        </div>
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
