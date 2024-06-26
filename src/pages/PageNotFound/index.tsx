import { usePageTitle } from 'hooks/usePageTitle';
import { FC } from 'react';

interface IPageNotFoundProps {
  statusCode: number | string;
  message: string;
}

const PageNotFound: FC<IPageNotFoundProps> = (props) => {
  usePageTitle('pageNotFound');
  return (
    <div className="flex items-center flex-col">
      <div className="text-red text-lg font-bold">{props.statusCode}</div>
      <div>{props.message}</div>
    </div>
  );
};

export default PageNotFound;
