import { FC } from 'react';

import ModernNavbar from './components/Navbar.modern';
import ClassicNavbar from './components/Navbar.classic';
import useRole from 'hooks/useRole';
import AdminNavbar from './components/AdminNavbar.classic';
import { FRONTEND_VIEWS } from './components/SwitchView';

interface INavbarLxpProps {
  view: FRONTEND_VIEWS;
}

const NavbarLxp: FC<INavbarLxpProps> = ({ view, ...rest }) => {
  const { isOwnerOrAdmin } = useRole();

  if (isOwnerOrAdmin) {
    return <AdminNavbar />;
  }

  switch (view) {
    case FRONTEND_VIEWS.modern:
      return <ModernNavbar {...rest} />;

    default:
      return <ClassicNavbar {...rest} />;
  }
};

export default NavbarLxp;
