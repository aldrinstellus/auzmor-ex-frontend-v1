import React, {
  MouseEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'components/Image';

import clsx from 'clsx';
import Icon from 'components/Icon';
import useCarousel from 'hooks/useCarousel';
import { IMedia } from 'contexts/CreatePostContext';
import { twConfig } from 'utils/misc';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import Banner, { Variant } from 'components/Banner';

export type CarouselProps = {
  media: IMedia[];
  onClose?: MouseEventHandler<Element>;
  index: number;
  closeModal?: () => void;
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
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
      URL.revokeObjectURL(tempUrl);
      aTag.remove();
    })
    .catch(() => {
      toast(<FailureToast content={'Download failed'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-red-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.red['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
    });
};

const Carousel: React.FC<CarouselProps> = ({
  media,
  index,
  closeModal,
}): ReactElement => {
  const [currentIndex, prevSlide, nextSlide] = useCarousel(
    index,
    Object.keys(media).length,
    closeModal,
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const containerStyles = clsx({
    'm-auto w-full h-full relative rounded-xl': true,
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

  const playBtnStyle = clsx(
    {
      'top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer':
        true,
    },
    { hidden: isPlaying },
  );

  useEffect(() => {
    if (videoRef.current) {
      setCanPlay(
        !!videoRef.current.canPlayType(media[currentIndex].contentType),
      );
    }
  }, [videoRef.current, media[currentIndex]]);

  if (media.length > 0) {
    return (
      <div className={containerStyles}>
        <div className={mediaDivStyles}>
          {media[currentIndex].type === 'IMAGE' ? (
            <Image image={media[currentIndex]} />
          ) : (
            <div className="w-full h-full flex items-center flex-col gap-2">
              <video
                className="w-full h-full"
                src={media[currentIndex].original}
                controls={true}
                ref={videoRef}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                autoPlay={index > -1}
              />
              {!canPlay && (
                <div className="w-full">
                  <Banner
                    title="Incompatible video format, but you can download it"
                    variant={Variant.Grey}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className={currentIndexDivStyles}>
          {currentIndex + 1} of {Object.keys(media).length}
        </div>
        {media?.length > 1 && (
          <div className={leftArrowIconStyles}>
            <Icon name="carouselLeft" onClick={prevSlide} size={36} />
          </div>
        )}
        {media?.length > 1 && (
          <div className={rightArrowIconStyles}>
            <Icon name="carouselRight" onClick={nextSlide} size={36} />
          </div>
        )}
        <div className={downloadBtnStyle}>
          <Icon
            name="import"
            size={16}
            color="text-neutral-900"
            onClick={() => fetchFile(media[currentIndex].original)}
          />
        </div>
        {media[currentIndex].type !== 'IMAGE' && (
          <div className={playBtnStyle}>
            {canPlay ? (
              <Icon
                name="playFilled"
                color="text-white"
                size={32}
                onClick={() => {
                  isPlaying
                    ? videoRef.current?.pause()
                    : videoRef.current?.play();
                }}
              />
            ) : (
              <Icon name="videoSlash" size={50} hover={false} />
            )}
          </div>
        )}
      </div>
    );
  } else return <></>;
};

export default Carousel;
