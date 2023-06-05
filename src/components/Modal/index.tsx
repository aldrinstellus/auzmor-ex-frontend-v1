import React, { ReactNode, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Icon from 'components/Icon';

export type ModalProps = {
  open: boolean;
  closeModal?: () => void | null;
  children: ReactNode;
  className?: string;
  showModalCloseBtn?: boolean;
  size?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  closeModal,
  children,
  className = 'max-w-xl',
  showModalCloseBtn = false,
  size,
}) => {
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
    // <>
    //   <Transition appear show={open} as={Fragment}>
    //     <Dialog
    //       as="div"
    //       className="relative z-10 "
    //       onClose={() => (!!closeModal ? closeModal() : null)}
    //     >
    //       <Transition.Child
    //         as={Fragment}
    //         enter="ease-out duration-300"
    //         enterFrom="opacity-0"
    //         enterTo="opacity-100"
    //         leave="ease-in duration-200"
    //         leaveFrom="opacity-100"
    //         leaveTo="opacity-0"
    //       >
    //         <div className="fixed inset-0 bg-black bg-opacity-25" />
    //       </Transition.Child>

    //       <div className="fixed inset-0 overflow-y-auto">
    //         <div className="flex min-h-full items-center justify-center p-4 text-center">
    //           <Transition.Child
    //             as={Fragment}
    //             enter="ease-out duration-300"
    //             enterFrom="opacity-0 scale-95"
    //             enterTo="opacity-100 scale-100"
    //             leave="ease-in duration-200"
    //             leaveFrom="opacity-100 scale-100"
    //             leaveTo="opacity-0 scale-95"
    //           >
    //             <Dialog.Panel className={panelStyle}>{children}</Dialog.Panel>
    //           </Transition.Child>
    //         </div>
    //       </div>
    //     </Dialog>
    //   </Transition>
    // </>
    open ? (
      <div
        className="fixed inset-0 top-0 left-0 right-0 w-screen h-screen bg-black/60 z-50 flex justify-center items-center"
        onClick={closeModal}
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
    ) : (
      <></>
    )
  );
};

export default Modal;
