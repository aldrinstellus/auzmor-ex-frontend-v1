import AppShell from 'components/AppShell';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import useProduct from 'hooks/useProduct';
import { FC, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLearnUrl } from 'utils/misc';
import { setItem } from 'utils/persist';

interface IRequireAuthProps {}

const RequireAuth: FC<IRequireAuthProps> = () => {
  const { user, loggedIn } = useAuth();
  const { pathname } = useLocation();
  const { isLxp } = useProduct();

  if (user?.organization.type === 'LMS') {
    if (!pathname.startsWith('/apps') && !pathname.startsWith('/user/apps')) {
      return <Navigate to="404" />;
    }
  }

  if (user) {
    return (
      <AppShell>
        <Suspense
          fallback={
            <div className="w-full h-screen">
              <PageLoader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell>
    );
  }

  setItem('redirect_post_login_to', pathname);
  if (isLxp) {
    window.location.replace(getLearnUrl());
    return <div className="w-full h-screen">
      <PageLoader />
    </div>;
  }
  return <Navigate to={loggedIn ? '/logout' : '/login'} />;
};

export default RequireAuth;
