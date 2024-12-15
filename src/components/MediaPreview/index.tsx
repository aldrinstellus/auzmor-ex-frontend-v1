import { FC, MouseEvent, MouseEventHandler, useMemo, useState } from 'react';
import Carousel from 'components/Carousel';
import MediaRender, { PreferredSize } from './components/MediaRender';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import { ICoverImageMap } from 'contexts/CreatePostContext';
import useModal from 'hooks/useModal';
import './index.css';
import Modal from 'components/Modal';
import IconButton, {
  Variant as IconButtonVariant,
  Size as IconButtonSize,
} from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { IMedia } from 'interfaces';

export enum Mode {
  View = 'VIEW',
  Edit = 'EDIT',
}

export interface IMediaPreviewProps {
  media: IMedia[];
  className?: string;
  mode?: Mode;
  onClick?: (
    e: MouseEvent<HTMLDivElement>,
    clickIndex: number,
    media: IMedia,
  ) => void;
  onAddButtonClick?: MouseEventHandler<Element>;
  onCloseButtonClick?: MouseEventHandler<Element>;
  onEditButtonClick?: MouseEventHandler<Element>;
  coverImageMap?: ICoverImageMap[];
  dataTestId?: string;
  showAddMediaButton?: boolean;
  showEditButton?: boolean;
  showCloseButton?: boolean;
  isAnnouncementWidgetPreview?: boolean;
}

const MediaPreview: FC<IMediaPreviewProps> = ({
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
  const { t } = useTranslation('components', { keyPrefix: 'MediaPreview' });
  const [mediaIndex, setMediaIndex] = useState<number>(-1);
  const [open, openModal, closeModal] = useModal(true);

  const getMediaHeight = () => {
    if (isAnnouncementWidgetPreview) {
      return '!h-20';
    }
    if (media.length == 1) {
      return '!max-h-80';
    }
    if (media.length > 1 && media.length <= 3) {
      return '!h-64';
    }
    if (media.length > 3) {
      return '!h-80';
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
          preferredSize={PreferredSize.Large}
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            if (mode === Mode.View) {
              setIndexAndOpenCarousel(0);
            } else {
              onClick(e, 1, media[0]);
            }
          }}
          localClassName={`${mediaHeight}`}
          coverImageUrl={
            coverImageMap?.find((map) => map.videoName === media[0].name)
              ?.blobUrl || media[0]?.coverImage?.original
          }
        />
      );
    } else if (media.length === 2) {
      return (
        <div
          className={`grid auto-cols-max grid-flow-row grid-cols-2 ${mediaHeight} ${
            isAnnouncementWidgetPreview ? 'gap-2' : 'gap-4'
          }`}
          tabIndex={0}
          title={`${media.length} media attached to this post`}
        >
          <MediaRender
            data={media[0]}
            localClassName="col-span-1"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-1"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
        <div
          className={`grid auto-cols-max grid-flow-row grid-cols-2 grid-rows-2 ${mediaHeight} ${
            isAnnouncementWidgetPreview ? 'gap-2' : 'gap-4'
          }`}
          tabIndex={0}
          title={`${media.length} media attached to this post`}
        >
          <MediaRender
            data={media[0]}
            localClassName="row-span-2 col-span-1"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-1"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-1"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
      );
    } else if (media.length === 4) {
      return (
        <div
          className={`grid grid-rows-2 grid-cols-2 grid-flow-row auto-cols-auto w-full ${mediaHeight} ${
            isAnnouncementWidgetPreview ? 'gap-2' : 'gap-4'
          }`}
          tabIndex={0}
          title={`${media.length} media attached to this post`}
        >
          <MediaRender
            data={media[0]}
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
      );
    } else if (media.length === 5) {
      return (
        <div
          className={`grid auto-cols-max grid-flow-row grid-cols-6 grid-rows-2 w-full ${mediaHeight} ${
            isAnnouncementWidgetPreview ? 'gap-2' : 'gap-4'
          }`}
          tabIndex={0}
          title={`${media.length} media attached to this post`}
        >
          <MediaRender
            data={media[0]}
            localClassName="col-span-3"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-3"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
      );
    } else if (media.length > 5) {
      return (
        <div
          className={`grid auto-cols-max grid-flow-row grid-cols-6 grid-rows-2 w-full ${mediaHeight} ${
            isAnnouncementWidgetPreview ? 'gap-2' : 'gap-4'
          }`}
          tabIndex={0}
          title={`${media.length} media attached to this post`}
        >
          <MediaRender
            data={media[0]}
            localClassName="col-span-3"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-3"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
            localClassName="col-span-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
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
      );
    }
  };

  return (
    <div className={`${className} relative`}>
      {getLayout()}
      {mode === Mode.Edit && (
        <div className="flex justify-between absolute p-4 top-0 w-full items-center">
          <div>
            {showAddMediaButton && (
              <Button
                label={t('addPhotosVideos')}
                leftIcon="imageFilled"
                className="flex"
                variant={ButtonVariant.Secondary}
                leftIconClassName="mr-1"
                iconColor="text-neutral-900"
                size={Size.Small}
                onClick={onAddButtonClick}
                dataTestId={`${dataTestId}-addphotoscta`}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {showEditButton && (
              <IconButton
                icon="edit"
                onClick={onEditButtonClick}
                variant={IconButtonVariant.Secondary}
                size={IconButtonSize.Medium}
                borderAround
                color="text-black"
                className="bg-white !rounded-7xl"
                borderAroundClassName="!rounded-7xl"
                dataTestId={`${dataTestId}-editicon`}
              />
            )}
            {showCloseButton && (
              <IconButton
                icon="close"
                onClick={onCloseButtonClick}
                variant={IconButtonVariant.Secondary}
                size={IconButtonSize.Medium}
                borderAround
                color="text-black"
                className="bg-white !rounded-7xl"
                borderAroundClassName="!rounded-7xl"
                dataTestId={`${dataTestId}-remove-image`}
              />
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
