import clsx from 'clsx';
import Icon from 'components/Icon';
import { IMedia } from 'contexts/CreatePostContext';
import useCarousel from 'hooks/useCarousel';
import React, { useMemo } from 'react';

export interface ICarouselProps {
  media: IMedia[];
  className?: string;
  onClose?: (
    e: React.MouseEvent<HTMLDivElement>,
    media: IMedia,
    currentIndex: number,
  ) => void;
  currentIndex: number;
  prevSlide: () => void;
  nextSlide: () => void;
  coverImageUrl?: string;
}

const Carousel: React.FC<ICarouselProps> = ({
  media,
  className = '',
  currentIndex = 0,
  onClose = () => {},
  prevSlide = () => {},
  nextSlide = () => {},
  coverImageUrl = '',
}) => {
  const style = useMemo(
    () =>
      clsx({
        'rounded-9xl relative overflow-hidden min-h-[128px]': true,
        [className]: true,
      }),
    [],
  );
  return (
    <div className={style}>
      {media[currentIndex].type === 'IMAGE' ? (
        <img src={media[currentIndex].original} />
      ) : coverImageUrl ? (
        <video poster={coverImageUrl} src={media[currentIndex].original} />
      ) : (
        <video src={media[currentIndex].original} />
      )}

      <div className="top-0 absolute p-4 justify-between flex w-full">
        <div className="px-4 py-2 text-sm font-bold bg-white rounded-17xl">
          {currentIndex + 1} of {media.length}
        </div>
        <div onClick={(e) => onClose(e, media[currentIndex], currentIndex)}>
          <Icon name="close" size={16} className="p-2 bg-white rounded-7xl" />
        </div>
      </div>
      <div className="justify-between flex p-4 items-center top-[calc(50%-32px)] absolute w-full">
        <div onClick={prevSlide} className="cursor-pointer">
          <Icon
            name="arrowLeft"
            size={16}
            className="rounded-7xl p-2 bg-white"
          />
        </div>
        {media[currentIndex].type === 'VIDEO' && (
          <div>
            <Icon name="playFilled" fill="#ffffff" size={46} />
          </div>
        )}

        <div onClick={nextSlide} className="cursor-pointer">
          <Icon
            name="arrowRight"
            size={16}
            className="rounded-7xl p-2 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
