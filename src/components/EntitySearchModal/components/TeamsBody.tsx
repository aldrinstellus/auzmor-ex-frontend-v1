import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import TeamRow from './TeamRow';
import InfiniteSearch from 'components/InfiniteSearch';
import { ITeam, ICategory, CategoryType } from 'interfaces';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import useAuth from 'hooks/useAuth';
import { isFiltersEmpty } from 'utils/misc';
import useRole from 'hooks/useRole';
import NoDataFound from 'components/NoDataFound';
import useProduct from 'hooks/useProduct';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface ITeamsBodyProps {
  entityRenderer?: (data: ITeam) => ReactNode;
  selectedTeamIds?: string[];
  dataTestId?: string;
}

const TeamsBody: FC<ITeamsBodyProps> = ({
  entityRenderer,
  selectedTeamIds = [],
  dataTestId,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control } = form!;
  const { user } = useAuth();
  const { isAdmin, isLearner } = useRole();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();
  const useOrganization = getApi(ApiEnum.GetOrganization);
  const { data: organization } = useOrganization(undefined, {
    enabled: !isLxp,
  });
  const [teamSearch, showSelectedMembers, teams, categorySearch, categories] =
    watch([
      'teamSearch',
      'showSelectedMembers',
      'teams',
      'categorySearch',
      'categories',
    ]);

  let isLimitGlobalPosting = true;
  if (isLxp) {
    isLimitGlobalPosting = !!isLearner;
  } else {
    isLimitGlobalPosting =
      !!organization?.adminSettings?.postingControls?.limitGlobalPosting &&
      !isAdmin;
  }

  // Reset state on unmount
  useEffect(
    () => () => {
      setValue('selectAll', false);
      setValue('showSelectedMembers', false);
    },
    [],
  );

  // fetch teams datar
  const debouncedSearchValue = useDebounce(teamSearch || '', 500);
  const useInfiniteTeams = getApi(ApiEnum.GetTeams);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams({
      q: isFiltersEmpty({
        q: debouncedSearchValue,
        categoryIds:
          selectedCategories && selectedCategories.length
            ? selectedCategories.join(',')
            : undefined,
        userId: isLimitGlobalPosting ? user?.id : undefined,
      }),
    });
  const teamsData = data?.pages
    .flatMap((page: any) => {
      return page?.data?.result?.data.map((team: ITeam) => team);
    })
    .filter((team: ITeam) => {
      if (showSelectedMembers) {
        return !!teams[team.id];
      }
      return true;
    });

  // fetch category data
  const debouncedCategorySearchValue = useDebounce(categorySearch || '', 500);
  const useInfiniteCategories = getApi(ApiEnum.GetCategories);
  const {
    data: fetchedCategories,
    isLoading: categoryLoading,
    isFetchingNextPage: isFetchingNextCategoryPage,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
  } = useInfiniteCategories({
    q: debouncedCategorySearchValue,
    type: CategoryType.TEAM,
  });
  const categoryData: ICategory[] = fetchedCategories?.pages.flatMap(
    (page: any) => {
      return page?.data?.result?.data.map((category: ICategory) => category);
    },
  );

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    teamsData?.forEach((team: ITeam) => setValue(`teams.${team.id}`, team));
  };

  const deselectAll = () => {
    Object.keys(teams || {}).forEach((key) => {
      setValue(`teams.${key}`, false);
    });
  };

  const updateSelectAll = () => {
    if (!teamsData || teamsData.length === 0 || showSelectedMembers) {
      setValue('selectAll', false);
      return;
    }
    const allSelected = teamsData.every((team: ITeam) => !!teams[team.id]);
    setValue('selectAll', allSelected && teamsData.length > 1);
  };

  useEffect(() => {
    if (showSelectedMembers) {
      setValue('selectAll', false);
    }
    updateSelectAll();
  }, [showSelectedMembers]);

  const selectedCount = Object.values(teams || {}).filter(Boolean).length;

  const isControlsDisabled =
    !!!teamsData?.length && debouncedSearchValue !== '';

  return (
    <div className="flex flex-col min-h-[489px]">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'teamSearch',
              label: 'Search for a team',
              placeholder: 'Search via team name',
              isClearable: true,
              dataTestId: `${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
            },
          ]}
        />
        {!isLxp ? (
          <div className="flex items-center justify-between pt-4">
            <div
              className={`flex items-center text-neutral-500 font-medium text-sm ${
                isControlsDisabled && 'opacity-50 pointer-events-none'
              }`}
            >
              Quick filters:
              <div className="relative">
                <InfiniteSearch
                  title="Category"
                  control={control}
                  options={
                    categoryData?.map((category) => ({
                      label: category.name,
                      value: category,
                      id: category.id,
                    })) || []
                  }
                  searchName={'categorySearch'}
                  optionsName={'categories'}
                  isLoading={categoryLoading}
                  isFetchingNextPage={isFetchingNextCategoryPage}
                  fetchNextPage={fetchNextCategoryPage}
                  hasNextPage={hasNextCategoryPage}
                  onApply={() =>
                    setSelectedCategories([
                      ...Object.keys(categories).filter(
                        (key: string) => !!categories[key],
                      ),
                    ])
                  }
                  onReset={() => {
                    setSelectedCategories([]);
                    if (categories) {
                      Object.keys(categories).forEach((key: string) =>
                        setValue(`categories.${key}`, false),
                      );
                    }
                  }}
                  selectionCount={selectedCategories.length}
                  dataTestId={`${dataTestId}-filter-category`}
                />
              </div>
            </div>
            <div
              className={`cursor-pointer text-neutral-500 text-sm font-medium hover:underline ${
                isControlsDisabled && 'opacity-50 pointer-events-none'
              }`}
              onClick={() => {
                setSelectedCategories([]);
                Object.keys(categories).forEach((key: string) =>
                  setValue(`categories.${key}`, false),
                );
              }}
              data-testid={`${dataTestId}-clearfilter`}
            >
              Clear filters
            </div>
          </div>
        ) : null}
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div
          className={`flex justify-between py-4 pr-6 ${
            isControlsDisabled && 'opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center">
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'selectAll',
                  control,
                  label: 'Select all',
                  className: 'flex item-center',
                  transform: {
                    input: (value: boolean) => value && !showSelectedMembers,
                    output: (e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        selectAllEntity();
                      } else {
                        deselectAll();
                      }
                      return e.target.checked;
                    },
                  },
                  disabled:
                    showSelectedMembers ||
                    isControlsDisabled ||
                    !teamsData?.length ||
                    teamsData.length === 1,
                  dataTestId: `${dataTestId}-selectall`,
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: `Show selected (${selectedCount})`,
                  className: 'flex item-center',
                  disabled: selectedCount === 0 && !showSelectedMembers,
                  dataTestId: `${dataTestId}-showselected`,
                },
              ]}
              className="ml-4"
            />
          </div>
          <div
            className="cursor-pointer text-neutral-500 font-semibold hover:underline"
            onClick={() => {
              deselectAll();
              setValue('selectAll', false);
              setValue('showSelectedMembers', false);
            }}
            data-testid={`${dataTestId}-clearall`}
          >
            clear all
          </div>
        </div>
        <div
          className="flex flex-col max-h-80 overflow-scroll"
          tabIndex={0}
          data-testid={`${dataTestId}-list`}
        >
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : teamsData?.length ? (
            <ul>
              {teamsData?.map((team: ITeam, index: number) => (
                <li key={`team-${team.id}-${index}`}>
                  <div className="py-2 flex items-center w-full">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `teams.${team.id}`,
                          control,
                          className: 'flex item-center mr-4 w-full',
                          transform: {
                            input: (value: ITeam | boolean) => !!value,
                            output: (e: ChangeEvent<HTMLInputElement>) => {
                              const result = e.target.checked ? team : false;
                              return result;
                            },
                          },
                          defaultChecked: selectedTeamIds.includes(team.id),
                          dataTestId: `${dataTestId}-select-${team.id}`,
                          label: (
                            <div className="w-full cursor-pointer">
                              {(entityRenderer && entityRenderer(team)) || (
                                <TeamRow team={team} />
                              )}
                            </div>
                          ),
                          labelContainerClassName: 'w-full',
                        },
                      ]}
                      className="w-full"
                    />
                  </div>
                  {index !== teamsData.length - 1 && <Divider />}
                </li>
              ))}
            </ul>
          ) : (
            <NoDataFound
              className="py-4 w-full"
              searchString={teamSearch}
              onClearSearch={() => {}}
              message={
                <p>
                  Sorry we can&apos;t find the member you are looking for.
                  <br /> Please check the spelling or try again.
                </p>
              }
              hideClearBtn
              dataTestId={`${dataTestId}-noresult`}
            />
          )}
          {hasNextPage && !showSelectedMembers && !isFetchingNextPage && (
            <div ref={ref} />
          )}
          {isFetchingNextPage && (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsBody;
