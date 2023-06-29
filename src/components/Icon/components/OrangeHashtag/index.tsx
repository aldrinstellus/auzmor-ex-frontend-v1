import React from 'react';
import useHover from 'hooks/useHover';
import { default as HashtagFilled } from './HashtagFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const OrangeHashtagIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <HashtagFilled {...props} />
    </div>
  );
};

export default OrangeHashtagIcon;
