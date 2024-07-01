import { useMutation } from '@tanstack/react-query';
import Avatar from 'components/Avatar';
import Button, { Variant } from 'components/Button';
import Icon from 'components/Icon';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import {
  approveChannelJoinRequest,
  rejectChannelJoinRequest,
} from 'queries/channel';
import React, { FC } from 'react';
import { IChannelRequest } from 'stores/channelStore';
import { getFullName, getProfileImage } from 'utils/misc';

interface IRequestRowProps {
  request: IChannelRequest;
  channelId: string;
}

const RequestRow: FC<IRequestRowProps> = ({ request, channelId }) => {
  const { createdBy, id } = request;
  const approveMutation = useMutation({
    mutationKey: ['approve-channel-join-request'],
    mutationFn: () => approveChannelJoinRequest(channelId, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () =>
      successToastConfig({
        content: 'Successfully added a new member to channel',
      }),
  });
  const rejectMutation = useMutation({
    mutationKey: ['reject-channel-join-request'],
    mutationFn: () => rejectChannelJoinRequest(channelId, id),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSuccess: () =>
      successToastConfig({
        content: 'Request to join channel rejected successfully',
      }),
  });
  return (
    <div className="flex justify-between w-full pl-2 py-2">
      <div className="flex items-center gap-4">
        <Avatar
          name={getFullName(createdBy) || 'U'}
          image={getProfileImage(createdBy)}
          size={32}
        />
        <div className="flex flex-col justify-between">
          <div className="flex gap-4">
            <p className="text-lg font-semibold text-neutral-900">
              {getFullName(createdBy) || 'User'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm font-medium text-neutral-900">
              {createdBy?.designation}
            </p>
            {createdBy?.designation && !createdBy?.workLocation && (
              <div className="w-1 h-1 bg-neutral-500 rounded-full" />
            )}
            {!createdBy?.workLocation && (
              <div className="flex gap-2 items-center">
                <Icon
                  name="location"
                  hover={false}
                  hoverColor="text-neutral-500"
                />
                <p className="text-sm font-medium text-neutral-500">
                  {createdBy?.workLocation || 'New york, USA'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          label={'Decline'}
          variant={Variant.Secondary}
          labelClassName="px-6"
          loading={rejectMutation.isLoading}
          onClick={() => rejectMutation.mutate()}
        />
        <Button
          label={'Accept'}
          labelClassName="px-6"
          loading={approveMutation.isLoading}
          onClick={() => approveMutation.mutate()}
        />
      </div>
    </div>
  );
};

export default RequestRow;
