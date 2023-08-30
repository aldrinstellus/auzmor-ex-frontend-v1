import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import React from 'react';

type AppProps = {
  profileImage: Record<string, string>;
  firstName: string;
  lastName: string;
  workEmail: string;
  department: string;
  workLocation: string;
};

const AvatarRow: React.FC<AppProps> = ({
  firstName,
  lastName,
  workEmail,
  profileImage,
  department,
  workLocation,
}) => {
  return (
    <div className="pl-6 py-4 flex items-start">
      <div className="flex items-center w-[260px]">
        <Avatar
          name={`${firstName} ${lastName || ''}`}
          image={profileImage?.small || profileImage?.original}
          size={32}
        />
        <div className="pl-4">
          <div className="text-sm font-bold text-neutral-900">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-neutral-500">{workEmail}</div>
        </div>
      </div>

      <div className="flex items-center space-x-1 w-[150px]">
        <Icon name="briefcase" size={16} />
        <div className="text-xs text-neutral-500">{department || '-'}</div>
      </div>
      <div className="h-1 w-1 rounded-full bg-neutral-500 relative top-1.5" />
      <div className="flex items-center space-x-1 pl-3">
        <Icon name="location" size={16} />
        <div className="text-xs text-neutral-500">{workLocation || '-'}</div>
      </div>
    </div>
  );
};

export default AvatarRow;
