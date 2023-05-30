import Carousel from 'components/CarouselNew';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';

export interface IBodyProps {
  currentIndex: number;
  nextSlide: () => void;
  prevSlide: () => void;
}

const Body: React.FC<IBodyProps> = ({ currentIndex, nextSlide, prevSlide }) => {
  const {
    setActiveFlow,
    media,
    removeMedia,
    deleteCoverImageMap,
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
        deleteCoverImageMap({
          videoName: media[currentIndex].name,
          coverImageName: '',
        });
      }}
      currentIndex={currentIndex}
      prevSlide={prevSlide}
      nextSlide={nextSlide}
      coverImageUrl={getCoverImageBlobURL(media[currentIndex])}
    />
  );
};

export default Body;
