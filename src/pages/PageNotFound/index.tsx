import PageLoader from 'components/PageLoader';
import { usePageTitle } from 'hooks/usePageTitle';
import useProduct from 'hooks/useProduct';
import { FC } from 'react';
import { getLearnUrl } from 'utils/misc';

interface IPageNotFoundProps {
  statusCode: number | string;
  message: string;
}

const PageNotFound: FC<IPageNotFoundProps> = (props) => {
  const { isLxp } = useProduct();
  if (isLxp) {
    window.location.replace(getLearnUrl('/not-found'));
    return <div className="w-full h-screen">
      <PageLoader />
    </div>;
  }
  usePageTitle('pageNotFound');
  return (
    <div className="flex items-center flex-col">
      <div className="text-red text-lg font-bold">{props.statusCode}</div>
      <div>{props.message}</div>
    </div>
  );
};

export default PageNotFound;
