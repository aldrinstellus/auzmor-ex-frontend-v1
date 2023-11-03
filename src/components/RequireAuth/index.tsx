import AppShell from 'components/AppShell';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import { FC, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { setItem } from 'utils/persist';

interface IRequireAuthProps {}

const RequireAuth: FC<IRequireAuthProps> = () => {
  const { user, loggedIn } = useAuth();
  const location = useLocation();

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

  setItem('redirect_post_login_to', location.pathname);
  return <Navigate to={loggedIn ? '/logout' : '/login'} />;
};

export default RequireAuth;
