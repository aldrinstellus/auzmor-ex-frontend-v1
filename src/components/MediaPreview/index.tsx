import React from 'react';
import MediaRender from './components/MediaRender';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import { IMedia } from 'contexts/CreatePostContext';

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
  const getLayout = () => {
    if (media.length === 0) {
    } else if (media.length === 1) {
      return (
        <MediaRender data={media[0]} onClick={(e) => onClick(e, 1, media[0])} />
      );
    } else if (media.length === 2) {
      return (
        <div className="flex w-full h-full">
          <MediaRender
            data={media[0]}
            localClassName="mr-4"
            onClick={(e) => onClick(e, 1, media[0])}
          />
          <MediaRender
            data={media[1]}
            onClick={(e) => onClick(e, 2, media[1])}
          />
        </div>
      );
    } else if (media.length === 3) {
      return (
        <div className="flex w-full h-full">
          <div className="mr-4">
            <MediaRender
              data={media[0]}
              onClick={(e) => onClick(e, 1, media[0])}
            />
          </div>
          <div className="flex flex-col">
            <MediaRender
              data={media[1]}
              localClassName="mb-4"
              onClick={(e) => onClick(e, 2, media[1])}
            />
            <MediaRender
              data={media[2]}
              onClick={(e) => onClick(e, 3, media[2])}
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
              onClick={(e) => onClick(e, 1, media[0])}
            />
            <MediaRender
              data={media[1]}
              onClick={(e) => onClick(e, 2, media[1])}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={(e) => onClick(e, 3, media[2])}
            />
            <MediaRender
              data={media[3]}
              onClick={(e) => onClick(e, 4, media[3])}
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
              onClick={(e) => onClick(e, 1, media[0])}
            />
            <MediaRender
              data={media[1]}
              onClick={(e) => onClick(e, 2, media[1])}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={(e) => onClick(e, 3, media[2])}
            />
            <MediaRender
              data={media[3]}
              localClassName="mr-4"
              onClick={(e) => onClick(e, 4, media[3])}
            />
            <MediaRender
              data={media[4]}
              onClick={(e) => onClick(e, 5, media[3])}
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
              onClick={(e) => onClick(e, 1, media[0])}
            />
            <MediaRender
              data={media[1]}
              onClick={(e) => onClick(e, 2, media[1])}
            />
          </div>
          <div className="flex">
            <MediaRender
              data={media[2]}
              localClassName="mr-4"
              onClick={(e) => onClick(e, 3, media[2])}
            />
            <MediaRender
              data={media[3]}
              localClassName="mr-4"
              onClick={(e) => onClick(e, 4, media[3])}
            />
            <MediaRender
              data={media[4]}
              overlayCount={media.length - 5}
              onClick={(e) => onClick(e, 5, media[4])}
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
    </div>
  );
};

export default MediaPreview;
