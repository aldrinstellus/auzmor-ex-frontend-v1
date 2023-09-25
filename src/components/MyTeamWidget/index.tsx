import Card from 'components/Card';
import { memo } from 'react';

const MyTeamWidget = () => {
  return (
    <div className="min-w-full">
      <Card className="p-10 rounded-9xl">
        <div>My Teams</div>
      </Card>
    </div>
  );
};

export default memo(MyTeamWidget);
