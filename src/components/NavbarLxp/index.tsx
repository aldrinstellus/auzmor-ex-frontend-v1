import { FC } from 'react';

import ModernNavbar from './components/Navbar.modern';
import ClassicNavbar from './components/Navbar.classic';
import useRole from 'hooks/useRole';
import AdminNavbar from './components/AdminNavbar.classic';

interface INavbarLxpProps {
  view: string;
}

const NavbarLxp: FC<INavbarLxpProps> = ({ view, ...rest }) => {
  const { isOwnerOrAdmin } = useRole();

  if (isOwnerOrAdmin) {
    return <AdminNavbar />;
  }

  switch (view) {
    case 'modern':
      return <ModernNavbar {...rest} />;

    default:
      return <ClassicNavbar {...rest} />;
  }
};

export default NavbarLxp;
