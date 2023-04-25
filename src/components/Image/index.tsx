import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface IMedia {
  name: string;
  src: string;
  type: string;
  hash?: string;
}

export interface hashSize {
  width: number;
  height: number;
}

export type ImageProps = {
  image: IMedia;
  hashSize?: hashSize;
};

const Image: React.FC<ImageProps> = ({
  image = { hash: '', name: '', src: '', type: '' },
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
      {image.hash && hashSize && !isLoaded && isLoadStarted && (
        <Blurhash
          className="!absolute z-20 top-0 left-0"
          width={hashSize.width}
          height={hashSize.height}
          hash={image.hash}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      <LazyLoadImage
        className="w-full h-full"
        key={image.name}
        alt={image.name}
        src={image.src}
        // @ts-ignore
        onLoad={handleLoad}
        beforeLoad={handleLoadStarted}
      />
    </div>
  );
};

export default Image;
