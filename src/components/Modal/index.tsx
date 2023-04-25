import React, { ReactNode, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import IconButton, { Variant as IconVariant } from 'components/IconButton';

export type ModalProps = {
  open: boolean;
  closeModal: () => void | null;
  body: ReactNode | null;
  title?: string;
  footer?: ReactNode | null;
};

const Modal: React.FC<ModalProps> = ({
  open,
  closeModal,
  title = '',
  body,
  footer = null,
}) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  {!!title && (
                    <div className="flex flex-wrap">
                      <Dialog.Title
                        as="h3"
                        className="text-lg text-[#000000] p-4 font-bold flex-[50%]"
                      >
                        {title}
                      </Dialog.Title>
                      <IconButton
                        onClick={closeModal}
                        icon={'X'}
                        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
                        variant={IconVariant.Primary}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-neutral-900">{body}</p>
                  </div>

                  {!!footer && (
                    <div className="mt-[16px] bg-blue-50">{footer}</div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
