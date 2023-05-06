import Carousel from 'components/Carousel';
import React, { useState } from 'react';
import MediaRender from './components/MediaRender';
import useModal from 'hooks/useModal';

export interface IMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  className?: string;
  name?: string;
}

export enum Mode {
  View = 'VIEW',
  Edit = 'EDIT',
}

export interface IMediaPreviewProps {
  media: IMedia[];
  className?: string;
  mode?: Mode;
}

const MediaPreview: React.FC<IMediaPreviewProps> = ({ media, className }) => {
  const [mediaIndex, setMediaIndex] = useState<number>(-1);
  const [open, openModal, closeModal] = useModal(true);

  const setIndexAndOpenCarousel = (index: number) => {
    setMediaIndex(index);
    openModal();
  };

  const closeModalAndResetMediaIndex = () => {
    closeModal();
    setMediaIndex(-1);
  };

  const getLayout = () => {
    if (media.length === 0) {
    } else if (media.length === 1) {
      return (
        <MediaRender
          data={media[0]}
          onClick={() => setIndexAndOpenCarousel(0)}
        />
      );
    } else if (media.length === 2) {
      return (
        <div className="flex w-full h-full">
          <MediaRender
            data={media[0]}
            localClassName="mr-4"
            onClick={() => setIndexAndOpenCarousel(0)}
          />
          <MediaRender
            data={media[1]}
            onClick={() => setIndexAndOpenCarousel(1)}
          />
        </div>
      );
    } else if (media.length === 3) {
      return (
        <div className="flex w-full h-full">
          <div className="mr-4">
            <MediaRender
              data={media[0]}
              onClick={() => setIndexAndOpenCarousel(0)}
            />
          </div>
          <div className="flex flex-col">
            <MediaRender
              data={media[1]}
              localClassName="mb-4"
              onClick={() => setIndexAndOpenCarousel(1)}
            />
            <MediaRender
              data={media[2]}
              onClick={() => setIndexAndOpenCarousel(2)}
            />
          </div>
        </div>
      );
    } else if (media.length === 4) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-4">
            <MediaRender
              data={media[0]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(0)}
            />
            <MediaRender
              data={media[1]}
              onClick={() => setIndexAndOpenCarousel(1)}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(2)}
            />
            <MediaRender
              data={media[3]}
              onClick={() => setIndexAndOpenCarousel(3)}
            />
          </div>
        </div>
      );
    } else if (media.length === 5) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-4">
            <MediaRender
              data={media[0]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(0)}
            />
            <MediaRender
              data={media[1]}
              onClick={() => setIndexAndOpenCarousel(1)}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(2)}
            />
            <MediaRender
              data={media[3]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(3)}
            />
            <MediaRender
              data={media[4]}
              onClick={() => setIndexAndOpenCarousel(4)}
            />
          </div>
        </div>
      );
    } else if (media.length > 5) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-4">
            <MediaRender
              data={media[0]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(0)}
            />
            <MediaRender
              data={media[1]}
              onClick={() => setIndexAndOpenCarousel(1)}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(2)}
            />
            <MediaRender
              data={media[3]}
              localClassName="mr-4"
              onClick={() => setIndexAndOpenCarousel(3)}
            />
            <MediaRender
              data={media[4]}
              overlayCount={media.length - 5}
              onClick={() => setIndexAndOpenCarousel(4)}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`${className}`}>
      {getLayout()}
      {mediaIndex >= 0 && (
        <Carousel
          media={media}
          index={mediaIndex}
          open={open}
          closeModal={closeModalAndResetMediaIndex}
        />
      )}
    </div>
  );
};

export default MediaPreview;
