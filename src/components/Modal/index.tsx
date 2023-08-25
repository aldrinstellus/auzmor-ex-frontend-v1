import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import Icon from 'components/Icon';

export type ModalProps = {
  open: boolean;
  closeModal?: () => void | null;
  children: ReactNode;
  className?: string;
  showModalCloseBtn?: boolean;
  dataTestId?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  closeModal,
  children,
  className = 'max-w-xl',
  showModalCloseBtn = false,
  dataTestId = '',
}) => {
  const panelStyle = clsx(
    {
      'w-full transform bg-white text-left align-middle rounded-9xl shadow modalContent':
        true,
    },
    {
      [className]: true,
    },
  );
  return (
    <>
      {ReactDOM.createPortal(
        <CSSTransition in={open} timeout={200} classNames="modal" unmountOnExit>
          <div
            className="z-50 flex items-center justify-center fixed left-0 right-0 top-0 bottom-0 backdrop-blur-sm bg-black/60"
            onClick={closeModal}
          >
            <div
              className="flex justify-center min-w-full"
              data-testid={dataTestId}
            >
              {showModalCloseBtn && (
                <div
                  className={`${panelStyle} fixed bg-transparent overflow-visible`}
                >
                  <Icon
                    name="close"
                    className="absolute -top-6 -right-6"
                    color="text-white"
                    onClick={closeModal}
                  />
                </div>
              )}
              <div className={panelStyle} onClick={(e) => e.stopPropagation()}>
                {children}
              </div>
            </div>
          </div>
        </CSSTransition>,
        document.getElementById('modal')!,
      )}
    </>
  );
};

export default Modal;
