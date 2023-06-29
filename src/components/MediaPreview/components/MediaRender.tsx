import { IMedia } from 'contexts/CreatePostContext';
import React from 'react';
import { Mode } from '..';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';

export interface IMediaRenderProps {
  data: IMedia;
  overlayCount?: number;
  localClassName?: string;
  mode?: Mode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  coverImageUrl?: string;
}

const MediaRender: React.FC<IMediaRenderProps> = ({
  data,
  overlayCount = -1,
  localClassName,
  mode = Mode.View,
  onClick,
  coverImageUrl,
}) => {
  return (
    <div
      className={`rounded-9xl overflow-hidden w-full h-full bg-no-repeat bg-cover relative ${localClassName} ${
        mode === Mode.View ? 'cursor-pointer ' : ''
      }`}
      onClick={onClick}
    >
      {data.type === 'IMAGE' ? (
        <img
          src={data?.transcodedData?.image?.m || data.original}
          className="object-cover w-full h-full"
          alt={data?.name}
          data-testid="feed-createpost-uploadedmedia"
        />
      ) : (
        <video
          className="object-cover w-full h-full"
          poster={coverImageUrl}
          data-testid="feed-createpost-uploadedmedia"
        >
          <source src={data.original} />
        </video>
      )}

      {data.type === 'VIDEO' && (
        <div className="absolute play-button bg-white rounded-full py-2 pr-2 pl-2.5">
          <Icon
            name="playFilled"
            fill={twConfig.theme.colors.primary['500']}
            size={14}
          />
        </div>
      )}
      {overlayCount > 0 && (
        <div className="absolute flex top-0 left-0 bg-black/60 w-full h-full text-4xl justify-center font-bold text-white items-center">
          <span>+{overlayCount}</span>
        </div>
      )}
    </div>
  );
};

export default MediaRender;
