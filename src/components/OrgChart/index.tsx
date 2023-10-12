import Button, { Variant } from 'components/Button';
import { FC, useEffect, useRef, useState } from 'react';
import Toolbar from './components/Toolbar';
import Chart, { INode } from './components/Chart';
import { OrgChart } from 'd3-org-chart';
import { useForm } from 'react-hook-form';
import { IGetUser, useOrgChart } from 'queries/users';
import { IAppliedFilters } from 'components/FilterModal';
import { isFiltersEmpty } from 'utils/misc';
import { useOrgChartStore } from 'stores/orgChartStore';

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 5;
export const FOCUS_ZOOM = 18; //range 0 to 100

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

export interface IZoom {
  zoom: number;
  range: number[];
}

const OrganizationChart: FC<IOrgChart> = ({ setShowOrgChart }) => {
  const [activeMode, setActiveMode] = useState<OrgChartMode>(
    OrgChartMode.Overall,
  );
  const chartRef = useRef<OrgChart<any> | null>(null);
  const { control, watch, resetField } = useForm<IForm>();
  const [startWithSpecificUser, setStartWithSpecificUser] =
    useState<IGetUser | null>(null);
  const [isExpandAll, setIsExpandAll] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<IAppliedFilters>({
    location: [],
    departments: [],
    status: [],
  });
  const [parentId, setParentId] = useState<string | null>(null);
  const { data, isLoading } = useOrgChart(
    isFiltersEmpty({
      root: parentId || startWithSpecificUser?.id,
      locations:
        appliedFilters?.location?.map((location) => (location as any).id) || [],
      departments:
        appliedFilters?.departments?.map(
          (department) => (department as any).id,
        ) || [],
      status:
        appliedFilters.status?.map((eachStatus) => (eachStatus as any).id) ||
        [],
      expand: activeMode === OrgChartMode.Team ? 1 : undefined,
    }),
  );
  const [zoom, setZoom] = useState<IZoom>({
    zoom: MIN_ZOOM,
    range: [MIN_ZOOM, MAX_ZOOM],
  });

  const { setIsOrgChartMounted } = useOrgChartStore();

  useEffect(() => {
    setIsOrgChartMounted(true);
    return () => setIsOrgChartMounted(false);
  }, []);

  const getNodes = () => {
    if (
      (!!appliedFilters?.departments?.length ||
        !!appliedFilters?.location?.length ||
        !!appliedFilters?.status?.length) &&
      data &&
      !!!data?.data.result.data.some((node: INode) => node.matchesCriteria)
    ) {
      return [];
    } else return data?.data.result.data || [];
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex justify-between w-full max-w-[1440px]">
        <div className="text-2xl font-bold">Organization Chart</div>
        <Button
          className="flex space-x-[6px] group"
          label="View People Hub"
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
        resetField={resetField}
        startWithSpecificUser={startWithSpecificUser}
        setStartWithSpecificUser={setStartWithSpecificUser}
        isExpandAll={isExpandAll}
        setIsExpandAll={setIsExpandAll}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        setParentId={setParentId}
        zoom={zoom}
        parentId={parentId}
      />
      <Chart
        orgChartRef={chartRef}
        data={getNodes()}
        isLoading={isLoading}
        onClearFilter={() => {
          setAppliedFilters({
            location: [],
            departments: [],
            status: [],
          });
          setStartWithSpecificUser(null);
          resetField('userSearch');
        }}
        isFilterApplied={
          !!appliedFilters?.departments?.length ||
          !!appliedFilters?.location?.length ||
          !!appliedFilters?.status?.length
        }
        setZoom={setZoom}
        isMyTeam={!!parentId}
      />
    </div>
  );
};

export default OrganizationChart;
