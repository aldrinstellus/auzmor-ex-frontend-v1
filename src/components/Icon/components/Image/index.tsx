import React from 'react';
import useHover from 'hooks/useHover';
import { default as ImageFilled } from './ImageFilled';
import { default as ImageOutline } from './ImageOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ImageIcon: React.FC<IconProps> = ({
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
        <ImageFilled {...props} />
      ) : (
        <ImageOutline {...props} />
      )}
    </div>
  );
};

export default ImageIcon;
