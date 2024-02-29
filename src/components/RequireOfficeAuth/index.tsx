import useProduct from 'hooks/useProduct';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IRequireOfficeAuth {}

const RequireOfficeAuth: FC<IRequireOfficeAuth> = () => {
  const { isOffice } = useProduct();

  if (isOffice) {
    return <Outlet />;
  }
  return <Navigate to={'/404'} />;
};

export default RequireOfficeAuth;
