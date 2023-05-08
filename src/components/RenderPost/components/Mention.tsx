import React, { ReactElement } from 'react';
import MentionUserCard from './MentionUserCard';
import useHover from 'hooks/useHover';

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
  const [isHovered, eventHandlers] = useHover();
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
      <span
        {...eventHandlers}
        className="cursor-pointer mention"
        contentEditable="false"
      >
        {value}
      </span>
    </span>
  );
};

export default Mention;
