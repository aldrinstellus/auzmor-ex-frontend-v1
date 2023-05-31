import React from 'react';
import { Cropper, CropperRef, ImageRestriction } from 'react-advanced-cropper';

export interface IRectangleCropperProps {
  blobFile: string;
  cropperRef: React.RefObject<CropperRef> | null;
}

const RectangleCropper: React.FC<IRectangleCropperProps> = ({
  blobFile,
  cropperRef,
}) => {
  return (
    <Cropper
      src={blobFile}
      ref={cropperRef}
      stencilProps={{
        aspectRatio: 16 / 9,
        handlers: false,
        lines: false,
        movable: true,
        resizable: false,
      }}
      imageRestriction={ImageRestriction.stencil}
    />
  );
};

export default RectangleCropper;
