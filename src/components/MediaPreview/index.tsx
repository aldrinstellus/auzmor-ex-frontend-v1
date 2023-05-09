import React, { useState } from 'react';
import Carousel from 'components/Carousel';
import MediaRender from './components/MediaRender';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import { IMedia } from 'contexts/CreatePostContext';
import useModal from 'hooks/useModal';
import './index.css';

export enum Mode {
  View = 'VIEW',
  Edit = 'EDIT',
}

export interface IMediaPreviewProps {
  media: IMedia[];
  className?: string;
  mode?: Mode;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    clickIndex: number,
    media: IMedia,
  ) => void;
  onAddButtonClick?: React.MouseEventHandler<Element>;
  onCloseButtonClick?: React.MouseEventHandler<Element>;
  onEditButtonClick?: React.MouseEventHandler<Element>;
}

const MediaPreview: React.FC<IMediaPreviewProps> = ({
  media,
  className,
  mode = Mode.View,
  onAddButtonClick = () => {},
  onCloseButtonClick = () => {},
  onEditButtonClick = () => {},
  onClick = () => {},
}) => {
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
          onClick={(e) => {
            if (mode === Mode.View) {
              setIndexAndOpenCarousel(0);
            } else {
              onClick(e, 1, media[0]);
            }
          }}
        />
      );
    } else if (media.length === 2) {
      return (
        <div className="flex w-full h-full items-center">
          <MediaRender
            data={media[0]}
            localClassName="!w-1/2 !mr-2 bg-slate-400"
            onClick={(e) => {
              if (mode === Mode.View) {
                setIndexAndOpenCarousel(0);
              } else {
                onClick(e, 1, media[0]);
              }
            }}
          />
          <MediaRender
            data={media[1]}
            localClassName="!w-1/2 !ml-2 bg-slate-400"
            onClick={(e) => {
              if (mode === Mode.View) {
                setIndexAndOpenCarousel(1);
              } else {
                onClick(e, 2, media[1]);
              }
            }}
          />
        </div>
      );
    } else if (media.length === 3) {
      return (
        <div className="flex w-full h-full">
          <div className="!w-1/2 !mr-2">
            <MediaRender
              data={media[0]}
              localClassName="mr-4"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(0);
                } else {
                  onClick(e, 1, media[0]);
                }
              }}
            />
          </div>
          <div className="flex flex-col !w-1/2 !ml-2">
            <MediaRender
              data={media[1]}
              localClassName="mb-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(1);
                } else {
                  onClick(e, 2, media[1]);
                }
              }}
            />
            <MediaRender
              data={media[2]}
              localClassName="mt-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(2);
                } else {
                  onClick(e, 3, media[2]);
                }
              }}
            />
          </div>
        </div>
      );
    } else if (media.length === 4) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-2 !h-1/2">
            <MediaRender
              data={media[0]}
              localClassName="!w-1/2 !mr-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(0);
                } else {
                  onClick(e, 1, media[0]);
                }
              }}
            />
            <MediaRender
              data={media[1]}
              localClassName="!w-1/2 !ml-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(1);
                } else {
                  onClick(e, 2, media[1]);
                }
              }}
            />
          </div>
          <div className="flex mt-2 !h-1/2">
            <MediaRender
              data={media[2]}
              localClassName="!w-1/2 mr-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(2);
                } else {
                  onClick(e, 3, media[2]);
                }
              }}
            />
            <MediaRender
              data={media[3]}
              localClassName="!w-1/2 ml-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(3);
                } else {
                  onClick(e, 4, media[3]);
                }
              }}
            />
          </div>
        </div>
      );
    } else if (media.length === 5) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-2 !h-1/2 ">
            <MediaRender
              data={media[0]}
              localClassName="mr-2 !w-1/2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(0);
                } else {
                  onClick(e, 1, media[0]);
                }
              }}
            />
            <MediaRender
              data={media[1]}
              localClassName="ml-2 !w-1/2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(1);
                } else {
                  onClick(e, 2, media[1]);
                }
              }}
            />
          </div>
          <div className="flex !h-1/2 mt-2">
            <MediaRender
              data={media[2]}
              localClassName="!w-1/3 mr-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(2);
                } else {
                  onClick(e, 3, media[2]);
                }
              }}
            />
            <MediaRender
              data={media[3]}
              localClassName="!w-1/3 mx-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(3);
                } else {
                  onClick(e, 4, media[3]);
                }
              }}
            />
            <MediaRender
              data={media[4]}
              localClassName="!w-1/3 ml-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(4);
                } else {
                  onClick(e, 5, media[4]);
                }
              }}
            />
          </div>
        </div>
      );
    } else if (media.length > 5) {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex mb-2 !h-1/2 ">
            <MediaRender
              data={media[0]}
              localClassName="mr-2 !w-1/2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(0);
                } else {
                  onClick(e, 1, media[0]);
                }
              }}
            />
            <MediaRender
              data={media[1]}
              localClassName="ml-2 !w-1/2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(1);
                } else {
                  onClick(e, 2, media[1]);
                }
              }}
            />
          </div>
          <div className="flex !h-1/2 mt-2">
            <MediaRender
              data={media[2]}
              localClassName="!w-1/3 mr-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(2);
                } else {
                  onClick(e, 3, media[2]);
                }
              }}
            />
            <MediaRender
              data={media[3]}
              localClassName="!w-1/3 mx-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(3);
                } else {
                  onClick(e, 4, media[3]);
                }
              }}
            />
            <MediaRender
              overlayCount={media.length - 5}
              data={media[4]}
              localClassName="!w-1/3 ml-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(4);
                } else {
                  onClick(e, 5, media[4]);
                }
              }}
            />
          </div>
        </div>
      );
    }
  };
  return (
    <div className={`${className} relative`}>
      {getLayout()}
      {mode === Mode.Edit && (
        <div className="flex justify-between absolute p-4 top-0 w-full">
          <div>
            <Button
              label="Add photos/videos"
              leftIcon="imageFilled"
              className="flex"
              variant={ButtonVariant.Secondary}
              leftIconClassName="mr-1"
              iconFill={twConfig.theme.colors.neutral['900']}
              size={Size.Small}
              onClick={onAddButtonClick}
            />
          </div>
          <div className="flex items-center">
            <div onClick={onEditButtonClick}>
              <Icon
                name="edit"
                size={16}
                className="p-2 rounded-7xl mr-2 bg-white"
                stroke={twConfig.theme.colors.neutral['900']}
                fill={twConfig.theme.colors.neutral['900']}
              />
            </div>
            <div onClick={onCloseButtonClick}>
              <Icon
                name="close"
                size={16}
                className="p-2 rounded-7xl bg-white"
                stroke={twConfig.theme.colors.neutral['900']}
                fill={twConfig.theme.colors.neutral['900']}
              />
            </div>
          </div>
        </div>
      )}
      {mode === Mode.View && mediaIndex >= 0 && (
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
