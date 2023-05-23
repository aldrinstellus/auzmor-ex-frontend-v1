import React from 'react';
import useHover from 'hooks/useHover';
import { default as DocumentUploadOutline } from './DocumentUploadOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const DocumentUpload: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <DocumentUploadOutline {...props} />
    </div>
  );
};

export default DocumentUpload;
