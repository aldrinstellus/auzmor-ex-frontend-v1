import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import Icon from 'components/Icon';
import IconWrapper from 'components/Icon/components/IconWrapper';

export type ModalProps = {
  open: boolean;
  closeModal?: () => void | null;
  children: ReactNode;
  className?: string;
  showModalCloseBtn?: boolean;
  dataTestId?: string;
  wrapperClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

const Modal: FC<ModalProps> = ({
  open,
  closeModal,
  children,
  className = 'max-w-xl',
  showModalCloseBtn = false,
  dataTestId = '',
  wrapperClassName = '',
  onKeyDown,
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
  const wrapperStyle = clsx({
    'flex justify-center min-w-full': true,
    [wrapperClassName]: true,
  });

  return (
    <>
      {ReactDOM.createPortal(
        <CSSTransition in={open} timeout={200} classNames="modal" unmountOnExit>
          <div
            className="z-[999] flex items-center justify-center fixed left-0 right-0 top-0 bottom-0 backdrop-blur-sm bg-black/60"
            onClick={closeModal}
            onKeyDown={onKeyDown}
          >
            <div className={wrapperStyle} data-testid={dataTestId}>
              {showModalCloseBtn && (
                <div
                  className={`${panelStyle} fixed bg-transparent overflow-visible`}
                >
                  <IconWrapper className="absolute -right-8">
                    <Icon
                      name="close"
                      color="text-primary-500"
                      onClick={closeModal}
                      size={14}
                    />
                  </IconWrapper>
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
