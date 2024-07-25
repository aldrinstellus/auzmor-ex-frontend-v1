import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IGetUser, useInfiniteUsers, UserStatus } from 'queries/users';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import InfiniteSearch from 'components/InfiniteSearch';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import NoDataFound from 'components/NoDataFound';
import { ITeam, useInfiniteTeams } from 'queries/teams';
import {
  enumToTitleCase,
  getFullName,
  getProfileImage,
  isFiltersEmpty,
  titleCase,
} from 'utils/misc';
import TeamRow from './TeamRow';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import Button from 'components/Button';
import { CHANNEL_ROLE } from 'stores/channelStore';
import { TeamRowVariant } from './TeamRow';
import { IBypeople, IStatus } from 'components/FilterModal';
import { ByPeopleEnum } from 'components/FilterModal/ByPeople';
interface IMembersBodyProps {
  dataTestId?: string;
  fetchUsers?: (queryParams: any) => any;
  usersQueryParams?: Record<string, any>;
}

const ChannelMembersBody: FC<IMembersBodyProps> = ({
  dataTestId,
  fetchUsers = useInfiniteUsers,
  usersQueryParams = {},
}) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUserStatus, setUserSelectedStatus] = useState<string[]>([]);
  const [selectedByPeople, setSelectedByPeople] = useState<string[]>([]);
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control, unregister, getValues } = form!;
  const [
    memberSearch,
    showSelectedMembers,
    channelMembers,
    teamSearch,
    teams,
    userStatus,
    userStatusSearch,
    byPeople,
    byPeopleSearch,
  ] = watch([
    'memberSearch',
    'showSelectedMembers',
    'channelMembers',
    'teamSearch',
    'teams',
    'userStatus',
    'userStatusSearch',
    'byPeople',
    'byPeopleSearch',
  ]);

  const debouncedByPeopleSearchValue = useDebounce(byPeopleSearch || '', 300);
  const byPeopleData: IBypeople[] = [
    { id: ByPeopleEnum.OTHERS, name: enumToTitleCase(ByPeopleEnum.OTHERS) },
    {
      id: ByPeopleEnum.DIRECT_REPORTEES,
      name: enumToTitleCase(ByPeopleEnum.DIRECT_REPORTEES),
    },
  ].filter((value) =>
    value.name
      .toLowerCase()
      .includes(debouncedByPeopleSearchValue.toLowerCase()),
  );
  const debouncedUserStatusSearchValue = useDebounce(
    userStatusSearch || '',
    300,
  );
  const statusData: IStatus[] = [
    { id: UserStatus.Active, name: titleCase(UserStatus.Active) },
    { id: UserStatus.Inactive, name: titleCase(UserStatus.Inactive) },
    { id: UserStatus.Pending, name: titleCase(UserStatus.Pending) },
  ].filter((value) =>
    value.name
      .toLowerCase()
      .includes(debouncedUserStatusSearchValue.toLowerCase()),
  );
  // fetch users from search input
  const debouncedSearchValue = useDebounce(memberSearch || '', 500);
  const {
    data: fetchedUsers,
    isLoading: userLoading,
    isFetchingNextPage: isFetchingNextUserPage,
    fetchNextPage: fetchNextUserPage,
    hasNextPage: hasNextUserPage,
  } = fetchUsers({
    q: {
      q: debouncedSearchValue,
      userTeam: selectedTeams.length > 0 ? selectedTeams.join(',') : undefined,
      byPeople:
        selectedByPeople.length > 0 ? selectedByPeople.join(',') : undefined,
      ...usersQueryParams,
      userStatus:
        selectedUserStatus.length > 0
          ? selectedUserStatus.join(',')
          : undefined,
      ...usersQueryParams,
    },
  });

  let usersData: IGetUser[] =
    fetchedUsers?.pages
      .flatMap((page: any) => {
        return page?.data?.result?.data.map((user: IGetUser) => {
          try {
            return user;
          } catch (e) {
            console.log('Error', { user });
          }
        });
      })
      .filter(Boolean)
      .filter((user: IGetUser) => {
        if (showSelectedMembers) {
          return !!channelMembers?.users?.[user.id];
        }
        return true;
      }) || [];

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
      q: debouncedSearchValue,
    }),
  });

  let teamsData: ITeam[] =
    fetchedTeams?.pages
      .flatMap((page) => {
        return page?.data?.result?.data.map((team: ITeam) => {
          try {
            return team;
          } catch (e) {
            console.log('Error', { team });
          }
        });
      })
      .filter(Boolean)
      .filter((team) => {
        if (showSelectedMembers) {
          return !!channelMembers?.teams[team.id];
        }
        return true;
      }) || [];
  const {
    data: _fetchedTeams,
    isLoading: _teamLoading,
    isFetchingNextPage: _isFetchingNextTeamPage,
    fetchNextPage: _fetchNextTeamPage,
    hasNextPage: _hasNextTeamPage,
  } = useInfiniteTeams({
    q: isFiltersEmpty({
      q: debouncedTeamSearchValue,
    }),
  });

  const _teamsData: ITeam[] =
    _fetchedTeams?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((team: ITeam) => {
        try {
          return team;
        } catch (e) {
          console.log('Error', { team });
        }
      });
    }) || [];

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
    console.log('selecting all');
    usersData?.forEach((user: IGetUser) =>
      setValue(`channelMembers.users.id-${user.id}.user`, user),
    );
    teamsData?.forEach((team: ITeam) =>
      setValue(`channelMembers.teams.id-${team.id}.team`, team),
    );
    console.log('done selecting all');
  };

  const deselectAll = () => {
    Object.keys(channelMembers?.users || {}).forEach((key) => {
      setValue(`channelMembers.users.${key}`, { user: undefined });
    });
    Object.keys(channelMembers?.teams || {}).forEach((key) => {
      setValue(`channelMembers.teams.${key}`, { team: undefined });
    });
  };

  const userKeys = Object.keys(channelMembers?.users || {});
  const teamKeys = Object.keys(channelMembers?.teams || {});

  useEffect(() => {
    if (!showSelectedMembers) {
      unregisterMembers();
    }
    updateSelectAll();
  }, [userKeys, teamKeys, usersData, teamsData, showSelectedMembers]);

  const unregisterMembers = () => {
    userKeys.forEach((key) => {
      if (
        !usersData?.find(
          (user: IGetUser) => user.id === key.replace('id-', ''),
        ) &&
        !channelMembers?.users[key]
      )
        unregister(`channelMembers.users.${key}`);
    });
    teamKeys.forEach((key) => {
      if (
        !teamsData?.find((team: ITeam) => team.id === key.replace('id-', '')) &&
        !channelMembers?.teams[key]
      )
        unregister(`channelMembers.teams.${key}`);
    });
  };

  const selectedMembers = {
    users: userKeys
      .map((key) => channelMembers?.users[key]?.user)
      .filter(Boolean),
    teams: teamKeys
      .map((key) => channelMembers?.teams[key]?.team)
      .filter(Boolean),
  };
  const selectedCount =
    selectedMembers.users.length + selectedMembers.teams.length;

  const updateSelectAll = () => {
    if (
      usersData?.length === 0 ||
      usersData?.some(
        (user: IGetUser) => !channelMembers?.users?.[`id-${user.id}`]?.user,
      ) ||
      (usersData?.length === 0 && teamsData?.length === 0) ||
      teamsData?.some(
        (team: ITeam) => !channelMembers?.teams?.[`id-${team.id}`]?.team,
      ) ||
      showSelectedMembers
    ) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  if (showSelectedMembers) {
    usersData = selectedMembers.users as IGetUser[];
    teamsData = selectedMembers.teams as ITeam[];
  }

  usersData?.sort((a: IGetUser, b: IGetUser) => {
    if (a.fullName! > b.fullName!) return 1;
    else if (a.fullName! < b.fullName!) return -1;
    else return 0;
  });

  teamsData?.sort((a: ITeam, b: ITeam) => {
    if (a.name > b.name) return 1;
    else if (a.name < b.name) return -1;
    else return 0;
  });

  const isControlsDisabled =
    !!!usersData?.length && !!!teamsData?.length && debouncedSearchValue !== '';

  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'memberSearch',
              label: 'Select member',
              placeholder: 'Add via name or email address or Team name',
              isClearable: true,
              dataTestId: `${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
              autofocus: true,
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
                title="Teams"
                control={control}
                options={
                  _teamsData?.map((team: ITeam) => ({
                    label: team.name,
                    value: team,
                    id: team.id,
                  })) || []
                }
                searchName={'teamSearch'}
                optionsName={'teams'}
                isLoading={_teamLoading}
                isFetchingNextPage={_isFetchingNextTeamPage}
                fetchNextPage={_fetchNextTeamPage}
                hasNextPage={_hasNextTeamPage}
                onApply={() =>
                  setSelectedTeams([
                    ...Object.keys(teams).filter((key: string) => !!teams[key]),
                  ])
                }
                onReset={() => {
                  setSelectedTeams([]);
                  if (teams) {
                    Object.keys(teams).forEach((key: string) =>
                      setValue(`teams.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedTeams.length}
                dataTestId={`${dataTestId}-filter-jobtitle`}
              />
            </div>
            <div className="relative">
              <InfiniteSearch
                title="User status"
                control={control}
                options={
                  statusData?.map((user) => ({
                    label: user.name,
                    value: user,
                    id: user.id,
                  })) || []
                }
                searchName={'userStatusSearch'}
                optionsName={'userStatus'}
                onApply={() =>
                  setUserSelectedStatus([
                    ...Object.keys(userStatus).filter(
                      (key: string) => !!userStatus[key],
                    ),
                  ])
                }
                onReset={() => {
                  setUserSelectedStatus([]);
                  if (userStatus) {
                    Object.keys(userStatus).forEach((key: string) =>
                      setValue(`userStatus.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedUserStatus.length}
                dataTestId={`${dataTestId}-filter-userStatus`}
              />
            </div>
            <div className="relative">
              <InfiniteSearch
                title="By people"
                control={control}
                options={
                  byPeopleData?.map((user) => ({
                    label: user.name,
                    value: user,
                    id: user.id,
                  })) || []
                }
                searchName={'byPeopleSearch'}
                optionsName={'byPeople'}
                onApply={() =>
                  setSelectedByPeople([
                    ...Object.keys(byPeople).filter(
                      (key: string) => !!byPeople[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedByPeople([]);
                  if (byPeople) {
                    Object.keys(byPeople).forEach((key: string) =>
                      setValue(`byPeople.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedByPeople.length}
                dataTestId={`${dataTestId}-filter-byPeople`}
              />
            </div>
          </div>
          <div
            className={`cursor-pointer text-neutral-500 text-sm font-medium hover:underline ${
              isControlsDisabled && 'opacity-50 pointer-events-none'
            }`}
            onClick={() => {
              setUserSelectedStatus([]);
              setSelectedByPeople([]);
              setSelectedTeams([]);
              Object.keys(teams || {}).forEach((key: string) =>
                setValue(`teams.${key}`, false),
              );
              Object.keys(byPeople || {}).forEach((key: string) =>
                setValue(`byPeople.${key}`, false),
              );
              Object.keys(userStatus || {}).forEach((key: string) =>
                setValue(`userStatus.${key}`, false),
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
          className="flex flex-col h-72 overflow-y-scroll"
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
                  user.isPresent ? 'opacity-50 pointer-events-none' : undefined
                }
              >
                <div className="py-3 flex items-center">
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `channelMembers.users.id-${user.id}.user`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: IGetUser | boolean) => {
                            updateSelectAll();
                            return !!value;
                          },
                          output: (e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return user;
                            return undefined;
                          },
                        },
                        defaultChecked: false,
                        dataTestId: `${dataTestId}-select-${user.id}`,
                      },
                    ]}
                  />

                  <div className="w-full flex items-center cursor-pointer">
                    <div
                      className="flex items-center space-x-4 w-full"
                      onClick={() => {
                        setValue(
                          `channelMembers.users.id-${user.id}.user`,
                          !!getValues(`channelMembers.users.id-${user.id}.user`)
                            ? undefined
                            : user,
                        );
                      }}
                    >
                      <Avatar
                        name={getFullName(user) || 'U'}
                        size={32}
                        image={getProfileImage(user)}
                        dataTestId="member-profile-pic"
                      />
                      <div className="flex space-x-6 w-full">
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center">
                            <div
                              className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1"
                              data-testid="member-name"
                            >
                              {getFullName(user)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className="text-xs font-normal text-neutral-500"
                              data-testid="member-email"
                            >
                              {user?.email}
                            </div>
                            {user?.designation && (
                              <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                            )}
                            {user.designation && (
                              <div className="flex space-x-1 items-start">
                                <Icon name="briefcase" size={16} />
                                <div
                                  className="text-xs  font-normal text-neutral-500"
                                  data-testid="member-designation"
                                >
                                  {user?.designation?.substring(0, 22)}
                                </div>
                              </div>
                            )}

                            {}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative pr-2 shrink-0">
                      <PopupMenu
                        triggerNode={
                          <Button
                            className={`!text-sm !font-bold ${
                              user?.isPresent
                                ? ''
                                : '!bg-primary-50 !border-primary-200 border-1 !text-primary-500 capitalize'
                            }`}
                            label={
                              user?.isPresent
                                ? 'Already a member'
                                : getValues(
                                    `channelMembers.users.id-${user.id}.role`,
                                  )?.toLowerCase() || 'Member'
                            }
                            rightIcon={user?.isPresent ? '' : 'arrowDown'}
                            rightIconSize={20}
                            rightIconClassName="!text-primary-500"
                            disabled={user?.isPresent}
                          />
                        }
                        menuItems={
                          [
                            {
                              value: CHANNEL_ROLE.Admin,
                              label: 'Admin',
                              onClick: () => {
                                setValue(
                                  `channelMembers.users.id-${user.id}.role`,
                                  CHANNEL_ROLE.Admin,
                                );
                              },
                            },

                            {
                              value: CHANNEL_ROLE.Member,
                              label: 'Member',
                              onClick: () => {
                                setValue(
                                  `channelMembers.users.id-${user.id}.role`,
                                  CHANNEL_ROLE.Member,
                                );
                              },
                            },
                          ] as any
                        }
                        className=" w-fit "
                      />
                    </div>
                  </div>
                </div>
                {(index !== usersData?.length - 1 || teamsData.length > 0) && (
                  <Divider />
                )}
              </div>
            ))
          ) : null}
          {!userLoading && !usersData?.length && teamLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : null}
          {!teamLoading && teamsData?.length
            ? teamsData?.map((team: any, index: any) => (
                <div
                  key={`team-${team.id}`}
                  className={
                    team.isPresent
                      ? 'opacity-50 pointer-events-none'
                      : undefined
                  }
                >
                  <div className="py-3 flex items-center">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `channelMembers.teams.id-${team.id}.team`,
                          control,
                          className: 'flex item-center mr-4',
                          transform: {
                            input: (value: ITeam | boolean) => {
                              updateSelectAll();
                              return !!value;
                            },
                            output: (e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.checked) return team;
                              return undefined;
                            },
                          },
                          defaultChecked: false,
                          dataTestId: `${dataTestId}-select-${team.id}`,
                        },
                      ]}
                    />

                    <div className="w-full flex items-center cursor-pointer">
                      <TeamRow
                        team={team}
                        variant={TeamRowVariant.Small}
                        onClick={() => {
                          setValue(
                            `channelMembers.teams.id-${team.id}.team`,
                            !!getValues(
                              `channelMembers.teams.id-${team.id}.team`,
                            )
                              ? undefined
                              : team,
                          );
                        }}
                      />

                      <div className="relative pr-2">
                        <PopupMenu
                          triggerNode={
                            <Button
                              className="!text-sm !font-medium !bg-primary-50 !border-primary-200 border-1 !text-primary-500 capitalize"
                              label={
                                getValues(
                                  `channelMembers.teams.id-${team.id}.role`,
                                )?.toLowerCase() || 'Member'
                              }
                              rightIcon={'arrowDown'}
                              rightIconSize={20}
                              rightIconClassName="!text-primary-500"
                            />
                          }
                          menuItems={
                            [
                              {
                                value: CHANNEL_ROLE.Admin,
                                label: 'Admin',
                                onClick: () => {
                                  setValue(
                                    `channelMembers.teams.id-${team.id}.role`,
                                    CHANNEL_ROLE.Admin,
                                  );
                                },
                              },

                              {
                                value: CHANNEL_ROLE.Member,
                                label: 'Member',
                                onClick: () => {
                                  setValue(
                                    `channelMembers.teams.id-${team.id}.role`,
                                    CHANNEL_ROLE.Member,
                                  );
                                },
                              },
                            ] as any
                          }
                          className="w-fit"
                        />
                      </div>
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
