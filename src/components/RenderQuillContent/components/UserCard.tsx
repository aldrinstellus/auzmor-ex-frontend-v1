import Avatar from 'components/Avatar';
import Card from 'components/Card';
import React, { ReactElement } from 'react';
import CircularBorder from './CircularBorder';
import Icon from 'components/Icon';

type MentionUserCardProps = {
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
};

const UserCard: React.FC<MentionUserCardProps> = ({
  fullName,
  image,
  active,
  email,
}): ReactElement => {
  return (
    <div className="flex gap-x-4">
      <Avatar size={80} name={fullName} image={image} active={active} />
      <div className="flex flex-col gap-y-2">
        <div className="text-base text-neutral-900 font-bold">{fullName}</div>
        <div className="text-sm font-normal text-neutral-500">{email}</div>
        {/* <div className="flex items-center gap-x-2">
          <Icon name="location" color="#171717" />
          <div className="text-sm font-normal text-neutral-500">
            New York, USA
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserCard;
