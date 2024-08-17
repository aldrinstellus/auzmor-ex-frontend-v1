import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Tooltip, { Variant } from 'components/Tooltip';
import './index.css';
import UserCard from 'components/UserCard';
import { ILocation } from 'queries/location';
import { UserStatus } from 'queries/users';
import { getUserCardTooltipProps } from 'utils/misc';
import useProduct from 'hooks/useProduct';
import { IDesignation } from 'queries/designation';
import { useTranslation } from 'react-i18next';

type MentionProps = {
  value: string;
  fullName: string;
  profileImage?: { blurHash: string; id: string; original: string };
  active?: boolean;
  email?: string;
  userId?: string;
  workLocation?: ILocation;
  designation?: IDesignation;
  status?: UserStatus;
};

const Mention: FC<MentionProps> = ({
  value,
  fullName,
  profileImage,
  email,
  userId,
  workLocation,
  designation,
  status,
}): ReactElement => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const { isLxp } = useProduct();
  const profileUrl = isLxp
    ? ''
    : `${userId && userId !== user?.id ? '/users/' + userId : '/profile'}`;
  return (
    <Tooltip
      tooltipContent={
        <UserCard
          user={getUserCardTooltipProps(
            {
              userId,
              fullName,
              email,
              workLocation,
              designation,
              profileImage,
              status,
            },
            t('fieldNotSpecified'),
          )}
        />
      }
      variant={Variant.Light}
      className="!p-4 !shadow-md !rounded-9xl !z-[999]"
    >
      <Link to={profileUrl} className="hover:underline hover:text-primary-500">
        <span
          className="cursor-pointer mention"
          data-testid={`feedpage-at-${value}`}
        >
          {value}
        </span>
      </Link>
    </Tooltip>
  );
};

export default Mention;
