import { useEffect } from 'react';

const useScrollTop = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return true;
};

export default useScrollTop;
