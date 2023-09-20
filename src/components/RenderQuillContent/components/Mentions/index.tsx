import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Tooltip, { Variant } from 'components/Tooltip';
import './index.css';
import UserCard from '../UserCard';

type MentionProps = {
  value: string;
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
  userId?: string;
};

const Mention: FC<MentionProps> = ({
  value,
  fullName,
  image,
  active,
  email,
  userId,
}): ReactElement => {
  const { user } = useAuth();
  return (
    <Tooltip
      tooltipContent={
        <UserCard
          fullName={fullName}
          email={email}
          image={image}
          active={active}
        />
      }
      variant={Variant.Light}
      className="shadow-md top rounded-9xl"
    >
      <Link
        to={userId && userId !== user?.id ? '/users/' + userId : '/profile'}
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
