import React, { ReactNode, useState, MouseEventHandler } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';

import Image from 'components/Image';
import Video from 'components/Video';

import clsx from 'clsx';

export enum MediaEnum {
  Video = 'VIDEO',
  Image = 'IMAGE',
}

export interface IMedia {
  name: string;
  src: string;
  type: MediaEnum;
  hash?: string;
  coverPage?: string;
}

export interface hashSize {
  width: number;
  height: number;
}

export type CarouselProps = {
  media: IMedia[];
  onClose?: MouseEventHandler<Element>;
  hashSize?: hashSize;
};

const Carousel: React.FC<CarouselProps> = ({
  media,
  onClose = () => {},
  hashSize = { width: 0, height: 0 },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? Object.keys(media).length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === Object.keys(media).length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const containerStyles = clsx({
    'm-auto w-full h-full relative group rounded-xl': true,
  });

  const mediaDivStyles = clsx({
    'w-full h-full': true,
  });

  const currentIndexDivStyles = clsx({
    'absolute top-[5%] text-neutral-900 rounded-full p-1 px-2 left-8 bg-white cursor-pointer':
      true,
  });

  const leftArrowIconStyles = clsx({
    '!bg-white !absolute !top-[50%] !left-8 !rounded-lg !text-neutral-900 !cursor-pointer !p-1 !px-3':
      true,
  });

  const rightArrowIconStyles = clsx({
    '!bg-white !absolute !top-[50%] !right-8 !rounded-lg !text-black !cursor-pointer !p-1 !px-3':
      true,
  });

  const crossIconStyles = clsx({
    '!bg-white !top-[5%] !text-neutral-900 !absolute !right-8 !rounded-lg !p-1 !px-2':
      true,
  });

  return (
    <div className={containerStyles}>
      <div className={mediaDivStyles}>
        {media[currentIndex].type === MediaEnum.Image ? (
          <Image image={media[currentIndex]} hashSize={hashSize} />
        ) : (
          <Video video={media[currentIndex]} />
        )}
      </div>

      <div className={currentIndexDivStyles}>
        {currentIndex + 1} of {Object.keys(media).length}
      </div>

      <IconButton
        icon={'<'}
        className={leftArrowIconStyles}
        variant={IconVariant.Primary}
        size={Size.Medium}
        onClick={prevSlide}
      />
      <IconButton
        icon={'>'}
        className={rightArrowIconStyles}
        variant={IconVariant.Primary}
        size={Size.Medium}
        onClick={nextSlide}
      />
      <IconButton
        icon={'X'}
        onClick={onClose}
        className={crossIconStyles}
        variant={IconVariant.Primary}
        size={Size.Medium}
      />
    </div>
  );
};

export default Carousel;
