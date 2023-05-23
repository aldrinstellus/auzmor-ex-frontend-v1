import React from 'react';
import useHover from 'hooks/useHover';
import { default as SpeakerFilled } from './SpeakerFilled';
import { default as SpeakerOutline } from './SpeakerOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SpeakerIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <SpeakerFilled {...props} />
      ) : (
        <SpeakerOutline {...props} />
      )}
    </div>
  );
};

export default SpeakerIcon;
