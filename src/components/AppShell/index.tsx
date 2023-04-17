import * as React from 'react';
import Navbar from './components/Navbar';

export interface IAppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<IAppShellProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-neutral-100">
      <Navbar />
      <div className="pt-12 flex w-full justify-center">
        <div className="max-w-[1600px]">{children}</div>
      </div>
    </div>
  );
};

export default AppShell;
