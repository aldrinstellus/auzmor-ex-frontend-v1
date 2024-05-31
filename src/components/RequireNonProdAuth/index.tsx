import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireNonProdAuth: FC = () => {
  const isProd = process.env.NODE_ENV == 'production';
  if (!isProd) {
    return <Outlet />;
  }
  return <Navigate to={'/404'} />;
};

export default RequireNonProdAuth;
