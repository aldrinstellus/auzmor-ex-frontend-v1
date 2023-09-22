import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Tooltip, { Variant } from 'components/Tooltip';
import './index.css';
import UserCard from 'components/UserCard';
import { ILocation } from 'queries/location';

type MentionProps = {
  value: string;
  fullName: string;
  profileImage?: { blurHash: string; id: string; original: string };
  active?: boolean;
  email?: string;
  userId?: string;
  location?: ILocation;
};

const Mention: FC<MentionProps> = ({
  value,
  fullName,
  profileImage,
  email,
  userId,
  location,
}): ReactElement => {
  const { user } = useAuth();
  return (
    <Tooltip
      tooltipContent={
        <UserCard
          user={{
            id: userId || '',
            fullName,
            workEmail: email,
            workLocation: location,
            profileImage,
          }}
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
