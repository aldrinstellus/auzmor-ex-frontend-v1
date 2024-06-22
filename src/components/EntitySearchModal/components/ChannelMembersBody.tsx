import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IGetUser, useInfiniteUsers } from 'queries/users';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import UserRow from './UserRow';
import InfiniteSearch from 'components/InfiniteSearch';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import useAuth from 'hooks/useAuth';
import { IDesignationAPI, useInfiniteDesignations } from 'queries/designation';
import NoDataFound from 'components/NoDataFound';
import { ICategory, useInfiniteCategories } from 'queries/category';
import { ITeam, useInfiniteTeams } from 'queries/teams';
import { isFiltersEmpty } from 'utils/misc';
import { CategoryType } from 'queries/apps';
import TeamRow from './TeamRow';

type ApiCallFunction = (queryParams: any) => any;
interface IMembersBodyProps {
  entityRenderer?: (data: IGetUser) => ReactNode;
  selectedMemberIds?: string[];
  selectedTeamIds?: string[];
  dataTestId?: string;
  entitySearchLabel?: string;
  hideCurrentUser?: boolean;
  showJobTitleFilter?: boolean;
  disableKey?: string;
  fetchUsers?: ApiCallFunction;
  usersQueryParams?: Record<string, any>;
}

const ChannelMembersBody: FC<IMembersBodyProps> = ({
  entityRenderer,
  selectedMemberIds = [],
  selectedTeamIds = [],
  dataTestId,
  entitySearchLabel,
  hideCurrentUser,
  showJobTitleFilter,
  disableKey,
  fetchUsers = useInfiniteUsers,
  usersQueryParams = {},
}) => {
  const { user: currentUser } = useAuth();
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control, unregister, getValues } = form!;
  const [
    memberSearch,
    teamSearch,
    showSelectedMembers,
    users,
    teams,
    categorySearch,
    categories,
    designationSearch,
    designations,
  ] = watch([
    'memberSearch',
    'teamSearch',
    'showSelectedMembers',
    'users',
    'teams',
    'categorySearch',
    'categories',
    'designationSearch',
    'designations',
  ]);

  console.log({ selectedTeamIds });

  // fetch users from search input
  const debouncedUserSearchValue = useDebounce(memberSearch || '', 500);
  const {
    data: fetchedUsers,
    isLoading: userLoading,
    isFetchingNextPage: isFetchingNextUserPage,
    fetchNextPage: fetchNextUserPage,
    hasNextPage: hasNextUserPage,
  } = fetchUsers({
    q: {
      q: debouncedUserSearchValue,
      designations:
        selectedDesignations.length > 0
          ? selectedDesignations.join(',')
          : undefined,
      ...usersQueryParams,
    },
  });

  let usersData = fetchedUsers?.pages
    .flatMap((page: any) => {
      return page?.data?.result?.data.map((user: IGetUser) => {
        try {
          return user;
        } catch (e) {
          console.log('Error', { user });
        }
      });
    })
    .filter((user: IGetUser) => {
      if (hideCurrentUser && user.id === currentUser!.id) {
        return false;
      }
      if (showSelectedMembers) {
        return !!users?.[user.id];
      }
      return true;
    });

  // fetch teams data
  const debouncedTeamSearchValue = useDebounce(teamSearch || '', 500);
  const {
    data: fetchedTeams,
    isLoading: teamLoading,
    isFetchingNextPage: isFetchingNextTeamPage,
    fetchNextPage: fetchNextTeamPage,
    hasNextPage: hasNextTeamPage,
  } = useInfiniteTeams({
    q: isFiltersEmpty({
      q: debouncedTeamSearchValue,
      categoryIds:
        selectedCategories && selectedCategories.length
          ? selectedCategories.join(',')
          : undefined,
    }),
  });
  const teamsData = fetchedTeams?.pages
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
    type: CategoryType.TEAM,
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

  // fetch designation from search input
  const debouncedDesignationSearchValue = useDebounce(
    designationSearch || '',
    500,
  );
  const {
    data: fetchedDesignations,
    isLoading: designationLoading,
    isFetchingNextPage: isFetchingNextDesignationPage,
    fetchNextPage: fetchNextDesignationPage,
    hasNextPage: hasNextDesignationPage,
  } = useInfiniteDesignations({
    q: {
      q: debouncedDesignationSearchValue,
    },
    startFetching: !!showJobTitleFilter,
  });
  const designationData = fetchedDesignations?.pages.flatMap((page) => {
    return page.data.result.data.map((designation: IDesignationAPI) => {
      try {
        return designation;
      } catch (e) {
        console.log('Error', { designation });
      }
    });
  });

  const { ref, inView } = useInView({
    root: document.getElementById('entity-search-members-body'),
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      if (hasNextUserPage) fetchNextUserPage();
      else fetchNextTeamPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    usersData?.forEach((user: IGetUser) => setValue(`users.${user.id}`, user));
  };

  const deselectAll = () => {
    Object.keys(users || {}).forEach((key) => {
      setValue(`users.${key}`, false);
    });
  };

  const userKeys = Object.keys(users || {});

  useEffect(() => {
    if (!showSelectedMembers) {
      unregisterUsers();
    }
    updateSelectAll();
  }, [userKeys, usersData, showSelectedMembers]);

  const unregisterUsers = () => {
    userKeys.forEach((key) => {
      if (!usersData?.find((user: IGetUser) => user.id === key) && !users[key])
        unregister(`users.${key}`);
    });
  };

  const selectedMembers = userKeys.map((key) => users[key]).filter(Boolean);
  const selectedCount = selectedMembers.length;

  const updateSelectAll = () => {
    if (
      usersData?.length === 0 ||
      usersData?.some((user: IGetUser) => !users?.[user.id]) ||
      showSelectedMembers
    ) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  if (showSelectedMembers) usersData = selectedMembers as IGetUser[];

  usersData?.sort((a: IGetUser, b: IGetUser) => {
    if (a.fullName! > b.fullName!) return 1;
    else if (a.fullName! < b.fullName!) return -1;
    else return 0;
  });

  const isControlsDisabled =
    !!!usersData?.length && debouncedUserSearchValue !== '';

  console.log({ usersData });

  return (
    <div className="flex flex-col min-h-[489px]">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'memberSearch',
              label: entitySearchLabel || 'Select member',
              placeholder: 'Add via name or email address',
              isClearable: true,
              dataTestId: `${dataTestId}-search`,
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
            {showJobTitleFilter && (
              <div className="relative">
                <InfiniteSearch
                  title="Job Title"
                  control={control}
                  options={
                    designationData?.map((designation: IDesignationAPI) => ({
                      label: designation.name,
                      value: designation,
                      id: designation.id,
                    })) || []
                  }
                  searchName={'designationSearch'}
                  optionsName={'designations'}
                  isLoading={designationLoading}
                  isFetchingNextPage={isFetchingNextDesignationPage}
                  fetchNextPage={fetchNextDesignationPage}
                  hasNextPage={hasNextDesignationPage}
                  onApply={() =>
                    setSelectedDesignations([
                      ...Object.keys(designations).filter(
                        (key: string) => !!designations[key],
                      ),
                    ])
                  }
                  onReset={() => {
                    setSelectedDesignations([]);
                    if (designations) {
                      Object.keys(designations).forEach((key: string) =>
                        setValue(`designations.${key}`, false),
                      );
                    }
                  }}
                  selectionCount={selectedDesignations.length}
                  dataTestId={`${dataTestId}-filter-jobtitle`}
                />
              </div>
            )}
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
              setSelectedDesignations([]);
              setSelectedCategories([]);
              Object.keys(designations || {}).forEach((key: string) =>
                setValue(`designations.${key}`, false),
              );
              Object.keys(categories || {}).forEach((key: string) =>
                setValue(`categories.${key}`, false),
              );
            }}
            data-testid={`${dataTestId}-clearfilter`}
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
                  disabled: showSelectedMembers,
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
                  label: `Show selected members (${selectedCount})`,
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
          className="flex flex-col max-h-72 overflow-scroll"
          id="entity-search-members-body"
          data-testid={`${dataTestId}-list`}
        >
          {userLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : usersData?.length ? (
            usersData?.map((user: any, index: any) => (
              <div
                key={`user-${user.id}`}
                className={
                  user[disableKey || '']
                    ? 'opacity-50 pointer-events-none'
                    : undefined
                }
              >
                <div className="py-2 flex items-center">
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `users.${user.id}`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: IGetUser | boolean) => {
                            updateSelectAll();
                            return !!value;
                          },
                          output: (e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return user;
                            return false;
                          },
                        },
                        defaultChecked: selectedMemberIds.includes(user.id),
                        dataTestId: `${dataTestId}-select-${user.id}`,
                      },
                    ]}
                  />

                  <div
                    className="w-full cursor-pointer"
                    onClick={() => {
                      setValue(
                        `users.${user.id}`,
                        !!getValues(`users.${user.id}`) ? false : user,
                      );
                    }}
                  >
                    {(entityRenderer && entityRenderer(user)) || (
                      <UserRow user={user} />
                    )}
                  </div>
                </div>
                {index !== usersData.length - 1 && <Divider />}
              </div>
            ))
          ) : null}
          {!userLoading && !usersData.length && teamLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : null}
          {!teamLoading && teamsData?.length
            ? teamsData?.map((team: any, index: any) => (
                <div
                  key={`team-${team.id}`}
                  className={
                    team[disableKey || '']
                      ? 'opacity-50 pointer-events-none'
                      : undefined
                  }
                >
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
                          dataTestId: `${dataTestId}-select-${team.id}`,
                        },
                      ]}
                    />

                    <div
                      className="w-full cursor-pointer"
                      onClick={() => {
                        setValue(
                          `teams.${team.id}`,
                          !!getValues(`teams.${team.id}`) ? false : team,
                        );
                      }}
                    >
                      <TeamRow team={team} />
                    </div>
                  </div>
                  {index !== teamsData.length - 1 && <Divider />}
                </div>
              ))
            : null}
          {!userLoading &&
          !teamLoading &&
          !usersData?.length &&
          !teamsData?.length ? (
            <NoDataFound
              className="py-4 w-full"
              searchString={memberSearch}
              message={
                <p>
                  Sorry we can&apos;t find the member you are looking for.
                  <br /> Please check the spelling or try again.
                </p>
              }
              hideClearBtn
              dataTestId={`${dataTestId}-noresult`}
            />
          ) : null}
          {(hasNextUserPage || hasNextTeamPage) &&
            !showSelectedMembers &&
            !isFetchingNextUserPage &&
            !isFetchingNextTeamPage && <div ref={ref} />}
          {(isFetchingNextUserPage || isFetchingNextTeamPage) && (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelMembersBody;
