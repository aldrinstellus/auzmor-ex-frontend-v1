import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import IconWrapper from 'components/Icon/components/IconWrapper';
import { IGetUser } from 'queries/users';
import { FC } from 'react';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';

export enum UsercardVariant {
  Small = 'SMALL',
  Large = 'LARGE',
}

interface IUserCardProp {
  user?: IGetUser;
  variant?: UsercardVariant;
}

const UserCard: FC<IUserCardProp> = ({
  user,
  variant = UsercardVariant.Small,
}) => {
  switch (variant) {
    case UsercardVariant.Small:
      return (
        <div className="flex items-start h-20">
          <div className="mr-4">
            <Avatar
              size={80}
              name={getFullName(user) || 'U'}
              image={getProfileImage(user)}
              bgColor={getAvatarColor(user)}
              dataTestId="usercard-profilepic"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="text-base font-bold text-neutral-900 truncate">
              {user?.fullName || 'Field not specified'}
            </div>
            <div className="text-sm font-normal text-neutral-500 truncate">
              {user?.workEmail || 'Field not specified'}
            </div>
            <div className="flex items-center">
              <Icon
                name="location"
                size={16}
                hover={false}
                color="text-neutral-900"
                className="mr-2"
              />
              <div className="flex items-center">
                <div
                  className="text-xs font-normal text-neutral-500 truncate"
                  data-testid="usercard-location"
                >
                  {user?.workLocation?.name || 'Field not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case UsercardVariant.Large:
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
                  dataTestId="usercard-profilepic"
                />
              </div>
              <div className="flex flex-col py-4">
                <div
                  className="text-lg font-bold text-neutral-900 truncate mb-2"
                  data-testid="usercard-name"
                >
                  {user?.fullName || 'Field not specified'}
                </div>
                <div
                  className="text-sm font-normal text-neutral-500 truncate mb-2"
                  data-testid="usercard-position"
                >
                  {user?.designation || 'Field not specified'}
                </div>
                <div className="flex items-center mb-2">
                  <IconWrapper className="rounded-6xl p-[3px] mr-3">
                    <Icon name="briefcase" size={16} hover={false} />
                  </IconWrapper>
                  <div className="flex items-center">
                    <div
                      className="text-xs font-normal text-neutral-500 truncate"
                      data-testid="usercard-department"
                    >
                      {user?.role || 'Field not specified'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <IconWrapper className="rounded-6xl p-[3px] mr-3">
                    <Icon name="location" size={16} hover={false} />
                  </IconWrapper>
                  <div className="flex items-center">
                    <div
                      className="text-xs font-normal text-neutral-500 truncate"
                      data-testid="usercard-location"
                    >
                      {user?.workLocation?.name || 'Field not specified'}
                    </div>
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
                <div className="flex items-center mb-4">
                  <IconWrapper className="rounded-6xl p-[3px] mr-3">
                    <Icon name="mail" size={16} hover={false} />
                  </IconWrapper>
                  <div className="truncate" data-testid="usercard-email">
                    {user?.workEmail || 'Field not specified'}
                  </div>
                </div>
                <div className="flex items-center">
                  <IconWrapper className="rounded-6xl p-[3px] mr-3">
                    <Icon name="call" size={16} hover={false} />
                  </IconWrapper>
                  <div className="truncate" data-testid="usercard-number">
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
                      dataTestId="usercard-manager-profilepic"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div
                      className="text-sm font-bold text-neutral-900"
                      data-testid="usercard-manager-name"
                    >
                      {user?.manager?.fullName || 'Field not specified'}
                    </div>
                    <div
                      className="text-xs font-normal text-neutral-500"
                      data-testid="usercard-manager-position"
                    >
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
                dataTestId="usercard-viewprofile"
              />
            </div>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default UserCard;
