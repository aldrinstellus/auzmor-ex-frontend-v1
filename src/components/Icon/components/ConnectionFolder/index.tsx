import React from 'react';
import useHover from 'hooks/useHover';
import { default as ConnectionFolderOutline } from './ConnectionFolderOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ConnectionFolder: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ConnectionFolderOutline {...props} />
    </div>
  );
};

export default ConnectionFolder;
