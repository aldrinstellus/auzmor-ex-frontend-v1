import clsx from 'clsx';
import Icon from 'components/Icon';
import { IMedia } from 'contexts/CreatePostContext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { twConfig } from 'utils/misc';

const MIN = 0;
const MAX = 100;
const SEEK_FORWARD_TIME = 5;

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
  setShowFullscreenVideo?: (showFullscreenVideo: IMedia | false) => void;
  autoplayIndex?: number; // default -1
  resetAutoplayIndex?: () => void;
  dataTestId?: string;
}

interface IProgress {
  currentTime: number;
  duration: number;
  progress: number;
}

const Carousel: React.FC<ICarouselProps> = ({
  media,
  className = '',
  currentIndex = 0,
  onClose = () => {},
  prevSlide = () => {},
  nextSlide = () => {},
  coverImageUrl = '',
  setShowFullscreenVideo,
  autoplayIndex = -1,
  resetAutoplayIndex = () => {},
  dataTestId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressbarRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<IProgress>({
    currentTime: 0,
    duration: 0,
    progress: 0,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const getFormatedTime = (time: number) => {
    if (time === Infinity) {
      return '00:00';
    }
    const seconds = Math.floor(time);
    const min = Math.floor(seconds / 60);
    return `${min.toString().padStart(2, '0')}:${(seconds - min * 60)
      .toString()
      .padStart(2, '0')}`;
  };
  const style = useMemo(
    () =>
      clsx({
        'rounded-9xl relative overflow-hidden min-h-[128px]': true,
        [className]: true,
      }),
    [],
  );
  const mapRanges = (
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    value: number,
  ) => {
    return newMin + ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin);
  };

  useEffect(() => {
    if (videoRef.current && autoplayIndex > -1) {
      resetAutoplayIndex();
      videoRef.current.play();
    }
  }, [videoRef.current, autoplayIndex]);
  return (
    <div className={style}>
      {media[currentIndex].type === 'IMAGE' ? (
        <img src={media[currentIndex].original} />
      ) : coverImageUrl ? (
        <video
          src={media[currentIndex].original}
          ref={videoRef}
          onTimeUpdate={() => {
            setProgress({
              currentTime: videoRef.current!.currentTime,
              duration: videoRef.current!.duration,
              progress:
                (videoRef.current!.currentTime / videoRef.current!.duration) *
                100,
            });
            progressbarRef.current!.value = (
              (videoRef.current!.currentTime / videoRef.current!.duration) *
              100
            ).toString();
          }}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={coverImageUrl}
          muted={isMuted}
          onClick={() =>
            isPlaying && videoRef.current
              ? videoRef.current!.pause()
              : videoRef.current!.play()
          }
          autoPlay={autoplayIndex === currentIndex}
        />
      ) : (
        <video
          src={media[currentIndex].original}
          ref={videoRef}
          onTimeUpdate={() => {
            setProgress({
              currentTime: videoRef.current!.currentTime,
              duration: videoRef.current!.duration,
              progress:
                (videoRef.current!.currentTime / videoRef.current!.duration) *
                100,
            });
            progressbarRef.current!.value = (
              (videoRef.current!.currentTime / videoRef.current!.duration) *
              100
            ).toString();
          }}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMuted}
          onClick={() =>
            isPlaying && videoRef
              ? videoRef.current!.pause()
              : videoRef.current!.play()
          }
          autoPlay={autoplayIndex === currentIndex}
        />
      )}
      {media[currentIndex].type !== 'IMAGE' && (
        <div className="bg-neutral-700 px-6 py-2.5 flex justify-between items-center">
          {isPlaying ? (
            <div
              className="p-2 bg-white rounded-full cursor-pointer"
              onClick={() => videoRef?.current?.pause()}
            >
              <Icon
                name="pause"
                size={14}
                fill={twConfig.theme.colors.primary['500']}
              />
            </div>
          ) : (
            <div
              className="p-2 bg-white rounded-full cursor-pointer"
              onClick={() => videoRef?.current?.play()}
            >
              <Icon
                name="playFilled"
                size={14}
                fill={twConfig.theme.colors.primary['500']}
              />
            </div>
          )}
          <div className="flex items-center">
            <div className="text-sm text-white mr-2 w-10 text-center">
              {getFormatedTime(progress?.currentTime)}
            </div>
            <input
              type="range"
              min={MIN}
              max={MAX}
              defaultValue={0}
              onChange={(e) => {
                if (videoRef.current!.duration === Infinity) {
                  return;
                }
                const mappedCurrentTime = mapRanges(
                  MIN,
                  MAX,
                  0,
                  Math.floor(videoRef.current!.duration),
                  parseInt(e.target.value),
                );
                setProgress({
                  currentTime: mappedCurrentTime,
                  duration: videoRef.current!.duration,
                  progress: parseInt(e.target.value),
                });
                videoRef.current!.currentTime = mappedCurrentTime;
              }}
              ref={progressbarRef}
              className="accent-white"
            />
            <div className="text-sm text-white ml-2 w-10 text-center">
              {getFormatedTime(progress?.duration)}
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              (videoRef!.current!.currentTime += SEEK_FORWARD_TIME)
            }
          >
            <Icon name="seekForward" />
          </div>
          {isMuted ? (
            <div onClick={() => setIsMuted(false)} className="cursor-pointer">
              <Icon name="mute" stroke="#fff" />
            </div>
          ) : (
            <div onClick={() => setIsMuted(true)} className="cursor-pointer">
              <Icon name="speaker" stroke="#fff" />
            </div>
          )}
          <div
            onClick={() => {
              setShowFullscreenVideo &&
                setShowFullscreenVideo(media[currentIndex]);
              videoRef.current!.pause();
            }}
            className="cursor-pointer"
          >
            <Icon name="fullScreen" />
          </div>
        </div>
      )}

      <div className="top-0 absolute p-4 justify-between flex w-full">
        {!isPlaying ? (
          <div className="px-4 py-2 text-sm font-bold bg-white rounded-17xl">
            {currentIndex + 1} of {media.length}
          </div>
        ) : (
          <div />
        )}
        <div
          onClick={(e) => onClose(e, media[currentIndex], currentIndex)}
          data-testid={`${dataTestId}-${
            media[currentIndex].type === 'IMAGE'
              ? 'discardphoto'
              : 'discardvideo'
          }`}
        >
          <Icon name="close" size={16} className="p-2 bg-white rounded-7xl" />
        </div>
      </div>
      {!isPlaying && (
        <div
          className="justify-between flex p-4 items-center top-[calc(50%-32px)] absolute w-full"
          onClick={() => {
            if (videoRef.current) {
              isPlaying ? videoRef.current!.pause() : videoRef.current!.play();
            }
          }}
        >
          <div onClick={prevSlide} className="cursor-pointer">
            <Icon
              name="arrowLeft"
              size={16}
              className="rounded-7xl p-2 bg-white"
            />
          </div>
          {media[currentIndex].type === 'VIDEO' && (
            <div
              onClick={() => videoRef.current!.play()}
              className="cursor-pointer"
            >
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
      )}
    </div>
  );
};

export default Carousel;
