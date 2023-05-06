import React from 'react';
import { IMedia, Mode } from '..';

const MediaRender: React.FC<{
  data: IMedia;
  overlayCount?: number;
  localClassName?: string;
  mode?: Mode;
  onClick?: any;
}> = ({
  data,
  overlayCount = -1,
  localClassName,
  mode = Mode.View,
  onClick,
}) => {
  return (
    <div
      className={`rounded-9xl overflow-hidden w-full h-full bg-no-repeat bg-cover relative ${
        data.className
      } ${localClassName} ${mode === Mode.View ? 'cursor-pointer ' : ''}`}
      onClick={onClick}
    >
      <img src={data.url} className="h-full"></img>
      {overlayCount > 0 && (
        <div className="absolute flex top-0 left-0 bg-black/60 w-full h-full text-4xl justify-center font-bold text-white items-center">
          <span>+{overlayCount}</span>
        </div>
      )}
    </div>
  );
};

export default MediaRender;
