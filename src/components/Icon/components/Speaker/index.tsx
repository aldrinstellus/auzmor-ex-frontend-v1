import React from 'react';
import useHover from 'hooks/useHover';
import { default as SpeakerFilled } from './SpeakerFilled';
import { default as SpeakerOutline } from './SpeakerOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const SpeakerIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <SpeakerFilled {...props} />
      ) : (
        <SpeakerOutline {...props} />
      )}
    </div>
  );
};

export default SpeakerIcon;
