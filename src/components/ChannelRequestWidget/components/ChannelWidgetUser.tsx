import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Variant, Size } from 'components/Button';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import Truncate from 'components/Truncate';
import {
  approveChannelJoinRequest,
  rejectChannelJoinRequest,
} from 'queries/channel';
import { FC, memo, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IChannelRequest, useChannelStore } from 'stores/channelStore';
import { getProfileImage } from 'utils/misc';
import queryClient from 'utils/queryClient';

export enum ChannelRequestWidgetModeEnum {
  'Feed' = 'FEED',
  'Channel' = 'CHANNEL',
}

interface IUserRowProps {
  request: IChannelRequest;
  className?: string;
  mode?: ChannelRequestWidgetModeEnum;
}

const ChannelWidgetUserRow: FC<IUserRowProps> = ({
  request,
  className = '',
  mode = ChannelRequestWidgetModeEnum.Channel,
}) => {
  const { channelId } = useParams();
  const { id, createdBy } = request;
  const [updateChannel, getChannel] = useChannelStore((action) => [
    action.updateChannel,
    action.getChannel,
  ]);

  const approveMutation = useMutation({
    mutationKey: ['approve-channel-join-request'],
    mutationFn: () =>
      approveChannelJoinRequest(request.channel?.id || channelId!, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () => {
      successToastConfig({
        content: 'Successfully added a new member to channel',
      });
      if (channelId) {
        const channel = getChannel(channelId);
        updateChannel(channelId, {
          ...channel,
          totalMembers: channel.totalMembers + 1,
        });
      }
      queryClient.invalidateQueries(['channel-requests'], { exact: false });
      queryClient.invalidateQueries(['channel-members'], { exact: false });
    },
  });
  const rejectMutation = useMutation({
    mutationKey: ['reject-channel-join-request'],
    mutationFn: () =>
      rejectChannelJoinRequest(request?.channel?.id || channelId!, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () => {
      successToastConfig({
        content: 'Request to join channel declined successfully',
      });
      queryClient.invalidateQueries(['channel-requests'], { exact: false });
      queryClient.invalidateQueries(['channel-members'], { exact: false });
    },
  });

  const styles = useMemo(
    () =>
      clsx(
        {
          'flex flex-col gap-2 cursor-pointer': true,
        },
        {
          [className]: true,
        },
      ),
    [className],
  );
  const navigate = useNavigate();

  return (
    <div className={styles}>
      {mode === ChannelRequestWidgetModeEnum.Feed && (
        <div className="flex items-center gap-2">
          <Avatar
            name={createdBy?.fullName || ''}
            size={32}
            image={getProfileImage(createdBy)}
            dataTestId="user-profile-pic"
            onClick={() => navigate(`/users/${createdBy?.userId}`)}
          />
          <p
            data-testid="user-name"
            className="text-xs font-normal text-nowrap"
          >
            <b onClick={() => navigate(`/users/${createdBy?.userId}`)}>
              {createdBy?.fullName || ''}
            </b>{' '}
            <span>requested to join </span>
            <b>{request.channel?.name}</b>
          </p>
        </div>
      )}
      {mode === ChannelRequestWidgetModeEnum.Channel && (
        <div className="flex items-center gap-2">
          <Avatar
            name={createdBy?.fullName || ''}
            size={32}
            image={getProfileImage(createdBy)}
            dataTestId="user-profile-pic"
            onClick={() => navigate(`/users/${createdBy?.userId}`)}
            ariaLabel={createdBy?.fullName}
          />
          <div className="flex flex-col">
            <Truncate text={createdBy?.fullName} className="font-bold" />
            <Truncate
              text={createdBy?.designation || ''}
              className="text-neutral-500 text-xs"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 items-center">
        <Button
          label={'Decline'}
          variant={Variant.Secondary}
          size={Size.Small}
          loading={rejectMutation.isLoading}
          onClick={() => rejectMutation.mutate()}
        />
        <Button
          label={'Accept'}
          size={Size.Small}
          loading={approveMutation.isLoading}
          onClick={() => approveMutation.mutate()}
        />
      </div>
    </div>
  );
};

export default memo(ChannelWidgetUserRow);
