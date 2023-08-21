import React from 'react';
import useHover from 'hooks/useHover';
import { default as GalleryExportOutline } from './GalleryExportOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const GalleryExport: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <GalleryExportOutline {...props} />
    </div>
  );
};

export default GalleryExport;
