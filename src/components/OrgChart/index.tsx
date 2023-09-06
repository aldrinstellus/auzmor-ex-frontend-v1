import Button, { Variant } from 'components/Button';
import React, { useRef, useState } from 'react';
import Toolbar from './components/Toolbar';
import Chart from './components/Chart';
import { OrgChart } from 'd3-org-chart';
import { useForm } from 'react-hook-form';
import { useOrgChart } from 'queries/users';

export enum OrgChartMode {
  Team = 'TEAM',
  Overall = 'OVERALL',
}

export interface IForm {
  userSearch: any;
  specificPersonSearch: string;
}

interface IOrgChart {
  setShowOrgChart: (showOrgChart: boolean) => void;
}

const OrganizationChart: React.FC<IOrgChart> = ({ setShowOrgChart }) => {
  const [activeMode, setActiveMode] = useState<OrgChartMode>(
    OrgChartMode.Overall,
  );
  const chartRef = useRef<OrgChart<any> | null>(null);
  const { control, watch, resetField } = useForm<IForm>();
  const [userStatus, setUserStatus] = useState<string>('');
  const { data, isLoading } = useOrgChart();

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
          iconColor="text-black"
          onClick={() => setShowOrgChart(false)}
        />
      </div>
      <Toolbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        chartRef={chartRef}
        control={control}
        watch={watch}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        resetField={resetField}
      />
      <Chart
        orgChartRef={chartRef}
        data={(data as any)?.result?.data.users || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrganizationChart;
