import React from 'react';
import useHover from 'hooks/useHover';
import { default as BrandingOutline } from './BrandingOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Branding: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <BrandingOutline {...props} />
    </div>
  );
};

export default Branding;
