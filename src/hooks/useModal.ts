import { useCallback, useEffect, useState } from 'react';

const useModal = (
  initialState = false,
  closeOnEscape = true,
): [boolean, () => any, () => any] => {
  const [open, setOpen] = useState<boolean>(initialState);

  const openModal = useCallback(() => setOpen(true), []);

  const closeModal = useCallback(() => setOpen(false), []);

  const handleKeyArrowBind = (event: any) => {
    if (event?.key === 'Escape' && closeOnEscape) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyArrowBind);
    return () => {
      document.removeEventListener('keydown', handleKeyArrowBind);
    };
  }, []);

  return [open, openModal, closeModal];
};

export default useModal;
