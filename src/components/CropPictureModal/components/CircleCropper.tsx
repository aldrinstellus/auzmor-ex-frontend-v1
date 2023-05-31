import React, { useRef } from 'react';
import { CircleStencil, Cropper, CropperRef } from 'react-advanced-cropper';

export interface ICircleCropperProps {
  blobFile: string;
  cropperRef: React.RefObject<CropperRef> | null;
}

const CircleCropper: React.FC<ICircleCropperProps> = ({
  blobFile,
  cropperRef,
}) => {
  return (
    <Cropper
      src={blobFile}
      ref={cropperRef}
      stencilComponent={CircleStencil}
      stencilProps={{
        aspectRatio: 6 / 9,
        movable: true,
        resizable: true,
        // className: '', // define the entire stecil
        // movingClassName: '', // define moving the stecil
        // resizingClassName: '', // define while resizing the stecil
        previewClassName: 'preview', // define the preview inside
        overlayClassName: 'overlay',
        // boundingBoxClassName: '',
        handlerClassNames: '',
      }}
      className=""
    />
  );
};

export default CircleCropper;
