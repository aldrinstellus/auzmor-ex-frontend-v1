import Card from 'components/Card';
import React from 'react';
import EmptyBanner from '../../../../images/EmptyBanner.png';

export interface INoDataCardProps {
  user: string;
}

const NoDataCard: React.FC<INoDataCardProps> = ({ user }) => {
  return (
    <div className="pb-8">
      <Card className="p-6 space-y-2">
        <div className="text-2xl font-bold">Nothing to show</div>
        <div className="text-sm font-normal">
          Activities for {user} will appear here
        </div>
        <div className="flex justify-center items-center w-full">
          <img src={EmptyBanner} alt="empty-banner-image" />
        </div>
      </Card>
    </div>
  );
};

export default NoDataCard;
