import React, { MouseEventHandler, ReactElement } from 'react';

import Image from 'components/Image';
import Video from 'components/Video';

import clsx from 'clsx';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import useCarousel from 'hooks/useCarousel';
import { IMedia } from 'contexts/CreatePostContext';

export interface hashSize {
  width: number;
  height: number;
}

export type CarouselProps = {
  media: IMedia[];
  onClose?: MouseEventHandler<Element>;
  hashSize?: hashSize;
  index: number;
  open: boolean;
  closeModal: any;
  openModal?: any;
};

const Carousel: React.FC<CarouselProps> = ({
  media,
  hashSize = { width: 0, height: 0 },
  index,
  open,
  closeModal,
  openModal,
}): ReactElement => {
  const [currentIndex, prevSlide, nextSlide] = useCarousel(
    index,
    Object.keys(media).length,
  );

  const containerStyles = clsx({
    'm-auto w-full h-full relative group rounded-xl': true,
  });

  const mediaDivStyles = clsx({
    'w-full h-full': true,
  });

  const currentIndexDivStyles = clsx({
    'absolute top-[5%] text-neutral-900 font-bold rounded-full p-2 px-4 left-8 bg-white cursor-pointer':
      true,
  });

  const leftArrowIconStyles = clsx({
    '!absolute !top-[50%] !left-1 !rounded-lg !cursor-pointer !p-1 !px-3': true,
  });

  const rightArrowIconStyles = clsx({
    '!absolute !top-[50%] !right-1 !rounded-lg !cursor-pointer !p-1 !px-3':
      true,
  });

  const crossIconStyles = clsx({
    '!top-[2%] !right-2 !absolute !right-8 !rounded-lg !p-1 !px-2': true,
  });

  if (media.length > 0) {
    return (
      <div className={containerStyles}>
        <div className={mediaDivStyles}>
          {media[currentIndex].type === 'IMAGE' ? (
            <Image image={media[currentIndex]} hashSize={hashSize} />
          ) : (
            <Video video={media[currentIndex]} />
          )}
        </div>

        <div className={currentIndexDivStyles}>
          {currentIndex + 1} of {Object.keys(media).length}
        </div>

        <Icon
          name="carouselLeft"
          onClick={prevSlide}
          className={leftArrowIconStyles}
          size={36}
        />
        <Icon
          name="carouselRight"
          onClick={nextSlide}
          className={rightArrowIconStyles}
          size={36}
        />
        <Icon
          name="carouselClose"
          className={crossIconStyles}
          onClick={closeModal}
        />
      </div>
    );
  } else return <></>;
};

export default Carousel;
