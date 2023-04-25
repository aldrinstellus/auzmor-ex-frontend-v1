import React, { useRef } from 'react';

export interface IMedia {
  name: string;
  src: string;
  type: string;
  hash?: string;
  coverPage?: string;
}

export type VideoProps = {
  video: IMedia;
};

const Video = ({ video }: VideoProps) => {
  const videoRef = useRef(null);

  const videoHandler = () => {
    //   videoRef.current.play();
  };
  return (
    <div className="w-full h-full flex items-center ">
      <div onClick={() => videoHandler()} className="absolute left-[50%]">
        Play
      </div>
      <video
        className="w-full h-full"
        src={video.src}
        controls={true}
        ref={videoRef}
      />
    </div>
  );
};

export default Video;
