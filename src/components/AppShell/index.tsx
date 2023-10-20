import { FC, ReactNode } from 'react';

// components
import Navbar from './components/Navbar';
import { useOrgChartStore } from 'stores/orgChartStore';
import clsx from 'clsx';

export interface IAppShellProps {
  children: ReactNode;
}

const AppShell: FC<IAppShellProps> = ({ children }) => {
  const { isOrgChartMounted } = useOrgChartStore();
  const wraperStyle = clsx({
    'pt-10 flex w-full justify-center min-h-[calc(100%-64px)]': true,
    'px-14': !isOrgChartMounted,
  });
  const containerStyle = clsx({
    'w-full': true,
    'max-w-[1440px]': !isOrgChartMounted,
  });
  return (
    <div className="bg-neutral-100 h-screen overflow-y-auto">
      <Navbar />
      <div className={wraperStyle}>
        <div className={containerStyle}>{children}</div>
      </div>
      {/* <div className="pt-8 px-14 flex w-full justify-center">{children}</div> */}
    </div>
  );
};

export default AppShell;
