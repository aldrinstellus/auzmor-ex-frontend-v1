import React, { ReactElement, useState } from 'react';
import MentionUserCard from './MentionUserCard';

type MentionProps = {
  value: string;
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
};

const Mention: React.FC<MentionProps> = ({
  value,
  fullName,
  image,
  active,
  email,
}): ReactElement => {
  const [showUserCard, setShowUserCard] = useState<boolean>(false);
  return (
    <span className="relative">
      {showUserCard && (
        <MentionUserCard
          fullName={fullName}
          email={email}
          image={image}
          active={active}
          className="absolute -top-[170px] z-10 shadow-lg transition-opacity duration-200 min-w-max"
        />
      )}
      <span
        onMouseEnter={() => setShowUserCard(true)}
        onMouseLeave={() => setShowUserCard(false)}
        className="cursor-pointer mention"
        contentEditable="false"
      >
        {value}
      </span>
    </span>
  );
};

export default Mention;
