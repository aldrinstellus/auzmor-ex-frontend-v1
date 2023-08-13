import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import useModal from 'hooks/useModal';
import FilterModal from 'pages/Users/components/FilterModals/PeopleFilterModal';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OrgChartMode } from '..';
import clsx from 'clsx';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import Tooltip from 'components/Tooltip';
import { OrgChart } from 'd3-org-chart';

interface IForm {
  searchField: string;
}

interface IToolbar {
  activeMode: OrgChartMode;
  setActiveMode: (activeMode: OrgChartMode) => void;
  chartRef: React.MutableRefObject<OrgChart<any> | null>;
}

const Toolbar: React.FC<IToolbar> = ({
  activeMode,
  setActiveMode,
  chartRef,
}) => {
  const { control } = useForm<IForm>();
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [userStatus, setUserStatus] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const fields = [
    {
      type: FieldType.Input,
      control,
      name: 'searchField',
      className: 'mr-2',
      placeholder: 'Search members',
      dataTestId: 'global-search',
      leftIcon: 'search',
    },
  ];

  const overallClassName = useMemo(
    () =>
      clsx({
        'px-5 text-neutral-900 rounded-7xl py-1.5': true,
        'text-white bg-primary-500 cursor-default cursor-default font-bold':
          activeMode === OrgChartMode.Overall,
        'cursor-pointer font-medium': activeMode !== OrgChartMode.Overall,
      }),
    [activeMode],
  );
  const teamClassName = useMemo(
    () =>
      clsx({
        'px-5 text-neutral-900 rounded-7xl py-1.5': true,
        'text-white bg-primary-500 cursor-default cursor-default font-bold':
          activeMode === OrgChartMode.Team,
        'cursor-pointer font-medium': activeMode !== OrgChartMode.Team,
      }),
    [activeMode],
  );
  return (
    <>
      <div className="mt-7 px-4 py-3 mb-8 w-full shadow-lg rounded-9xl bg-white flex justify-between items-center">
        <div className="flex items-center">
          <Layout fields={fields} />
          <div className="flex">
            <IconButton
              onClick={openFilterModal}
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white"
              dataTestId="people-filter"
            />
          </div>
        </div>
        <div className="p-1 rounded-9xl border-neutral-200 border bg-neutral-50 flex items-center">
          <div
            className={teamClassName}
            onClick={() => setActiveMode(OrgChartMode.Team)}
          >
            My Team
          </div>
          <div
            className={overallClassName}
            onClick={() => setActiveMode(OrgChartMode.Overall)}
          >
            Overall
          </div>
        </div>
        <div className="flex items-center">
          <IconButton
            icon="importOutline"
            variant={IconVariant.Secondary}
            className="group"
            borderAround
            stroke={twConfig.theme.colors.neutral['900']}
          />
          <div className="border-neutral-200 border rounded-9xl px-6 py-2 flex items-center ml-4">
            <Tooltip
              tooltipContent="Start with a specific person"
              tooltipPosition="bottom"
            >
              <div className="group">
                <Icon
                  name="groupOutline"
                  stroke={twConfig.theme.colors.neutral['900']}
                />
              </div>
            </Tooltip>
            <div className="mx-4 bg-neutral-200 h-6 w-px" />
            <div className="mr-4 group">
              <Tooltip
                tooltipContent={isCollapsed ? 'Expand all' : 'Collapse all'}
                tooltipPosition="bottom"
              >
                <Icon
                  name={isCollapsed ? 'expandOutline' : 'collapseOutline'}
                  stroke={twConfig.theme.colors.neutral['900']}
                  onClick={() => {
                    if (isCollapsed) {
                      chartRef.current?.expandAll();
                    } else {
                      chartRef.current?.collapseAll();
                    }
                    setIsCollapsed(!isCollapsed);
                  }}
                />
              </Tooltip>
            </div>
            <div className="mr-2 group flex items-center pt-1">
              <Tooltip tooltipContent="Fit to screen" tooltipPosition="bottom">
                <Icon
                  name="fullScreen"
                  stroke={twConfig.theme.colors.neutral['900']}
                  className="flex items-center"
                  onClick={() => {
                    chartRef.current?.fit();
                  }}
                />
              </Tooltip>
            </div>
            <div className="group">
              <Tooltip tooltipContent="Spotlight me" tooltipPosition="bottom">
                <Icon
                  name="focusOutline"
                  stroke={twConfig.theme.colors.neutral['900']}
                  size={32}
                  onClick={() => {
                    if (isSpotlightActive) {
                      chartRef.current?.clearHighlighting();
                    } else {
                      chartRef.current
                        ?.setUpToTheRootHighlighted('n6')
                        .render()
                        .fit();
                      chartRef.current?.setCentered('n6').render();
                    }
                    setIsSpotlightActive(!isSpotlightActive);
                  }}
                  isActive={isSpotlightActive}
                />
              </Tooltip>
            </div>
            <div className="mr-4 ml-2 bg-neutral-200 h-6 w-px" />
            <div className="group mr-8">
              <Tooltip tooltipContent="Zoom out" tooltipPosition="bottom">
                <Icon
                  name="zoomOutOutline"
                  stroke={twConfig.theme.colors.neutral['900']}
                  onClick={() => {
                    chartRef.current?.zoomOut();
                  }}
                />
              </Tooltip>
            </div>
            <div className="group">
              <Tooltip tooltipContent="Zoom in" tooltipPosition="bottom">
                <Icon
                  name="zoomInOutline"
                  stroke={twConfig.theme.colors.neutral['900']}
                  onClick={() => chartRef.current?.zoomIn()}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <FilterModal
        setUserStatus={setUserStatus}
        userStatus={userStatus}
        open={showFilterModal}
        openModal={openFilterModal}
        closeModal={closeFilterModal}
      />
    </>
  );
};

export default Toolbar;
