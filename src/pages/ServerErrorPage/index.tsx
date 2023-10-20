import { FC } from 'react';

interface IServerErrorPageProps {
  statusCode: number | string;
  message: string;
}

const ServerErrorPage: FC<IServerErrorPageProps> = (props) => {
  return (
    <div className="flex items-center flex-col">
      <div className="text-red text-lg font-bold">{props.statusCode}</div>
      <div>{props.message}</div>
    </div>
  );
};

export default ServerErrorPage;
