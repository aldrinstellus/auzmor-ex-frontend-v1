import React from 'react';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';

type ClosePreviewProps = {
  setPreviewUrl: (previewUrl: string) => void;
};

const ClosePreview: React.FC<ClosePreviewProps> = ({ setPreviewUrl }) => {
  return (
    <IconButton
      icon="closeOutline"
      className="absolute top-0 right-0 bg-white border-1 border-neutral-200 border-solid rounded-7xl m-4 p-2"
      variant={IconVariant.Secondary}
      size={Size.Small}
      onClick={() => {
        setPreviewUrl('');
      }}
    />
  );
};

export default ClosePreview;
