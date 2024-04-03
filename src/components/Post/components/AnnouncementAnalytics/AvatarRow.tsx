import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import { FC, Fragment } from 'react';

type AppProps = {
  profileImage: Record<string, string>;
  fullName: string;
  workEmail: string;
  department: Record<string, string>;
  workLocation: Record<string, string>;
  designation?: Record<string, string>;
};

const AvatarRow: FC<AppProps> = ({
  fullName,
  workEmail,
  profileImage,
  department,
  workLocation,
  designation,
}) => {
  const { isLxp } = useProduct();
  return (
    <div className="pl-6 py-4 flex items-center">
      <div className="flex items-center w-[260px]">
        <Avatar
          name={fullName}
          image={profileImage?.small || profileImage?.original}
          size={32}
        />
        <div className="pl-4">
          <div className="text-sm font-bold text-neutral-900">{fullName}</div>
          <div className="text-xs text-neutral-500">{workEmail}</div>
        </div>
      </div>

      {isLxp ? (
        <div className="text-xs text-neutral-500">
          {designation?.name || '-'}
        </div>
      ) : (
        <Fragment>
          <div className="flex items-center space-x-1 w-[150px]">
            <Icon name="briefcase" size={16} />
            <div className="text-xs text-neutral-500">
              {department?.name || '-'}
            </div>
          </div>
          <div className="h-1 w-1 rounded-full bg-neutral-500 relative" />
          <div className="flex items-center space-x-1 pl-3">
            <Icon name="location" size={16} />
            <div className="text-xs text-neutral-500">
              {workLocation?.name || '-'}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AvatarRow;
