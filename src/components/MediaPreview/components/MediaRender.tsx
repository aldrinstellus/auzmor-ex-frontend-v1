import { IMedia } from 'interfaces';
import { Mode } from '..';
import Icon from 'components/Icon';
import BlurImg from 'components/Image/components/BlurImg';
import { FC, MouseEventHandler } from 'react';

export enum PreferredSize {
  Small = 's',
  Medium = 'm',
  Large = 'l',
}

export interface IMediaRenderProps {
  data: IMedia;
  overlayCount?: number;
  localClassName?: string;
  mode?: Mode;
  preferredSize?: PreferredSize;
  onClick?: (e: any) => void;
  coverImageUrl?: string;
  isAnnouncementWidgetPreview?: boolean;
}

const MediaRender: FC<IMediaRenderProps> = ({
  data,
  overlayCount = -1,
  localClassName,
  mode = Mode.View,
  preferredSize = PreferredSize.Medium,
  onClick,
  coverImageUrl,
  isAnnouncementWidgetPreview = false,
}) => {
  const blurImgProps = {
    src: data?.transcodedData?.image?.[preferredSize] || data.original,
    className: 'object-cover w-full h-full',
    key: data?.name,
    alt: data?.name,
    blurhash: data?.blurhash,
    'data-testid': 'feed-createpost-uploadedmedia',
  };

  return (
    <div
      className={`rounded-9xl border-1 border-neutral-200 overflow-hidden w-full h-full bg-no-repeat bg-cover relative ${localClassName} ${
        mode === Mode.View ? 'cursor-pointer ' : ''
      }`}
      tabIndex={0}
      onKeyUp={(e) => (e.code === 'Enter' ? onClick && onClick(e) : '')}
      onClick={onClick as MouseEventHandler<HTMLDivElement>}
    >
      {data.type === 'IMAGE' ? (
        <BlurImg {...blurImgProps} />
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
          <Icon name="playFilled" color="text-primary-500" size={14} />
        </div>
      )}
      {overlayCount > 0 && (
        <div
          className={`absolute flex top-0 left-0 bg-black/60 w-full h-full ${
            isAnnouncementWidgetPreview ? 'text-xl' : 'text-4xl'
          } justify-center font-bold text-white items-center`}
        >
          <span>+{overlayCount}</span>
        </div>
      )}
    </div>
  );
};

export default MediaRender;
