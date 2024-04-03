import { useEffect, useRef } from 'react';

const useScrollTop = (eleId: string) => {
  const scrollTopRef = useRef(0);
  const pauseRef = useRef(false);
  const getScrollTop = () => scrollTopRef.current;
  const setScrollTop = (value: number) => (scrollTopRef.current = value);
  const pauseRecordingScrollTop = () => (pauseRef.current = true);
  const resumeRecordingScrollTop = () => (pauseRef.current = false);
  const getPauseStatus = () => pauseRef.current;

  useEffect(() => {
    const ele = document.getElementById(eleId);
    if (ele) {
      ele.addEventListener('scroll', () => {
        if (!!!getPauseStatus()) {
          scrollTopRef.current = ele.scrollTop;
        }
      });
    }
  }, []);

  return {
    scrollTopRef,
    getScrollTop,
    setScrollTop,
    pauseRecordingScrollTop,
    resumeRecordingScrollTop,
    getPauseStatus,
  };
};

export default useScrollTop;
