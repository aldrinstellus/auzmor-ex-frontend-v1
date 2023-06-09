import React, { ReactNode } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';

export type ModalProps = {
  open: boolean;
  closeModal?: () => void | null;
  children: ReactNode;
  className?: string;
  showModalCloseBtn?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  open,
  closeModal,
  children,
  className = 'max-w-xl',
  showModalCloseBtn = false,
}) => {
  if (!open) {
    return null;
  }
  const panelStyle = clsx(
    {
      'w-full transform overflow-hidden bg-white text-left align-middle rounded-9xl shadow':
        true,
    },
    {
      [className]: true,
    },
  );

  return (
    <div
      className={`fixed inset-0 flex items-center z-50 transition-opacity ${
        open ? 'visible bg-black/60' : 'invisible'
      } backdrop-blur-sm`}
      onClick={closeModal}
    >
      <div
        className={`
        flex justify-center
        min-w-full
        transition-opacity
      ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
      >
        {showModalCloseBtn && (
          <div
            className={`${panelStyle} fixed bg-transparent overflow-visible`}
          >
            <Icon
              name="close"
              className="absolute -top-6 -right-6"
              fill={'#fff'}
              onClick={closeModal}
            />
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()} className={panelStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
