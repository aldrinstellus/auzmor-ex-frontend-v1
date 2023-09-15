import Carousel from 'components/CarouselNew';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useEffect } from 'react';

export interface IBodyProps {
  currentIndex: number;
  nextSlide: () => void;
  prevSlide: () => void;
  dataTestId?: string;
}

const Body: React.FC<IBodyProps> = ({
  currentIndex,
  nextSlide,
  prevSlide,
  dataTestId,
}) => {
  const {
    setActiveFlow,
    media,
    removeMedia,
    setShowFullscreenVideo,
    getCoverImageBlobURL,
    mediaOpenIndex,
    setMediaOpenIndex,
    setPostType,
  } = useContext(CreatePostContext);
  return (
    <Carousel
      media={media}
      className="m-6 max-h-[60vh] overflow-y-auto"
      onClose={(e, data, index) => {
        removeMedia(index, () => {
          if (media.length === 1) {
            setActiveFlow(CreatePostFlow.CreatePost);
            setPostType(null);
          } else if (media.length - 1 === currentIndex) {
            nextSlide();
          }
        });
      }}
      currentIndex={currentIndex}
      prevSlide={prevSlide}
      nextSlide={nextSlide}
      coverImageUrl={getCoverImageBlobURL(media[currentIndex])}
      setShowFullscreenVideo={setShowFullscreenVideo}
      autoplayIndex={mediaOpenIndex}
      resetAutoplayIndex={() => setMediaOpenIndex(-1)}
      dataTestId={dataTestId}
    />
  );
};

export default Body;
