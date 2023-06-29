import React, { ReactElement } from 'react';
import MentionUserCard from './MentionUserCard';
import useHover from 'hooks/useHover';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

type MentionProps = {
  value: string;
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
  userId?: string;
};

const Mention: React.FC<MentionProps> = ({
  value,
  fullName,
  image,
  active,
  email,
  userId,
}): ReactElement => {
  const [isHovered, eventHandlers] = useHover();
  const { user } = useAuth();
  return (
    <span className="relative">
      {isHovered && (
        <MentionUserCard
          fullName={fullName}
          email={email}
          image={image}
          active={active}
          className="absolute -top-[170px] z-10 shadow-lg transition-opacity duration-200 min-w-max border-transparent border-[12px]"
        />
      )}
      <Link
        to={userId && userId !== user?.id ? '/users/' + userId : '/profile'}
      >
        <span
          {...eventHandlers}
          className="cursor-pointer mention"
          contentEditable="false"
        >
          {value}
        </span>
      </Link>
    </span>
  );
};

export default Mention;
