import { FC } from 'react';

import ModernNavbar from './components/Navbar.modern';
import ClassicNavbar from './components/Navbar.classic';
import useRole from 'hooks/useRole';
import AdminNavbar from './components/AdminNavbar.classic';
import useAuth from 'hooks/useAuth';
import { FRONTEND_VIEWS } from 'interfaces';

const NavbarLxp: FC = () => {
  const { isOwnerOrAdmin } = useRole();
  const { user } = useAuth();

  if (isOwnerOrAdmin) {
    return <AdminNavbar />;
  }

  switch (user?.preferences?.learnerViewType) {
    case FRONTEND_VIEWS.modern:
      return <ModernNavbar />;

    default:
      return <ClassicNavbar />;
  }
};

export default NavbarLxp;
