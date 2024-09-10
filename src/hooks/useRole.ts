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

  const isAdminOrSuperAdmin = [Role.Admin, Role.SuperAdmin].includes(
    // @ts-ignore
    user?.role,
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
