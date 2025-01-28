import { useCallback, useEffect, useState } from 'react';

const useModal = (
  initialState = false,
  closeOnEscape = true,
): [
  boolean,
  (modalProps?: Record<string, any>) => any,
  () => any,
  Record<string, any> | undefined,
] => {
  const [open, setOpen] = useState<boolean>(initialState);
  const [modalProps, setModalProps] = useState<Record<string, any> | undefined>(
    {},
  );

  const openModal = useCallback((modalProps?: Record<string, any>) => {
    setOpen(true);
    setModalProps(modalProps);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setModalProps({});
  }, []);

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

  return [open, openModal, closeModal, modalProps];
};

export default useModal;
