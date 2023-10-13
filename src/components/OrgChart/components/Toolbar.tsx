import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import useModal from 'hooks/useModal';
import { FC, MutableRefObject, useMemo, useState } from 'react';
import { Control, UseFormResetField, UseFormWatch } from 'react-hook-form';
import { FOCUS_ZOOM, IForm, IZoom, MAX_ZOOM, MIN_ZOOM, OrgChartMode } from '..';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { OrgChart } from 'd3-org-chart';
import Popover from 'components/Popover';
import { IGetUser, getOrgChart, useOrgChart } from 'queries/users';
import { useDebounce } from 'hooks/useDebounce';
import Spinner from 'components/Spinner';
import UserRow from 'components/UserRow';
import { IOption } from 'components/AsyncSingleSelect';
import useAuth from 'hooks/useAuth';
import Divider from 'components/Divider';
import Avatar from 'components/Avatar';
import FilterModal, {
  IAppliedFilters,
  FilterModalVariant,
} from 'components/FilterModal';
import { INode } from './Chart';
import { isFiltersEmpty, mapRanges } from 'utils/misc';
import { QueryFunctionContext } from '@tanstack/react-query';
import NoDataFound from 'components/NoDataFound';

interface IToolbarProps {
  activeMode: OrgChartMode;
  setActiveMode: (activeMode: OrgChartMode) => void;
  chartRef: MutableRefObject<OrgChart<any> | null>;
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  resetField: UseFormResetField<IForm>;
  startWithSpecificUser: IGetUser | null;
  setStartWithSpecificUser: (startWithSpecificUser: IGetUser | null) => void;
  isExpandAll: boolean;
  setIsExpandAll: (isExpandAll: boolean) => void;
  appliedFilters: IAppliedFilters;
  setAppliedFilters: (appliedFilters: IAppliedFilters) => void;
  setParentId: (parentId: string | null) => void;
  zoom: IZoom;
  parentId: string | null;
  setShowLoader: (flag: boolean) => void;
}

const Toolbar: FC<IToolbarProps> = ({
  activeMode,
  setActiveMode,
  chartRef,
  control,
  watch,
  resetField,
  startWithSpecificUser,
  setStartWithSpecificUser,
  isExpandAll,
  setIsExpandAll,
  appliedFilters,
  setAppliedFilters,
  setParentId,
  zoom,
  parentId,
  setShowLoader,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [memberSearchString, setMemberSearchString] = useState<string>('');
  const [specificPersonSearch] = watch(['specificPersonSearch']);

  const { user } = useAuth();

  const isFilterApplied =
    !!appliedFilters?.departments?.length ||
    !!appliedFilters?.location?.length ||
    !!appliedFilters?.status?.length;

  // fetch users on start with specific user
  const debouncedPersonSearchValue = useDebounce(
    specificPersonSearch || '',
    300,
  );
  const { data: fetchedPersons, isFetching: isPersonFetching } = useOrgChart(
    isFiltersEmpty({
      q: debouncedPersonSearchValue,
      root: parentId || undefined,
      expand: parentId ? 1 : undefined,
      locations:
        appliedFilters?.location?.map((location) => (location as any).id) || [],
      departments:
        appliedFilters?.departments?.map(
          (department) => (department as any).id,
        ) || [],
      status:
        appliedFilters?.status?.map((eachStatus) => (eachStatus as any).id) ||
        [],
    }),
    {
      enable: debouncedPersonSearchValue !== '',
    },
  );

  const personData = useMemo(
    () =>
      fetchedPersons?.data.result?.data
        .filter((user: any) => user.id !== 'root')
        .filter((user: any) => !!user?.matchesCriteria) || [],
    [fetchedPersons],
  );

  const clearSpotlight = () => {
    chartRef.current?.clearHighlighting();
  };

  // fetch members on search
  const debouncedMemberSearchValue = useDebounce(memberSearchString || '', 300);
  const { data: fetchedMembers, isLoading: isFetching } = useOrgChart(
    isFiltersEmpty({
      q: debouncedMemberSearchValue,
      root: parentId || undefined,
      expand: parentId ? 1 : undefined,
      locations:
        appliedFilters?.location?.map((location) => (location as any).id) || [],
      departments:
        appliedFilters?.departments?.map(
          (department) => (department as any).id,
        ) || [],
      status:
        appliedFilters?.status?.map((eachStatus) => (eachStatus as any).id) ||
        [],
    }),
    {
      enable: debouncedMemberSearchValue !== '',
    },
  );
  const userData = useMemo(
    () =>
      fetchedMembers?.data.result?.data.filter(
        (user: any) => user.id !== 'root',
      ) || [],
    [fetchedMembers],
  );

  const memberSearchfields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'userSearch',
      className: 'mr-2 min-w-[245px]',
      selectClassName: 'org-select',
      placeholder: 'Search members',
      suffixIcon: <></>,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      isLoading: isFetching,
      options: userData?.map(
        (member: IGetUser) =>
          ({
            value: member.userName,
            label: member.userName,
            disabled: false,
            dataTestId: member.id,
            rowData: member,
          } as IOption),
      ),
      onSearch: (searchString: string) => setMemberSearchString(searchString),
      optionRenderer: (option: IOption) => (
        <UserRow
          user={{
            ...option.rowData,
            fullName: option.rowData.userName,
            profileImage: !!!option.rowData.profileImage
              ? undefined
              : option.rowData.profileImage,
          }}
          dataTestId={option.dataTestId}
          className="w-full"
          onClick={(user: any) => {
            clearSpotlight();
            setMemberSearchString(user?.fullName || '');
            if (
              chartRef.current?.data()?.some((node) => node.id === user?.id)
            ) {
              // if node already in the chart
              chartRef.current
                ?.expandAll()
                ?.setFocus(
                  user?.id,
                  mapRanges(0, 100, MIN_ZOOM, MAX_ZOOM, FOCUS_ZOOM),
                );
            } else {
              // fetch missing nodes.
              getOrgChart({
                queryKey: [
                  'organization-chart',
                  {
                    locations:
                      appliedFilters?.location?.map(
                        (location) => (location as any).id,
                      ) || [],
                    departments:
                      appliedFilters?.departments?.map(
                        (department) => (department as any).id,
                      ) || [],
                    status:
                      appliedFilters.status?.map(
                        (eachStatus) => (eachStatus as any).id,
                      ) || [],
                    target: user?.id,
                  },
                ],
              } as QueryFunctionContext<any>).then((data) => {
                chartRef.current?.addNodes(data.data.result.data);
                getOrgChart({
                  queryKey: [
                    'organization-chart',
                    {
                      root: user?.parentId,
                      locations:
                        appliedFilters?.location?.map(
                          (location) => (location as any).id,
                        ) || [],
                      departments:
                        appliedFilters?.departments?.map(
                          (department) => (department as any).id,
                        ) || [],
                      status:
                        appliedFilters.status?.map(
                          (eachStatus) => (eachStatus as any).id,
                        ) || [],
                      expand: 0,
                    },
                  ],
                } as QueryFunctionContext<any>).then((data) => {
                  chartRef.current?.addNodes(data.data.result.data);
                  chartRef.current
                    ?.expandAll()
                    ?.setFocus(
                      user?.id,
                      mapRanges(0, 100, MIN_ZOOM, MAX_ZOOM, FOCUS_ZOOM),
                    );
                  setIsExpandAll(true);
                });
              });
            }
          }}
        />
      ),
      onClear: () => {
        chartRef.current?.clearHighlighting();
      },
      noOptionsMessage: (
        <NoDataFound
          className="py-4 w-full"
          searchString={debouncedMemberSearchValue}
          message={
            <p>
              Sorry we can&apos;t find the member you are looking for.
              <br /> Please check the spelling or try again.
            </p>
          }
          hideClearBtn
          dataTestId="membersearch"
        />
      ),
      // dataTestId: 'member-search',
    },
  ];
  const specificPersonSearchFields = [
    {
      type: FieldType.Input,
      name: 'specificPersonSearch',
      control,
      leftIcon: 'search',
      placeholder: 'Search member',
      label: 'Start with specific person',
      className: 'px-6',
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
  const resetAppliedFilters = () => {
    setAppliedFilters({
      location: [],
      departments: [],
      status: [],
    });
  };
  const clearAllFilters = () => {
    resetAppliedFilters();
    setStartWithSpecificUser(null);
    resetField('userSearch');
    chartRef.current?.clearHighlighting();
  };
  const getParentId = () => {
    const id =
      chartRef!.current!.data()?.find((node: INode) => node.id === user?.id)
        ?.parentId || user?.id;
    if (id === 'root') {
      return user?.id;
    }
    return id;
  };
  return (
    <>
      <div className="flex flex-col mt-7 px-4 py-3 mb-8 w-full shadow-lg rounded-9xl bg-white max-w-[1440px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Layout fields={memberSearchfields} />
            <div className="flex items-center justify-center w-9 h-9">
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
              onClick={() => {
                setActiveMode(OrgChartMode.Team);
                setParentId(getParentId());
                setStartWithSpecificUser(null);
              }}
            >
              My Team
            </div>
            <div
              className={overallClassName}
              onClick={() => {
                setActiveMode(OrgChartMode.Overall);
                setParentId(null);
              }}
            >
              Overall
            </div>
          </div>
          <div className="flex items-center">
            {/* <IconButton
              icon="importOutline"
              variant={IconVariant.Secondary}
              className="group"
              borderAround
              color="text-neutral-900"
            /> */}
            <div className="border-neutral-200 border rounded-9xl px-6 py-2 flex items-center ml-4">
              <Popover
                triggerNode={
                  <Tooltip
                    tooltipContent="Start with a specific person"
                    tooltipPosition="bottom"
                  >
                    <div className="group flex items-center">
                      <Icon
                        name="groupOutline"
                        color="text-neutral-900"
                        size={16}
                      />
                    </div>
                  </Tooltip>
                }
                className="py-4 rounded-9xl shadow-2xl min-w-[540px] absolute -translate-x-1/2 mt-11 top-arrow ml-2"
                contentRenderer={(close) => (
                  <>
                    <Layout fields={specificPersonSearchFields} />
                    <div className="h-full overflow-scroll max-h-80">
                      {isPersonFetching ? (
                        <div className="w-full h-64 flex items-center justify-center">
                          <Spinner />
                        </div>
                      ) : personData && personData?.length > 0 ? (
                        personData?.map((member: any) => (
                          <UserRow
                            user={{
                              ...member,
                              fullName: member.userName,
                              profileImage: !!!member.profileImage
                                ? undefined
                                : member.profileImage,
                            }}
                            key={member.id}
                            onClick={() => {
                              clearAllFilters();
                              clearSpotlight();
                              setStartWithSpecificUser(member);
                              close();
                            }}
                          />
                        ))
                      ) : personData?.length === 0 &&
                        debouncedPersonSearchValue !== '' ? (
                        <div className="w-full flex items-center justify-center pt-6 text-neutral-500">
                          No member found
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )}
              />

              <div className="mx-4 bg-neutral-200 h-6 w-px" />
              <div className="mr-4 group">
                <Tooltip
                  tooltipContent={isExpandAll ? 'Collapse all' : 'Expand all'}
                  tooltipPosition="bottom"
                >
                  <Icon
                    name={isExpandAll ? 'collapseOutline' : 'expandOutline'}
                    color="text-neutral-900"
                    onClick={() => {
                      if (isExpandAll) {
                        chartRef.current?.collapseAll().fit();
                      } else {
                        setShowLoader(true);
                        getOrgChart({
                          queryKey: [
                            'organization-chart',
                            {
                              expandAll: true,
                              root: parentId || startWithSpecificUser?.id,
                              locations:
                                appliedFilters?.location?.map(
                                  (location) => (location as any).id,
                                ) || [],
                              departments:
                                appliedFilters?.departments?.map(
                                  (department) => (department as any).id,
                                ) || [],
                              status:
                                appliedFilters.status?.map(
                                  (eachStatus) => (eachStatus as any).id,
                                ) || [],
                            },
                          ],
                        } as QueryFunctionContext<any>).then(
                          (response: any) => {
                            setShowLoader(false);
                            chartRef.current?.addNodes(
                              response.data.result.data,
                            );
                            chartRef.current?.expandAll().fit();
                          },
                        );
                      }
                      setIsExpandAll(!isExpandAll);
                      clearSpotlight();
                    }}
                    size={16}
                  />
                </Tooltip>
              </div>
              <div className="mr-2 group flex items-center pt-1">
                <Tooltip
                  tooltipContent="Fit to screen"
                  tooltipPosition="bottom"
                >
                  <Icon
                    name="fullScreen"
                    color="text-neutral-900"
                    className="flex items-center"
                    onClick={() => {
                      clearSpotlight();
                      chartRef.current?.fit();
                    }}
                    size={16}
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip tooltipContent="Spotlight me" tooltipPosition="bottom">
                  <Icon
                    name="focus"
                    color="text-neutral-900"
                    onClick={() => {
                      clearSpotlight();
                      clearAllFilters();
                      chartRef.current?.setFocus(
                        user?.id || '',
                        mapRanges(0, 100, MIN_ZOOM, MAX_ZOOM, FOCUS_ZOOM),
                      );
                    }}
                    size={24}
                  />
                </Tooltip>
              </div>
              <div className="mr-4 ml-2 bg-neutral-200 h-6 w-px" />
              <div className="group">
                <Tooltip tooltipContent="Zoom out" tooltipPosition="bottom">
                  <Icon
                    name="zoomOutOutline"
                    color="text-neutral-900"
                    onClick={() => {
                      chartRef.current?.zoomOut();
                    }}
                    size={16}
                  />
                </Tooltip>
              </div>
              <div className="text-neutral-900 font-bold text-sm mx-4 w-6 flex justify-center">
                {Math.round(
                  mapRanges(zoom.range[0], zoom.range[1], 0, 100, zoom.zoom),
                )}
                %
              </div>
              <div className="group">
                <Tooltip tooltipContent="Zoom in" tooltipPosition="bottom">
                  <Icon
                    name="zoomInOutline"
                    color="text-neutral-900"
                    onClick={() => chartRef.current?.zoomIn()}
                    size={16}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        {!!startWithSpecificUser && <Divider className="my-2" />}
        {!!startWithSpecificUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {startWithSpecificUser && (
                <div className="flex items-center mr-2">
                  <div className="flex items-center text-neutral-900 text-sm font-bold mr-1">
                    Start with specific person:
                  </div>
                  <div
                    className="flex px-3 py-2 text-primary-500 text-sm font-medium border border-neutral-200 rounded-7xl justify-between hover:border-primary-600 group cursor-pointer"
                    onClick={() => setStartWithSpecificUser(null)}
                  >
                    <div className="flex items-center">
                      <Avatar
                        name={startWithSpecificUser.fullName}
                        image={startWithSpecificUser.profileImage?.original}
                        blurhash={startWithSpecificUser.profileImage?.blurHash}
                        size={16}
                      />
                      <div className="mx-1">
                        {startWithSpecificUser.fullName}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Icon
                        name="close"
                        size={16}
                        onClick={() => setStartWithSpecificUser(null)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="px-3 py-1 text-neutral-500 text-base font-medium border border-neutral-200 rounded-7xl cursor-pointer hover:border-primary-200 hover:text-primary-500"
              onClick={() => {
                setStartWithSpecificUser(null);
              }}
            >
              Clear filters
            </div>
          </div>
        )}
        {!!isFilterApplied && <Divider className="my-2" />}
        {!!isFilterApplied && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-neutral-900 font-bold text-sm mr-2">
                Filter by:
              </div>
              {!!appliedFilters?.location?.length && (
                <div
                  className="flex px-3 py-2 text-primary-500 text-sm font-medium border border-neutral-200 rounded-7xl justify-between mr-2 hover:border-primary-600 group cursor-pointer"
                  onClick={() =>
                    setAppliedFilters({ ...appliedFilters, location: [] })
                  }
                >
                  <div className="font-medium text-sm text-neutral-900 mr-1">
                    Location{' '}
                    {appliedFilters.location.map((location, index) => (
                      <>
                        <span
                          key={location.locationId}
                          className="text-primary-500 font-bold text-sm"
                        >
                          {location.name}
                        </span>
                        {appliedFilters?.location &&
                          index !== appliedFilters?.location?.length - 1 && (
                            <span>
                              {appliedFilters?.location?.length === 2
                                ? ' and '
                                : ', '}
                            </span>
                          )}
                      </>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <Icon
                      name="close"
                      size={16}
                      onClick={() =>
                        setAppliedFilters({ ...appliedFilters, location: [] })
                      }
                    />
                  </div>
                </div>
              )}
              {!!appliedFilters?.departments?.length && (
                <div
                  className="flex px-3 py-2 text-primary-500 text-sm font-medium border border-neutral-200 rounded-7xl justify-between mr-2 hover:border-primary-600 group cursor-pointer"
                  onClick={() =>
                    setAppliedFilters({
                      ...appliedFilters,
                      departments: [],
                    })
                  }
                >
                  <div className="font-medium text-sm text-neutral-900 mr-1">
                    Department{' '}
                    {appliedFilters.departments.map((department, index) => (
                      <>
                        <span
                          key={department.departmentId}
                          className="text-primary-500 font-bold text-sm"
                        >
                          {department.name}
                        </span>
                        {appliedFilters?.departments &&
                          index !== appliedFilters?.departments?.length - 1 && (
                            <span>
                              {appliedFilters?.departments?.length === 2
                                ? ' and '
                                : ', '}
                            </span>
                          )}
                      </>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <Icon
                      name="close"
                      size={16}
                      onClick={() =>
                        setAppliedFilters({
                          ...appliedFilters,
                          departments: [],
                        })
                      }
                    />
                  </div>
                </div>
              )}
              {!!appliedFilters?.status?.length && (
                <div
                  className="flex px-3 py-2 text-primary-500 text-sm font-medium border border-neutral-200 rounded-7xl justify-between mr-2 hover:border-primary-600 group cursor-pointer"
                  onClick={() =>
                    setAppliedFilters({
                      ...appliedFilters,
                      status: [],
                    })
                  }
                >
                  <div className="font-medium text-sm text-neutral-900 mr-1">
                    Status{' '}
                    {appliedFilters.status.map((eachStatus, index) => (
                      <>
                        <span
                          key={eachStatus.id}
                          className="text-primary-500 font-bold text-sm"
                        >
                          {eachStatus.name}
                        </span>
                        {appliedFilters?.status &&
                          index !== appliedFilters?.status?.length - 1 && (
                            <span>
                              {appliedFilters?.status?.length === 2
                                ? ' and '
                                : ', '}
                            </span>
                          )}
                      </>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <Icon
                      name="close"
                      size={16}
                      onClick={() =>
                        setAppliedFilters({
                          ...appliedFilters,
                          status: [],
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              className="px-3 py-1 text-neutral-500 text-base font-medium border border-neutral-200 rounded-7xl cursor-pointer hover:border-primary-200 hover:text-primary-500"
              onClick={() => {
                resetAppliedFilters();
              }}
            >
              Clear filters
            </div>
          </div>
        )}
      </div>
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appliedFilters}
          variant={FilterModalVariant.Orgchart}
          onApply={(appliedFilters: IAppliedFilters) => {
            clearSpotlight();
            setAppliedFilters(appliedFilters);
            closeFilterModal();
          }}
          onClear={() => {
            resetAppliedFilters();
            closeFilterModal();
          }}
        />
      )}
    </>
  );
};

export default Toolbar;
