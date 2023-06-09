import Carousel from 'components/CarouselNew';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';

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
  } = useContext(CreatePostContext);
  return (
    <Carousel
      media={media}
      className="m-6"
      onClose={(e, data, index) => {
        removeMedia(index, () => {
          if (media.length === 1) {
            setActiveFlow(CreatePostFlow.CreatePost);
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
      dataTestId={dataTestId}
    />
  );
};

export default Body;
