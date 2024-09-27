import { Role } from 'utils/enum';
import useAuth from './useAuth';
import { useLocation } from 'react-router-dom';
import useProduct from './useProduct';

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

  let isAdminOrSuperAdmin = [Role.Admin, Role.SuperAdmin].includes(
    user?.role || Role.Member,
  );
  const isOwner = user?.id === userId;
  let isOwnerOrAdmin = isAdminOrSuperAdmin || user?.id === userId;
  let isMember = user?.role === Role.Member;
  let isAdmin = exact ? user?.role === Role.Admin : isAdminOrSuperAdmin;
  let isSuperAdmin = user?.role === Role.SuperAdmin;

  if (isLxp) {
    const isLearner = pathname.split('/')[1] === 'user';
    if (isLearner) {
      isAdminOrSuperAdmin = false;
      isOwnerOrAdmin = isAdminOrSuperAdmin || user?.id === userId;
      isMember = true;
      isAdmin = false;
      isSuperAdmin = false;
    }
  }

  return {
    isOwner,
    isOwnerOrAdmin,
    isMember,
    isAdmin,
    isSuperAdmin,
  };
};

export default useRole;
