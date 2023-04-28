import React from 'react';
import useHover from 'hooks/useHover';
import { default as DocumentFilled } from './DocumentFilled';
import { default as DocumentOutline } from './DocumentOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const DocumentIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <DocumentFilled {...props} />
      ) : (
        <DocumentOutline {...props} />
      )}
    </div>
  );
};

export default DocumentIcon;
