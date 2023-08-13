import { Card } from 'antd';
import Popover from 'components/Popover';
import React, { ReactNode } from 'react';

export interface ISortProps {
  sortIcon: ReactNode;
}

const Sort: React.FC<ISortProps> = ({ sortIcon }) => {
  return (
    <Popover triggerNode={sortIcon}>
      <Card className="absolute w-[157px] right-0 top-0 shadow-lg rounded-9xl border border-neutral-200">
        {/* Header */}
        <div className="bg-blue-50 text-xs font-medium">Sort by</div>
      </Card>
    </Popover>
  );
};

export default Sort;
