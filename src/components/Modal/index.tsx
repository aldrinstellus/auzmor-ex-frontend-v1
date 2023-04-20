import React, { ReactNode } from 'react';
import Close from 'images/close.svg';

type ModalProps = {
  open: boolean;
  setOpen: (show: boolean) => void;
  title: string;
  body: ReactNode | null;
  footer: ReactNode | null;
};

const Modal: React.FC<ModalProps> = ({
  open,
  setOpen,
  title,
  body,
  footer,
}) => {
  return (
    <div>
      {open ? (
        <>
          <div
            className="justify-center mt-12 flex 
            overflow-x-hidden 
            overflow-y-auto 
            fixed 
            inset-5 z-50 
            outline-none focus:outline-none w-full"
          >
            <div className="relative w-[38%] my-6 max-w-[1600]">
              <div className="border-0 rounded-9xl shadow-lg w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between h-14 p-4 border-b border-solid">
                  <h3 className="text-lg text-black font-['manrope'] font-extrabold">
                    {title}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-1 float-right leading-none outline-none focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="bg-transparent text-black opacity-1 h-8 w-8 text-3xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <div className="text-lg leading-relaxed">
                    <p className="text-sm text-neutral-900">{body}</p>
                  </div>
                </div>
                <div className="border-t border-solid border-slate-200 rounded-b bg-blue-50">
                  {footer}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-2 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default Modal;
