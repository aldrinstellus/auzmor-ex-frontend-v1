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

  const isAdminOrSuperAdmin = [Role.Admin, Role.SuperAdmin].includes(
    // @ts-ignore
    user?.role,
  );

  const isLearner = pathname.split('/')[1] === 'user';

  if (isLxp && isLearner) {
    return {
      isOwner: user?.id === userId,
      isOwnerOrAdmin: user?.id === userId,
      isMember: true,
      isAdmin: false,
      isSuperAdmin: false,
    };
  }

  return {
    isOwner: user?.id === userId,
    isOwnerOrAdmin: isAdminOrSuperAdmin || user?.id === userId,
    isMember: user?.role === Role.Member,
    isAdmin: exact ? user?.role === Role.Admin : isAdminOrSuperAdmin,
    isSuperAdmin: user?.role === Role.SuperAdmin,
  };
};

export default useRole;
