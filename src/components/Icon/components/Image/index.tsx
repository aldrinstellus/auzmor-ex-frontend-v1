import React from 'react';
import useHover from 'hooks/useHover';
import { default as ImageFilled } from './ImageFilled';
import { default as ImageOutline } from './ImageOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ImageIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <ImageFilled {...props} />
      ) : (
        <ImageOutline {...props} />
      )}
    </div>
  );
};

export default ImageIcon;
