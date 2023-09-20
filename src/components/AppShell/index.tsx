import { FC, ReactNode } from 'react';

// components
import Navbar from './components/Navbar';

export interface IAppShellProps {
  children: ReactNode;
}

const AppShell: FC<IAppShellProps> = ({ children }) => {
  return (
    <div className="bg-neutral-100 h-screen pb-8 overflow-y-auto">
      <Navbar />
      <div className="pt-12 px-14 flex w-full justify-center min-h-[calc(100%-64px)]">
        <div className="w-full max-w-[1440px]">{children}</div>
      </div>
      {/* <div className="pt-8 px-14 flex w-full justify-center">{children}</div> */}
    </div>
  );
};

export default AppShell;
