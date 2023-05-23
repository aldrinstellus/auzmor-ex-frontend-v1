import { Role } from 'utils/enum';
import useAuth from './useAuth';

const useRole = (exact = false) => {
  const { user } = useAuth();

  return {
    isMember: user?.role === Role.Member,
    isAdmin: exact
      ? user?.role === Role.Admin
      : // @ts-ignore
        [Role.Admin, Role.SuperAdmin].includes(user?.role),
    isSuperAdmin: user?.role === Role.SuperAdmin,
  };
};

export default useRole;
