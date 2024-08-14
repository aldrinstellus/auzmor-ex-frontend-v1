import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { IS_PROD } from 'utils/constants';

const RequireNonProdAuth: FC = () => {
  if (!IS_PROD) {
    return <Outlet />;
  }
  return <Navigate to={'/404'} />;
};

export default RequireNonProdAuth;
