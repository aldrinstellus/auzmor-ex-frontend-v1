import {
  NavigateFunction,
  NavigateOptions,
  Path,
  To,
  useLocation,
  useNavigate as useNavigation,
} from 'react-router-dom';
import useProduct from './useProduct';
import useRole from './useRole';

const useNavigate = () => {
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const { isLxp } = useProduct();
  const { isAdmin } = useRole();

  const navigate = (to: To, options?: NavigateOptions) => {
    const isLearner =
      isLxp && (pathname.split('/').includes('user') || !isAdmin);

    let newPath = to;
    if (isLearner) {
      if (typeof to === 'string')
        newPath = to.split('/')[1] === 'user' ? to : `/user${to}`;
      else
        newPath = {
          ...(newPath as Partial<Path>),
          pathname:
            to.pathname?.split('/')[1] === 'user'
              ? to.pathname
              : `/user${to.pathname}`,
        };
    }
    return navigation(newPath, options);
  };
  return navigate as NavigateFunction;
};

export default useNavigate;
