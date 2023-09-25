import useAuth from './useAuth';

const usePermissions = (_scope: string) => {
  const { user } = useAuth();
  return { user };
};

export default usePermissions;
