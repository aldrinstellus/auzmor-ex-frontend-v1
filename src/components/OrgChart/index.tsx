import Button, { Variant } from 'components/Button';
import React, { useState } from 'react';
import Toolbar from './components/Toolbar';

export enum OrgChartMode {
  Team = 'TEAM',
  Overall = 'OVERALL',
}

interface IOrgChart {
  setShowOrgChart: (showOrgChart: boolean) => void;
}

const OrgChart: React.FC<IOrgChart> = ({ setShowOrgChart }) => {
  const [activeMode, setActiveMode] = useState<OrgChartMode>(
    OrgChartMode.Overall,
  );
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between w-full">
        <div className="text-2xl font-bold">Organization Chart</div>
        <Button
          className="flex space-x-[6px] group"
          label="View Organization Chart"
          variant={Variant.Secondary}
          leftIcon="peopleOutline"
          leftIconSize={20}
          dataTestId="people-org-chart"
          iconStroke="black"
          onClick={() => setShowOrgChart(false)}
        />
      </div>
      <Toolbar activeMode={activeMode} setActiveMode={setActiveMode} />
    </div>
  );
};

export default OrgChart;
