import React from 'react';
import useHover from 'hooks/useHover';
import { default as LinkedinFilled } from './LinkedinFilled';
import { default as LinkedinOutline } from './LinkedinOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Linkedin: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <LinkedinFilled {...props} />
      ) : (
        <LinkedinOutline {...props} />
      )}
    </div>
  );
};

export default Linkedin;
