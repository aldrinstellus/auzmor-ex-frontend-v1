import AppShell from 'components/AppShell';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { setItem } from 'utils/persist';

interface IRequireAuthProps {}

const RequireAuth: React.FC<IRequireAuthProps> = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return (
      <AppShell>
        <React.Suspense
          fallback={
            <div className="w-full h-screen">
              <PageLoader />
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </AppShell>
    );
  }

  setItem('redirect_post_login_to', location.pathname);
  return <Navigate to="/login" />;
};

export default RequireAuth;
