import { useState } from 'react';

const useModal = (initialState = false): [boolean, () => any, () => any] => {
  const [open, setOpen] = useState<boolean>(initialState);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  return [open, openModal, closeModal];
};

export default useModal;
