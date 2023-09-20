import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Divider from 'components/Divider';
import { IGetUser } from 'queries/users';
import { FC } from 'react';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';

interface IUserCardProp {
  user?: IGetUser;
}

const UserCard: FC<IUserCardProp> = ({ user }) => {
  return (
    <div className="flex flex-col shadow-xl rounded-9xl bg-white min-w-[600px] overflow-hidden">
      <div className="flex"></div>
      <div className="flex flex-col px-6 py-4">
        <div className="flex">
          <div className="mr-4">
            <Avatar
              size={144}
              name={getFullName(user) || 'U'}
              image={getProfileImage(user)}
              bgColor={getAvatarColor(user)}
            />
          </div>
          <div className="flex flex-col py-4">
            <div className="text-lg font-bold text-neutral-900 truncate mb-2">
              {user?.fullName || 'Field not specified'}
            </div>
            <div className="text-sm font-normal text-neutral-500 truncate mb-2">
              {user?.designation || 'Field not specified'}
            </div>
            <div className="flex items-center mb-2">
              <div className="text-xs font-normal text-neutral-500 truncate">
                {user?.role || 'Field not specified'}
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="text-xs font-normal text-neutral-500 truncate">
                {user?.workLocation?.name || 'Field not specified'}
              </div>
            </div>
          </div>
        </div>
        <Divider className="mt-4 mb-5" />
        <div className="flex">
          <div className="flex flex-col w-1/2">
            <div className="text-sm text-neutral-500 font-bold mb-2">
              Information
            </div>
            <div className="flex justify-between mb-4">
              <div className="truncate">
                {user?.workEmail || 'Field not specified'}
              </div>
            </div>
            <div className="flex">
              <div className="truncate">
                {user?.workPhone || 'Field not specified'}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="text-sm text-neutral-500 font-bold mb-2">
              Manager
            </div>
            <div className="flex">
              <div className="mr-4">
                <Avatar
                  size={32}
                  name={getFullName(user?.manager) || 'U'}
                  image={getProfileImage(user?.manager)}
                  bgColor={getAvatarColor(user?.manager)}
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-sm font-bold text-neutral-900">
                  {user?.manager?.fullName || 'Field not specified'}
                </div>
                <div className="text-xs font-normal text-neutral-500">
                  {user?.manager?.designation || 'Field not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-6 py-6 justify-between bg-blue-50">
        <div></div>
        <div>
          <Button
            label="View Profile"
            leftIcon="profileOutline"
            iconColor="text-white"
            leftIconSize={16}
            leftIconClassName="mr-1"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
