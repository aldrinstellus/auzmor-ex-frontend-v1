import React from 'react';
import InfoCircleOutline from './InfoCircleOutline';
import InfoCircleFilled from './InfoCircleFilled';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const InfoCircleIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <InfoCircleFilled {...props} />
      ) : (
        <InfoCircleOutline {...props} />
      )}
    </div>
  );
};

export default InfoCircleIcon;
