import { RefObject, useMemo } from 'react';
import './index.css';
import clsx from 'clsx';
import {
  CircleStencil,
  Cropper,
  CropperRef,
  Priority,
} from 'react-advanced-cropper';

export enum Shape {
  Circle = 'circle',
  Rectangle = 'rectangle',
}

export type ImageCropperProps = {
  src: string;
  shape?: Shape;
  className?: string;
  cropperRef: RefObject<CropperRef>;
  aspectRatio?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  // customHeight: number;
  // customWidth: number;
  // customTop: number;
  // customLeft: number;
};

const ImageCropper = ({
  src,
  shape = Shape.Circle,
  className = '',
  cropperRef,
  aspectRatio = 7.38,
  minW,
  maxW,
  minH,
  maxH,
}: // customHeight,
// customWidth,
// customTop,
// customLeft,
ImageCropperProps) => {
  const imageWrapperStyle = useMemo(
    () => clsx({ 'h-[264px]': true }, { [className]: true }),
    [className],
  );

  return (
    <div className={imageWrapperStyle}>
      {shape === Shape.Circle ? (
        <Cropper
          src={src}
          ref={cropperRef}
          stencilComponent={CircleStencil}
          stencilProps={{
            handlers: {
              north: false,
              eastNorth: true,
              westNorth: true,
              east: false,
              west: false,
              south: false,
              westSouth: true,
              eastSouth: true,
            },
            movable: true,
            resizable: true,
            lines: false,
            previewClassName: 'preview',
            overlayClassName: 'overlay',
          }}
          className="cropper"
          minWidth={minW}
          maxWidth={maxW}
          minHeight={minH}
          maxHeight={maxH}
        />
      ) : (
        <Cropper
          src={src}
          ref={cropperRef}
          stencilProps={{
            aspectRatio: aspectRatio / 1,
            handlers: {
              north: false,
              eastNorth: false,
              westNorth: false,
              east: false,
              west: false,
              south: false,
              westSouth: false,
              eastSouth: false,
            },
            lines: false,
            resizable: true,
          }}
          minWidth={minW}
          maxWidth={maxW}
          minHeight={minH}
          maxHeight={maxH}
          // Modify the width and height to modify the stencil
          // defaultVisibleArea={{
          //   width: customWidth,
          //   height: customHeight,
          //   top: customTop,
          //   left: customLeft,
          // }}
          className="cropper"
          // maxHeight={180}
          priority={Priority.visibleArea}
        />
      )}
    </div>
  );
};

export default ImageCropper;
