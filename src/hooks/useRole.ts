import { Role } from 'utils/enum';
import useAuth from './useAuth';

interface IRoleProps {
  exact?: boolean;
  userId?: string;
}

const useRole = (
  { exact, userId }: IRoleProps = { exact: false, userId: '' },
) => {
  const { user } = useAuth();
  const adminRoles = [Role.Admin, Role.SuperAdmin, Role.Manager];

  const isAdminOrSuperAdmin =
    adminRoles.includes(
      // @ts-ignore
      user?.role,
    ) ||
    adminRoles.includes(
      // @ts-ignore
      user?.learnRole,
    );

  return {
    isOwner: user?.id === userId,
    isOwnerOrAdmin: isAdminOrSuperAdmin || user?.id === userId,
    isMember: user?.role === Role.Member,
    isAdmin: exact ? user?.role === Role.Admin : isAdminOrSuperAdmin,
    isSuperAdmin: user?.role === Role.SuperAdmin,
  };
};

export default useRole;
