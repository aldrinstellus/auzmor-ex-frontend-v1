import Card from 'components/Card';
import EmptyBanner from '../../../../images/EmptyBanner.png';
import { FC } from 'react';

export interface INoDataCardProps {
  user: string;
  dataType: string;
}

export interface IDataTypeMap {
  [key: string]: any;
}

const typeMap: IDataTypeMap = {
  activity: 'Activities',
  recognition: 'Recognitions',
};

const NoDataCard: FC<INoDataCardProps> = ({ user, dataType }) => {
  return (
    <div className="pb-8">
      <Card className="p-6 space-y-2">
        <div className="text-2xl font-bold">Nothing to show</div>
        <div className="text-sm font-normal">
          {typeMap[dataType] || typeMap.activity} for {user} will appear here
        </div>
        <div className="flex justify-center items-center w-full">
          <img src={EmptyBanner} alt="empty-banner-image" />
        </div>
      </Card>
    </div>
  );
};

export default NoDataCard;
