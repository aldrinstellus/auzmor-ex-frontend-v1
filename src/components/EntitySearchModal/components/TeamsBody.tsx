import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ITeam, useInfiniteTeams } from 'queries/teams';
import TeamRow from './TeamRow';
import InfiniteSearch from 'components/InfiniteSearch';
import { ICategory, useInfiniteCategories } from 'queries/category';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';

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
  const [teamSearch, showSelectedMembers, teams, categorySearch, categories] =
    watch([
      'teamSearch',
      'showSelectedMembers',
      'teams',
      'categorySearch',
      'categories',
    ]);

  // fetch teams datar
  const debouncedSearchValue = useDebounce(teamSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams({
      q: {
        q: debouncedSearchValue,
        category: selectedCategories,
      },
    });
  const teamsData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((team: ITeam) => {
        try {
          return team;
        } catch (e) {
          console.log('Error', { team });
        }
      });
    })
    .filter((team) => {
      if (showSelectedMembers) {
        return !!teams[team.id];
      }
      return true;
    });

  // fetch category data
  const debouncedCategorySearchValue = useDebounce(categorySearch || '', 500);
  const {
    data: fetchedCategories,
    isLoading: categoryLoading,
    isFetchingNextPage: isFetchingNextCategoryPage,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
  } = useInfiniteCategories({
    q: debouncedCategorySearchValue,
  });
  const categoryData = fetchedCategories?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((category: ICategory) => {
      try {
        return category;
      } catch (e) {
        console.log('Error', { category });
      }
    });
  });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    teamsData?.forEach((team: ITeam) => {
      setValue(`teams.${team.id}`, team);
    });
  };

  const deselectAll = () => {
    Object.keys(teams).forEach((key) => {
      setValue(`teams.${key}`, false);
    });
  };

  const updateSelectAll = () => {
    if (Object.keys(teams).some((key: string) => !!!teams[key])) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

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
              dataTestId: `select-${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
            },
          ]}
          className="pb-4"
        />
        <div className="flex items-center justify-between">
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
                dataTestId={`categoryfilter`}
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
            data-testid={`select-${dataTestId}-clearfilter`}
          >
            Clear filters
          </div>
        </div>
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
                    input: (value: boolean) => {
                      return value;
                    },
                    output: (e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        selectAllEntity();
                      } else {
                        deselectAll();
                      }
                      return e.target.checked;
                    },
                  },
                  dataTestId: `select-${dataTestId}-selectall`,
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: `Show selected members (${
                    Object.keys(teams).filter((key: string) => !!teams[key])
                      .length
                  })`,
                  className: 'flex item-center',
                  dataTestId: `select-${dataTestId}-showselected`,
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
            data-testid={`select-${dataTestId}-clearall`}
          >
            clear all
          </div>
        </div>
        <div className="flex flex-col max-h-72 overflow-scroll">
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : teamsData?.length ? (
            teamsData?.map((team, index) => (
              <div key={team.id}>
                <div className="py-2 flex items-center">
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `teams.${team.id}`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: ITeam | boolean) => {
                            updateSelectAll();
                            return !!value;
                          },
                          output: (e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return team;
                            return false;
                          },
                        },
                        defaultChecked: selectedTeamIds.includes(team.id),
                      },
                    ]}
                  />
                  {(entityRenderer && entityRenderer(team)) || (
                    <TeamRow team={team} />
                  )}
                </div>
                {index !== teamsData.length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center w-full justify-center">
              <div className="mt-8 mb-4">
                <img src={require('images/noResult.png')} />
              </div>
              <div className="text-neutral-900 text-lg font-bold mb-4">
                No result found
                {!!teamSearch && ` for ‘${teamSearch}’`}
              </div>
              <div className="text-neutral-500 text-xs">
                Sorry we can’t find the member you are looking for.
              </div>
              <div className="text-neutral-500 text-xs">
                Please check the spelling or try again.
              </div>
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default TeamsBody;
