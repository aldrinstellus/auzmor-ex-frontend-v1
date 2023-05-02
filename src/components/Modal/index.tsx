import React, { ReactNode, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import clsx from 'clsx';

export type ModalProps = {
  open: boolean;
  closeModal: () => void | null;
  body: ReactNode | null;
  title?: string;
  footer?: ReactNode | null;
  onBackIconClick?: () => void;
  showBackIcon?: boolean;
  className?: string;
  wMax?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  closeModal,
  title = '',
  body,
  footer = null,
  showBackIcon = false,
  onBackIconClick,
  className = '',
  wMax = 'max-w-xl',
}) => {
  const panelStyle = clsx(
    {
      'w-full transform overflow-hidden bg-white text-left align-middle transition-all rounded-9xl shadow':
        true,
    },
    {
      [wMax]: true,
    },
  );

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
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
                <Dialog.Panel className={panelStyle}>
                  {!!title && (
                    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
                      {showBackIcon && (
                        <Icon
                          name="arrowLeftOutline"
                          stroke={twConfig.theme.colors.neutral['900']}
                          className="ml-4"
                          size={16}
                          onClick={onBackIconClick}
                        />
                      )}

                      <Dialog.Title
                        as="h3"
                        className="text-lg text-black p-4 font-extrabold flex-[50%]"
                      >
                        {title}
                      </Dialog.Title>
                      <IconButton
                        onClick={closeModal}
                        icon={'close'}
                        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
                        variant={IconVariant.Primary}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-neutral-900">{body}</div>
                  </div>

                  {!!footer && <div className="bg-blue-50">{footer}</div>}
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
