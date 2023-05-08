import React from 'react';
import useHover from 'hooks/useHover';
import { default as MailOutline } from './MailOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const MailIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <MailOutline {...props} />
    </div>
  );
};

export default MailIcon;
