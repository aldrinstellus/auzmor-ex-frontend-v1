import React, { useState } from 'react';
// import { Blurhash } from 'react-blurhash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IMedia } from 'contexts/CreatePostContext';

export interface hashSize {
  width: number;
  height: number;
}

export type ImageProps = {
  image: IMedia;
  hashSize?: hashSize;
};

const Image: React.FC<ImageProps> = ({
  image = { blurhash: '', name: '', originalUrl: '', type: '' },
  hashSize,
}) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadStarted, setLoadStarted] = useState(false);

  const handleLoad = () => {
    setTimeout(() => {
      setLoaded(true);
      console.log('Delayed for 10 second.');
    }, 10000);
  };

  const handleLoadStarted = () => {
    console.log('Started: ');
    setLoadStarted(true);
  };

  return (
    <div className="w-full h-full relative">
      {/* {image.blurhash && hashSize && !isLoaded && isLoadStarted && (
        <Blurhash
          className="!absolute z-20 top-0 left-0"
          width={hashSize.width}
          height={hashSize.height}
          hash={image.blurhash}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )} */}
      <LazyLoadImage
        className="w-full h-full"
        key={image.name}
        alt={image.name}
        src={image.originalUrl}
        // @ts-ignore
        onLoad={handleLoad}
        beforeLoad={handleLoadStarted}
      />
    </div>
  );
};

export default Image;
