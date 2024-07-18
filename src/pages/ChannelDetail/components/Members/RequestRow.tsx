import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import React, { FC } from 'react';
import { IChannelRequest } from 'stores/channelStore';
import { getFullName, getProfileImage } from 'utils/misc';

interface IRequestRowProps {
  request: IChannelRequest;
}

const RequestRow: FC<IRequestRowProps> = ({ request }) => {
  const { createdBy } = request;
  return (
    <div className="flex items-center gap-4">
      <Avatar
        name={getFullName(createdBy) || 'U'}
        image={getProfileImage(createdBy)}
        size={32}
      />
      <p className="text-lg font-semibold text-neutral-900 flex w-[43%]">
        {getFullName(createdBy) || 'User'}
        {createdBy?.department && (
          <span className="text-sm font-medium text-neutral-900 flex">
            {createdBy?.department || 'Not specified'}
          </span>
        )}
      </p>

      <p className="text-sm font-medium text-neutral-900 flex w-[30%]">
        {createdBy?.designation || 'Not specified'}
      </p>
      {!createdBy?.workLocation ? (
        <div className="flex gap-2 items-center w-[20%]">
          <Icon name="location" hover={false} hoverColor="text-neutral-500" />
          <p className="text-sm font-medium text-neutral-500">
            {createdBy?.workLocation || 'New york, USA'}
          </p>
        </div>
      ) : (
        <p className="text-sm font-medium text-neutral-500 w-[10%]">
          Not specified
        </p>
      )}
    </div>
  );
};

export default RequestRow;
