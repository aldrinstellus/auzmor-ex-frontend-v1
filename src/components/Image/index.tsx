import React, { useState } from 'react';
import { IMedia } from 'contexts/CreatePostContext';
import BlurImg from './components/BlurImg';

export type ImageProps = {
  image: IMedia;
};

const Image: React.FC<ImageProps> = ({
  image = { blurhash: '', name: '', original: '', type: '' },
}) => {
  const imgProps = {
    blurhash: image.blurhash,
    src: image.original,
    key: image.name,
    alt: image.name,
    className: 'w-full h-full object-contain',
  };

  return (
    <div className="w-full h-full relative">
      <BlurImg {...imgProps} />
    </div>
  );
};

export default Image;
