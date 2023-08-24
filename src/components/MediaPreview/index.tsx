import React, { useMemo, useState } from 'react';
import Carousel from 'components/Carousel';
import MediaRender from './components/MediaRender';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import { ICoverImageMap, IMedia } from 'contexts/CreatePostContext';
import useModal from 'hooks/useModal';
import './index.css';
import Modal from 'components/Modal';

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
  coverImageMap?: ICoverImageMap[];
  dataTestId?: string;
  showAddMediaButton?: boolean;
  showEditButton?: boolean;
  showCloseButton?: boolean;
  isAnnouncementWidgetPreview?: boolean;
}

const MediaPreview: React.FC<IMediaPreviewProps> = ({
  media,
  className,
  mode = Mode.View,
  onAddButtonClick = () => {},
  onCloseButtonClick = () => {},
  onEditButtonClick = () => {},
  onClick = () => {},
  coverImageMap,
  dataTestId,
  showAddMediaButton = true,
  showEditButton = true,
  showCloseButton = true,
  isAnnouncementWidgetPreview = false,
}) => {
  const [mediaIndex, setMediaIndex] = useState<number>(-1);
  const [open, openModal, closeModal] = useModal(true);

  const getMediaHeight = () => {
    if (isAnnouncementWidgetPreview) {
      return 'h-20';
    }
    if (media.length <= 3) {
      return 'h-64';
    }
    if (media.length > 3) {
      return 'h-80';
    }
    return '';
  };

  const setIndexAndOpenCarousel = (index: number) => {
    setMediaIndex(index);
    openModal();
  };

  const closeModalAndResetMediaIndex = () => {
    closeModal();
    setMediaIndex(-1);
  };

  const getLayout = () => {
    const mediaHeight = useMemo(getMediaHeight, [media.length]);
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
          localClassName={`!${mediaHeight}`}
          coverImageUrl={
            coverImageMap?.find((map) => map.videoName === media[0].name)
              ?.blobUrl || media[0]?.coverImage?.original
          }
        />
      );
    } else if (media.length === 2) {
      return (
        <div className={`flex w-full items-center ${mediaHeight}`}>
          <MediaRender
            data={media[0]}
            localClassName="!w-1/2 !mr-2"
            onClick={(e) => {
              if (mode === Mode.View) {
                setIndexAndOpenCarousel(0);
              } else {
                onClick(e, 0, media[0]);
              }
            }}
            coverImageUrl={
              coverImageMap?.find((map) => map.videoName === media[0].name)
                ?.blobUrl || media[0]?.coverImage?.original
            }
          />
          <MediaRender
            data={media[1]}
            localClassName="!w-1/2 !ml-2"
            onClick={(e) => {
              if (mode === Mode.View) {
                setIndexAndOpenCarousel(1);
              } else {
                onClick(e, 1, media[1]);
              }
            }}
            coverImageUrl={
              coverImageMap?.find((map) => map.videoName === media[1].name)
                ?.blobUrl || media[1]?.coverImage?.original
            }
          />
        </div>
      );
    } else if (media.length === 3) {
      return (
        <div className={`flex w-full ${mediaHeight}`}>
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[0].name)
                  ?.blobUrl || media[0]?.coverImage?.original
              }
            />
          </div>
          <div className="flex flex-col !w-1/2 !ml-2">
            <MediaRender
              data={media[1]}
              localClassName="mb-4"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(1);
                } else {
                  onClick(e, 2, media[1]);
                }
              }}
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[1].name)
                  ?.blobUrl || media[1]?.coverImage?.original
              }
            />
            <MediaRender
              data={media[2]}
              localClassName="mt-0"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(2);
                } else {
                  onClick(e, 3, media[2]);
                }
              }}
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[2].name)
                  ?.blobUrl || media[2]?.coverImage?.original
              }
            />
          </div>
        </div>
      );
    } else if (media.length === 4) {
      return (
        <div className={`flex flex-col w-full space-y-4 ${mediaHeight}`}>
          <div className="flex !h-1/2">
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[0].name)
                  ?.blobUrl || media[0]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[1].name)
                  ?.blobUrl || media[1]?.coverImage?.original
              }
            />
          </div>
          <div className="flex !h-1/2">
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[2].name)
                  ?.blobUrl || media[2]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[3].name)
                  ?.blobUrl || media[3]?.coverImage?.original
              }
            />
          </div>
        </div>
      );
    } else if (media.length === 5) {
      return (
        <div className={`flex flex-col w-full space-y-4 ${mediaHeight}`}>
          <div className="flex mb-0 !h-1/2">
            <MediaRender
              data={media[0]}
              localClassName="mr-2 mb-4 !w-1/2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(0);
                } else {
                  onClick(e, 1, media[0]);
                }
              }}
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[0].name)
                  ?.blobUrl || media[0]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[1].name)
                  ?.blobUrl || media[1]?.coverImage?.original
              }
            />
          </div>
          <div className="flex !h-1/2 mt-0">
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[2].name)
                  ?.blobUrl || media[2]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[3].name)
                  ?.blobUrl || media[3]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[4].name)
                  ?.blobUrl || media[4]?.coverImage?.original
              }
            />
          </div>
        </div>
      );
    } else if (media.length > 5) {
      return (
        <div className={`flex flex-col w-full ${mediaHeight}`}>
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[0].name)
                  ?.blobUrl || media[0]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[1].name)
                  ?.blobUrl || media[1]?.coverImage?.original
              }
            />
          </div>
          <div className="flex !h-1/2">
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[2].name)
                  ?.blobUrl || media[2]?.coverImage?.original
              }
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
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[3].name)
                  ?.blobUrl || media[3]?.coverImage?.original
              }
            />
            <MediaRender
              overlayCount={media.length - 5}
              isAnnouncementWidgetPreview={isAnnouncementWidgetPreview}
              data={media[4]}
              localClassName="!w-1/3 ml-2"
              onClick={(e) => {
                if (mode === Mode.View) {
                  setIndexAndOpenCarousel(4);
                } else {
                  onClick(e, 5, media[4]);
                }
              }}
              coverImageUrl={
                coverImageMap?.find((map) => map.videoName === media[4].name)
                  ?.blobUrl || media[4]?.coverImage?.original
              }
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
            {showAddMediaButton && (
              <Button
                label="Add photos/videos"
                leftIcon="imageFilled"
                className="flex"
                variant={ButtonVariant.Secondary}
                leftIconClassName="mr-1"
                iconColor={twConfig.theme.colors.neutral['900']}
                size={Size.Small}
                onClick={onAddButtonClick}
                dataTestId={`${dataTestId}-addphotoscta`}
              />
            )}
          </div>
          <div className="flex items-center">
            {showEditButton && (
              <div
                onClick={onEditButtonClick}
                data-testid={`${dataTestId}-editicon`}
              >
                <Icon
                  name="edit"
                  size={16}
                  className="p-2 rounded-7xl mr-2 bg-white cursor-pointer"
                  color={twConfig.theme.colors.neutral['900']}
                />
              </div>
            )}
            {showCloseButton && (
              <div
                onClick={onCloseButtonClick}
                data-testid={`${dataTestId}-remove-image`}
              >
                <Icon
                  name="close"
                  size={16}
                  disabled
                  className="p-2 rounded-7xl bg-white cursor-pointer"
                  color={twConfig.theme.colors.neutral['900']}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {mode === Mode.View && mediaIndex >= 0 && (
        <Modal
          open={open}
          className="!w-[65vw] !h-[80vh] p-6"
          closeModal={closeModal}
          showModalCloseBtn
        >
          <Carousel
            media={media}
            index={mediaIndex}
            closeModal={closeModalAndResetMediaIndex}
          />
        </Modal>
      )}
    </div>
  );
};

export default MediaPreview;
