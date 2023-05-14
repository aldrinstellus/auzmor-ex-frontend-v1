import { useState } from 'react';

const useCarousel = (
  index: number,
  mediaLength: number,
): [number, () => void, () => void] => {
  const [currentIndex, setCurrentIndex] = useState<number>(index);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? mediaLength - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === mediaLength - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return [currentIndex, prevSlide, nextSlide];
};

export default useCarousel;
