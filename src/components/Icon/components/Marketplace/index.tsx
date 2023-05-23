import React from 'react';
import useHover from 'hooks/useHover';
import { default as MarketplaceOutline } from './MarketplaceOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Marketplace: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <MarketplaceOutline {...props} />
    </div>
  );
};

export default Marketplace;
