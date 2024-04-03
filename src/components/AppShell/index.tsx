import { FC, ReactNode } from 'react';

// components
import Navbar from './components/Navbar';
import { useOrgChartStore } from 'stores/orgChartStore';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import JobProgress from 'components/JobProgress';
import { useJobStore } from 'stores/jobStore';

export interface IAppShellProps {
  children: ReactNode;
}

const AppShell: FC<IAppShellProps> = ({ children }) => {
  const { isOrgChartMounted } = useOrgChartStore();
  const { pathname } = useLocation();
  const wraperStyle = clsx({
    'flex w-full justify-center min-h-[calc(100%-64px)]': true,
    'px-14 pt-6': !isOrgChartMounted,
  });
  const containerStyle = clsx({
    'w-full': true,
    'max-w-[1440px]': !isOrgChartMounted,
  });

  const showNavbar =
    !pathname.startsWith('/apps') || !pathname.endsWith('/launch');

  const showJobProgress = useJobStore((state) => state.showJobProgress);

  return (
    <div
      className="bg-neutral-100 h-screen overflow-y-auto"
      id="app-shell-container"
    >
      {showNavbar && <Navbar />}
      <div className={wraperStyle}>
        <div className={containerStyle}>{children}</div>
      </div>
      {showJobProgress && <JobProgress />}
      {/* <div className="pt-8 px-14 flex w-full justify-center">{children}</div> */}
    </div>
  );
};

export default AppShell;
