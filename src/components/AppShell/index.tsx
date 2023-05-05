import * as React from 'react';
import Navbar from './components/Navbar';

export interface IAppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<IAppShellProps> = ({ children }) => {
  return (
    <div className="bg-neutral-100">
      <Navbar />
      <div className="pt-8 px-14 flex w-full h-[calc(100vh-64px)] overflow-y-auto justify-center">
        {children}
        {/* <div className="max-w-[1600px]">{children}</div> */}
      </div>
    </div>
  );
};

export default AppShell;
