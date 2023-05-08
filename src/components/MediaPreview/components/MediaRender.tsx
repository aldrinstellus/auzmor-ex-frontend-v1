import { IMedia } from 'contexts/CreatePostContext';
import React from 'react';

export interface IMediaRenderProps {
  data: IMedia;
  overlayCount?: number;
  localClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const MediaRender: React.FC<IMediaRenderProps> = ({
  data,
  overlayCount = -1,
  localClassName,
  onClick,
}) => {
  return (
    <div
      className={`rounded-9xl overflow-hidden w-full h-full bg-no-repeat bg-cover relative ${localClassName}`}
      onClick={onClick}
    >
      <img src={data.originalUrl} className="h-full"></img>
      {overlayCount > 0 && (
        <div className="absolute flex top-0 left-0 bg-black/60 w-full h-full text-4xl justify-center font-bold text-white items-center">
          <span>+{overlayCount}</span>
        </div>
      )}
    </div>
  );
};

export default MediaRender;
