import React, { ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ToastProps = {
  notificationIcon?: ReactNode;
  toastBody?: string;
  notificationType?: string;
  onClick?: () => void;
  undo?: boolean;
  button?: string;
};

const Toast: React.FC<ToastProps> = ({
  notificationIcon = null,
  toastBody = '',
  notificationType = '',
  onClick = () => {},
  undo = true,
  button = '',
}) => {
  // const notify = () =>
  //   toast(() => {
  //     return (
  //       <div className="p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <span className="mr-4">{notificationIcon}</span>
  //             {notificationType}
  //           </div>
  //           {undo && <div onClick={onClick}>Undo</div>}
  //           <span className="-ml-20">X</span>
  //         </div>
  //         {toastBody}
  //         {!!button && <Button label={button} />}
  //       </div>
  //     );
  //   });

  return (
    <div style={{ width: 500, height: 500 }}>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Toast;
