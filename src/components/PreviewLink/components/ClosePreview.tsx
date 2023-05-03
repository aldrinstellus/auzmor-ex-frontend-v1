import Icon from 'components/Icon';
import React from 'react';

type ClosePreviewProps = {
  setShowPreview: (show: boolean) => void;
};

const ClosePreview: React.FC<ClosePreviewProps> = ({ setShowPreview }) => {
  return (
    <button
      className="absolute top-0 right-0 bg-white border-1 border-neutral-200 border-solid rounded-7xl m-4 p-2"
      onClick={() => {
        setShowPreview(false);
      }}
    >
      <Icon name="closeOutline" size={10} fill="#171717" />
    </button>
  );
};

export default ClosePreview;
