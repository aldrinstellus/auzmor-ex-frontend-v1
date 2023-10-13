import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Tooltip, { Variant } from 'components/Tooltip';
import './index.css';
import UserCard from 'components/UserCard';
import { ILocation } from 'queries/location';
import { UserStatus } from 'queries/users';
import { getUserCardTooltipProps } from 'utils/misc';

type MentionProps = {
  value: string;
  fullName: string;
  profileImage?: { blurHash: string; id: string; original: string };
  active?: boolean;
  email?: string;
  userId?: string;
  workLocation?: ILocation;
  status?: UserStatus;
};

const Mention: FC<MentionProps> = ({
  value,
  fullName,
  profileImage,
  email,
  userId,
  workLocation,
  status,
}): ReactElement => {
  const { user } = useAuth();
  return (
    <Tooltip
      tooltipContent={
        <UserCard
          user={getUserCardTooltipProps({
            userId,
            fullName,
            email,
            workLocation,
            profileImage,
            status,
          })}
        />
      }
      variant={Variant.Light}
      className="!p-4 !shadow-md !rounded-9xl !z-[999]"
    >
      <Link
        to={userId && userId !== user?.id ? '/users/' + userId : '/profile'}
        className="hover:underline hover:text-primary-500"
      >
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
