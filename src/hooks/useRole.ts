import useAuth from './useAuth';
import { useLocation } from 'react-router-dom';
import useProduct from './useProduct';
import { UserRole } from 'interfaces';

interface IRoleProps {
  exact?: boolean;
  userId?: string;
}

const useRole = (
  { exact, userId }: IRoleProps = { exact: false, userId: '' },
) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { isLxp } = useProduct();

  let isAdminOrSuperAdmin = [UserRole.Admin, UserRole.Superadmin].includes(
    user?.role || UserRole.Member,
  );
  const isOwner = user?.id === userId;
  let isOwnerOrAdmin = isAdminOrSuperAdmin || user?.id === userId;
  let isMember = user?.role === UserRole.Member;
  let isAdmin = exact ? user?.role === UserRole.Admin : isAdminOrSuperAdmin;
  let isSuperAdmin = user?.role === UserRole.Superadmin;

  // Used for lxp only
  const isLearner = pathname.split('/')[1] === 'user';

  if (isLxp && isLearner) {
    isAdminOrSuperAdmin = false;
    isOwnerOrAdmin = isAdminOrSuperAdmin || user?.id === userId;
    isMember = true;
    isAdmin = false;
    isSuperAdmin = false;
  }

  return {
    isOwner,
    isOwnerOrAdmin,
    isMember,
    isAdmin,
    isSuperAdmin,
    isLearner,
  };
};

export default useRole;
