import useProduct from 'hooks/useProduct';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireNonProdAuth: FC = () => {
  const isProd = process.env.REACT_APP_ENV === 'PRODUCTION';
  const { isLxp } = useProduct();
  if (isProd && isLxp) {
    // only for lxp channels routes
    return <Outlet />;
  }
  if (!isProd) {
    return <Outlet />;
  }
  return <Navigate to={'/404'} />;
};

export default RequireNonProdAuth;
