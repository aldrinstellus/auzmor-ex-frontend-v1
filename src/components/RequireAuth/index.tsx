import AppShell from 'components/AppShell';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IRequireAuthProps {}

const RequireAuth: React.FC<IRequireAuthProps> = () => {
  // ⬇️ get authentication
  const { user } = useAuth();

  return !user ? (
    <AppShell>
      <Outlet />
    </AppShell>
  ) : (
    <Navigate to="/login" />
  );
};

export default RequireAuth;
