import { useEffect, useState } from 'react';

const useCarousel = (
  index: number,
  mediaLength: number,
  closeModal?: () => void,
): [number, () => void, () => void, (index: number) => void] => {
  const [currentIndex, setCurrentIndex] = useState<number>(index);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyArrowBind);
    return () => {
      document.removeEventListener('keydown', handleKeyArrowBind);
    };
  }, [currentIndex]);

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

  const handleKeyArrowBind = (event: any) => {
    if (event?.key === 'ArrowLeft') {
      prevSlide();
    } else if (event?.key === 'ArrowRight') {
      nextSlide();
    } else if (event?.key === 'Escape' && closeModal) {
      closeModal();
    }
  };

  return [currentIndex, prevSlide, nextSlide, setCurrentIndex];
};

export default useCarousel;
