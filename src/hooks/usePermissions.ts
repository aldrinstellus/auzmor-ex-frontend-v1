import useAuth from './useAuth';

const usePermissions = (scope: string) => {
  const { user } = useAuth();
  return {};
};

export default usePermissions;
