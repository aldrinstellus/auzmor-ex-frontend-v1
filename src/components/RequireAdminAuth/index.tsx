import useRole from 'hooks/useRole';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IRequireAdminAuthProps {}

const RequireAdminAuth: FC<IRequireAdminAuthProps> = () => {
  const { isAdmin } = useRole();

  if (isAdmin) {
    return <Outlet />;
  }
  return <Navigate to={!isAdmin && '/404'} />;
};

export default RequireAdminAuth;
