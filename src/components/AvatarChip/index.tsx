import Avatar from 'components/Avatar';
import {
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import useAuth from 'hooks/useAuth';
import { Link } from 'react-router-dom';
import Tooltip, { Variant } from 'components/Tooltip';
import { FC } from 'react';
import UserCard from 'components/UserCard';
import { ILocation } from 'queries/location';
import { IProfileImage } from 'queries/post';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';

export interface IAvatarUser {
  fullName: string;
  profileImage: IProfileImage;
  status: string;
  workLocation?: ILocation;
  designation?: string;
  userId: string;
  email?: string;
}

interface IAvatarChipProps {
  user: IAvatarUser;
  className?: string;
  size?: number;
  dataTestId?: string;
}

const AvatarChip: FC<IAvatarChipProps> = ({
  className,
  user,
  size = 16,
  dataTestId,
}) => {
  const { t } = useTranslation('profile');
  const { user: currentUser } = useAuth();
  const { isLxp } = useProduct();

  return (
    <Tooltip
      tooltipContent={
        <UserCard
          user={getUserCardTooltipProps(user, t('fieldNotSpecified'))}
        />
      }
      variant={Variant.Light}
      className="!p-4 !shadow-md !rounded-9xl !z-[999]"
    >
      <Link
        to={
          isLxp
            ? ''
            : `${
                user.userId && user.userId !== currentUser?.id
                  ? '/users/' + user.userId
                  : '/profile'
              }`
        }
      >
        <div
          className={`flex items-center w-fit gap-1 rounded-[24px] border-1 border-neutral-200 bg-neutral-100
      px-3 py-2 text-primary-500 font-medium text-sm hover:border-primary-500 transition cursor-pointer ${className} hover:shadow-lg`}
          data-testid={`${dataTestId}${getFullName(user) || user.email}`}
        >
          <Avatar
            name={getFullName(user) || user.email}
            image={getProfileImage(user)}
            size={size}
          />
          <span className="whitespace-nowrap">
            {getFullName(user) || user.email}
          </span>
        </div>
      </Link>
    </Tooltip>
  );
};

export default AvatarChip;
