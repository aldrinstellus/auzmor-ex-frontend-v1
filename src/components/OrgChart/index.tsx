import Button, { Variant } from 'components/Button';
import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './components/Toolbar';
import Chart from './components/Chart';
import { OrgChart } from 'd3-org-chart';

export enum OrgChartMode {
  Team = 'TEAM',
  Overall = 'OVERALL',
}

interface IOrgChart {
  setShowOrgChart: (showOrgChart: boolean) => void;
}

const OrganizationChart: React.FC<IOrgChart> = ({ setShowOrgChart }) => {
  const [activeMode, setActiveMode] = useState<OrgChartMode>(
    OrgChartMode.Overall,
  );
  const chartRef = useRef<OrgChart<any> | null>(null);
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
          iconColor="black"
          onClick={() => setShowOrgChart(false)}
        />
      </div>
      <Toolbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        chartRef={chartRef}
      />
      <Chart orgChartRef={chartRef} />
    </div>
  );
};

export default OrganizationChart;
