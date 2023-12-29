import { RefObject, useMemo } from 'react';
import './index.css';
import clsx from 'clsx';
import {
  CircleStencil,
  Cropper,
  CropperRef,
  CropperState,
  Priority,
} from 'react-advanced-cropper';

export enum Shape {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Square = 'square',
}

export type ImageCropperProps = {
  src: string;
  shape?: Shape;
  className?: string;
  cropperRef: RefObject<CropperRef>;
  aspectRatio?: number;
  defaultSize?: (cropperState: CropperState) => {
    width: number;
    height: number;
  };
  handlers?: {
    north: boolean;
    eastNorth: boolean;
    westNorth: boolean;
    east: boolean;
    west: boolean;
    south: boolean;
    westSouth: boolean;
    eastSouth: boolean;
  };
};

const ImageCropper = ({
  src,
  shape = Shape.Circle,
  className = '',
  cropperRef,
  aspectRatio,
  defaultSize,
  handlers,
}: ImageCropperProps) => {
  const imageWrapperStyle = useMemo(
    () => clsx({ 'h-[296px]': true }, { [className]: true }),
    [className],
  );

  return (
    <div className={imageWrapperStyle}>
      {shape === Shape.Circle && (
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
        />
      )}
      {shape === Shape.Square && (
        <Cropper
          src={src}
          ref={cropperRef}
          stencilProps={{
            aspectRatio: 1,
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
            lines: false,
            resizable: true,
          }}
          className="cropper"
          priority={Priority.visibleArea}
        />
      )}
      {shape === Shape.Rectangle && (
        <Cropper
          src={src}
          ref={cropperRef}
          stencilProps={{
            aspectRatio,
            handlers: handlers || {
              north: true,
              eastNorth: true,
              westNorth: true,
              east: true,
              west: true,
              south: true,
              westSouth: true,
              eastSouth: true,
            },
            lines: false,
            resizable: true,
          }}
          defaultSize={defaultSize}
          className="cropper"
          priority={Priority.visibleArea}
        />
      )}
    </div>
  );
};

export default ImageCropper;
