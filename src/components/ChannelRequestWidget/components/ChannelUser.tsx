import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import {
  approveChannelJoinRequest,
  rejectChannelJoinRequest,
} from 'queries/channel';
import { FC, useMemo } from 'react';
import { IChannelRequest } from 'stores/channelStore';
import { getProfileImage } from 'utils/misc';
import queryClient from 'utils/queryClient';

interface IUserRowProps {
  request: IChannelRequest;
  onClick?: () => void;
  className?: string;
}

const ChannelUserRow: FC<IUserRowProps> = ({ request, className = '' }) => {
  const { createdBy, id } = request;
  const approveMutation = useMutation({
    mutationKey: ['approve-channel-join-request'],
    mutationFn: () => approveChannelJoinRequest(request.channel.id, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () => {
      successToastConfig({
        content: 'Successfully added a new member to channel',
      });
      queryClient.invalidateQueries(['channel-requests'], { exact: false });
    },
  });
  const rejectMutation = useMutation({
    mutationKey: ['reject-channel-join-request'],
    mutationFn: () => rejectChannelJoinRequest(request.channel.id, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () => {
      successToastConfig({
        content: 'Request to join channel rejected successfully',
      });
      queryClient.invalidateQueries(['channel-requests'], { exact: false });
    },
  });
  const styles = useMemo(
    () =>
      clsx(
        {
          'flex items-center w-full': true,
        },
        {
          [className]: true,
        },
      ),
    [className],
  );
  return (
    <div className={styles}>
      <div className="flex items-center gap-2 flex-1">
        <Avatar
          name={createdBy?.fullName || ''}
          size={32}
          image={getProfileImage(createdBy)}
          dataTestId="user-profile-pic"
        />
        <div className="flex flex-col  truncate">
          <div
            data-testid="user-name"
            className="text-sm font-normal break-all"
          >
            <b>{createdBy?.fullName || ''}</b> <span>requested to join </span>
            <b>{request?.channel?.name}</b>
          </div>
          <div
            data-testid="user-email"
            className="text-neutral-500 space-x-1 pt-1 text-xs font-medium flex items-center"
          >
            {createdBy.designation || 'Not specified'}
            <div className="w-1 h-1 ml-1 bg-neutral-500 rounded-full" />
            <Icon name="location" size={16} />
            <div
              data-testid="user-location"
              className="text-neutral-500 text-xs"
            >
              {createdBy.workLocation || 'Not specified'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 items-center">
        <Button
          label={'Decline'}
          variant={Variant.Secondary}
          size={Size.Small}
          loading={rejectMutation.isLoading}
          onClick={() => rejectMutation.mutate()}
          dataTestId={`requestwidget-${request.channel.name}-decline`}
        />
        <Button
          label={'Accept'}
          size={Size.Small}
          loading={approveMutation.isLoading}
          onClick={() => approveMutation.mutate()}
          dataTestId={`requestwidget-viewall-${request.channel.name}-decline`}
        />
      </div>
    </div>
  );
};

export default ChannelUserRow;
