import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import useModal from 'hooks/useModal';
import FilterModal from 'pages/Users/components/FilterModals/PeopleFilterModal';
import React, { useEffect, useMemo, useState } from 'react';
import { Control, UseFormResetField, UseFormWatch } from 'react-hook-form';
import { IForm, OrgChartMode } from '..';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { OrgChart } from 'd3-org-chart';
import Popover from 'components/Popover';
import { IGetUser, useInfiniteUsers, useOrgChart } from 'queries/users';
import { useDebounce } from 'hooks/useDebounce';
import Spinner from 'components/Spinner';
import { useInView } from 'react-intersection-observer';
import UserRow from 'components/UserRow';
import { IOption } from 'components/AsyncSingleSelect';
import useAuth from 'hooks/useAuth';

interface IToolbar {
  activeMode: OrgChartMode;
  setActiveMode: (activeMode: OrgChartMode) => void;
  chartRef: React.MutableRefObject<OrgChart<any> | null>;
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  userStatus: string;
  setUserStatus: (userStatus: string) => void;
  resetField: UseFormResetField<IForm>;
}

const Toolbar: React.FC<IToolbar> = ({
  activeMode,
  setActiveMode,
  chartRef,
  control,
  watch,
  userStatus,
  setUserStatus,
  resetField,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [memberSearchString, setMemberSearchString] = useState<string>('');
  const [specificPersonSearch] = watch(['specificPersonSearch']);

  const { user } = useAuth();

  // fetch users on start with specific user
  const debouncedPersonSearchValue = useDebounce(
    specificPersonSearch || '',
    300,
  );
  const {
    data: fetchedPersons,
    isFetchingNextPage: isFetchingNextPersons,
    fetchNextPage: fetchNextPersons,
    hasNextPage: hasNextPersons,
    isFetching: isPersonFetching,
  } = useInfiniteUsers(
    {
      q: debouncedPersonSearchValue,
    },
    { enabled: debouncedPersonSearchValue !== '' },
  );
  const personData = fetchedPersons?.pages.flatMap((page) =>
    page?.data?.result?.data.map((person: IGetUser) => person),
  );

  // fetch members on search
  const debouncedMemberSearchValue = useDebounce(memberSearchString || '', 300);
  const { data: fetchedMembers, isLoading: isFetching } = useOrgChart({
    q: debouncedMemberSearchValue,
  });
  const userData = useMemo(
    () =>
      (fetchedMembers as any)?.result?.data.users.filter(
        (user: any) => user.id !== 'root',
      ) || [],
    [fetchedMembers],
  );

  const { ref: personInviewRef, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPersons();
    }
  }, [inView]);
  const memberSearchfields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'userSearch',
      className: 'mr-2 min-w-[245px]',
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
            profileImage: { original: option.rowData.profileImage },
            fullName: option.rowData.userName,
          }}
          dataTestId={option.dataTestId}
          className="w-full"
          onClick={(user) => {
            chartRef.current?.clearHighlighting();
            setIsSpotlightActive(false);
            chartRef.current
              ?.setUpToTheRootHighlighted(user?.id || '')
              .render()
              .fit();
            chartRef.current?.setCentered(user.id).render();
          }}
        />
      ),
      onClear: () => {
        chartRef.current?.clearHighlighting();
      },
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
  return (
    <>
      <div className="mt-7 px-4 py-3 mb-8 w-full shadow-lg rounded-9xl bg-white flex justify-between items-center">
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
            color="text-neutral-900"
          />
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
            >
              <>
                <Layout fields={specificPersonSearchFields} />
                <div className="h-full overflow-scroll max-h-80">
                  {isPersonFetching ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : personData && personData?.length > 0 ? (
                    personData?.map((member: IGetUser) => (
                      <UserRow user={member} key={member.id} />
                    ))
                  ) : personData?.length === 0 &&
                    debouncedPersonSearchValue !== '' ? (
                    <div className="w-full flex items-center justify-center pt-6 text-neutral-500">
                      No member found
                    </div>
                  ) : (
                    <></>
                  )}
                  {hasNextPersons && !isFetchingNextPersons && (
                    <div ref={personInviewRef} />
                  )}
                </div>
              </>
            </Popover>

            <div className="mx-4 bg-neutral-200 h-6 w-px" />
            <div className="mr-4 group">
              <Tooltip
                tooltipContent={isCollapsed ? 'Expand all' : 'Collapse all'}
                tooltipPosition="bottom"
              >
                <Icon
                  name={isCollapsed ? 'expandOutline' : 'collapseOutline'}
                  color="text-neutral-900"
                  onClick={() => {
                    if (isCollapsed) {
                      chartRef.current?.expandAll();
                    } else {
                      chartRef.current?.collapseAll();
                    }
                    setIsCollapsed(!isCollapsed);
                  }}
                  size={16}
                />
              </Tooltip>
            </div>
            <div className="mr-2 group flex items-center pt-1">
              <Tooltip tooltipContent="Fit to screen" tooltipPosition="bottom">
                <Icon
                  name="fullScreen"
                  color="text-neutral-900"
                  className="flex items-center"
                  onClick={() => {
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
                    chartRef.current?.clearHighlighting();
                    resetField('userSearch');
                    if (!isSpotlightActive) {
                      chartRef.current
                        ?.setUpToTheRootHighlighted(user?.id || '')
                        .render()
                        .fit();
                      chartRef.current?.setCentered(user?.id || '').render();
                    }
                    setIsSpotlightActive(!isSpotlightActive);
                  }}
                  isActive={isSpotlightActive}
                  size={24}
                />
              </Tooltip>
            </div>
            <div className="mr-4 ml-2 bg-neutral-200 h-6 w-px" />
            <div className="group mr-8">
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
