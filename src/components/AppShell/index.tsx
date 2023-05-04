import * as React from 'react';
import Navbar from './components/Navbar';
import { useLocation } from 'react-router-dom';

export interface IAppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<IAppShellProps> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="w-screen bg-neutral-100">
      <Navbar />
      {location.pathname === '/feed' ? (
        children
      ) : (
        <div className="pt-8 px-14 flex w-full h-full justify-center">
          {children}
          {/* <div className="max-w-[1600px]">{children}</div> */}
        </div>
      )}
    </div>
  );
};

export default AppShell;
