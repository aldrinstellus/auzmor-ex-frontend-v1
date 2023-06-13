import React, { MouseEventHandler, ReactElement } from 'react';

import Image from 'components/Image';
import Video from 'components/Video';

import clsx from 'clsx';
import Icon from 'components/Icon';
import useCarousel from 'hooks/useCarousel';
import { IMedia } from 'contexts/CreatePostContext';
import { twConfig } from 'utils/misc';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';

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

export const fetchFile = (url: string) => {
  fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      const tempUrl = URL.createObjectURL(file);
      const aTag = document.createElement('a');
      aTag.href = tempUrl;
      aTag.download = url.replace(/^.*[\\\/]/, '');
      document.body.appendChild(aTag);
      aTag.click();
      toast(<SuccessToast content={'Download successful'} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
      });
      URL.revokeObjectURL(tempUrl);
      aTag.remove();
    })
    .catch(() => {
      toast(<FailureToast content={'Download failed'} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.red['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.red['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
      });
    });
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

  const downloadBtnStyle = clsx({
    'top-4 right-4 absolute p-2.5 bg-white rounded-full cursor-pointer border-neutral-200 border':
      true,
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
          name="import"
          className={downloadBtnStyle}
          size={16}
          disabled={true}
          stroke={twConfig.theme.colors.neutral['900']}
          onClick={() => fetchFile(media[currentIndex].original)}
        />
      </div>
    );
  } else return <></>;
};

export default Carousel;
