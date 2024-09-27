import {
  NavigateFunction,
  NavigateOptions,
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
    const isLearner = isLxp && (pathname.split('/')[1] === 'user' || !isAdmin);

    let newPath = to;
    if (isLearner) {
      newPath = `/user${to}`;
    }
    return navigation(newPath, options);
  };
  return navigate as NavigateFunction;
};

export default useNavigate;
