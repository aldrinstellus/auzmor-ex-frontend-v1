import { FC, ReactNode } from 'react';

// components
import Navbar from './components/Navbar';
import { useOrgChartStore } from 'stores/orgChartStore';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import JobProgress from 'components/JobProgress';
import { useJobStore } from 'stores/jobStore';
import useProduct from 'hooks/useProduct';
import NavbarLxp from 'components/NavbarLxp';
import useAuth from 'hooks/useAuth';
import { FRONTEND_VIEWS } from 'interfaces';

export interface IAppShellProps {
  children: ReactNode;
}

const AppShell: FC<IAppShellProps> = ({ children }) => {
  const { isOrgChartMounted } = useOrgChartStore();
  const { pathname } = useLocation();
  const { isLxp } = useProduct();
  const { user } = useAuth();

  const wraperStyle = clsx({
    'flex w-full justify-center h-[calc(100%-64px)]': true,
    'px-14 pt-6': !isOrgChartMounted,
  });
  const containerStyle = clsx({
    'w-full': true,
    'max-w-[1440px]': !isOrgChartMounted,
    '!max-w-[1280px]': isLxp,
  });

  const showNavbar =
    !pathname.startsWith('/apps') || !pathname.endsWith('/launch');

  const showJobProgress = useJobStore((state) => state.showJobProgress);

  const style = clsx({
    'bg-neutral-100 h-screen': true,
    'bg-white':
      isLxp && user?.preferences?.learnerViewType !== FRONTEND_VIEWS.modern,
  });

  return (
    <div className={style} id="app-shell-container">
      {showNavbar && !isLxp && <Navbar />}
      {showNavbar && isLxp && <NavbarLxp />}
      <main
        id="main-content"
        aria-label="Main Content"
        role="main"
        className="h-[calc(100vh-78px)] overflow-y-auto"
      >
        <div className={wraperStyle}>
          <div className={containerStyle}>{children}</div>
        </div>
        {showJobProgress && <JobProgress />}
      </main>
    </div>
  );
};

export default AppShell;
