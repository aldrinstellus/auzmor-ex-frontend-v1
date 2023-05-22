import React from 'react';
import useHover from 'hooks/useHover';
import { default as MarketplaceOutline } from './MarketplaceOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Marketplace: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
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
