import truncate from 'lodash/truncate';
import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { FC, useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';
import { ITeam, useInfiniteTeams } from 'queries/teams';
import AvatarList from 'components/AvatarList';
import ItemSkeleton from './ItemSkeleton';

interface ITeamsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Teams: FC<ITeamsProps> = ({ control, watch, setValue }) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'teamSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `team-search`,
    },
  ];

  const [teamSearch, teamCheckbox] = watch(['teamSearch', 'teamCheckbox']);

  // fetch team from search input
  const debouncedTeamSearchValue = useDebounce(teamSearch || '', 300);
  const {
    data: fetchedTeams,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteTeams({
    q: {
      q: debouncedTeamSearchValue,
    },
  });
  const teamData = fetchedTeams?.pages.flatMap((page) => {
    return page.data.result.data.map((team: ITeam) => team);
  });

  const teamFields = [
    {
      type: FieldType.CheckboxList,
      name: 'teamCheckbox',
      control,
      options: teamData?.map((team: ITeam) => ({
        data: team,
        datatestId: `team-${team.name}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer w-full text-xs flex justify-between items-center">
          <div className="flex gap-[7px] items-center">
            {option.data.recentMembers?.length !== 0 && (
              <AvatarList
                size={24}
                users={option.data.recentMembers.map((member: any) => ({
                  ...member,
                  image: member.profileImage?.medium,
                }))}
                avatarClassName="!b-[1px]"
                moreCount={option.data.totalMembers}
                className="-space-x-[12px]"
                dataTestId="teams-people-icon"
              />
            )}
            <span className="font-bold text-sm truncate">
              {truncate(option.data?.name, { length: 16, separator: '' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <div className="truncate">
              {truncate(option.data.category?.name, {
                length: 10,
                separator: ' ',
              })}
            </div>
            <div className="bg-neutral-500 rounded-full w-1 h-1" />
            <div className="flex items-center justify-center space-x-1">
              <Icon name="profileUserOutline" hover={false} size={16} />
              <div
                className="text-xs font-normal whitespace-nowrap"
                data-testid={`team-no-of-members-${option.data.totalMembers}`}
              >
                {option.data.totalMembers} members
              </div>
            </div>
          </div>
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!teamCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {teamCheckbox.map((team: ICheckboxListOption) => (
              <li
                key={team.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {team.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'teamCheckbox',
                        teamCheckbox.filter(
                          (selectedTeam: ICheckboxListOption) =>
                            selectedTeam.data.id !== team.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {(() => {
          if (isLoading) {
            return (
              <>
                {[...Array(10)].map((element) => (
                  <div
                    key={element}
                    className={`px-6 py-3 border-b-1 border-b-bg-neutral-200 flex items-center`}
                  >
                    <ItemSkeleton />
                  </div>
                ))}
              </>
            );
          }
          if ((teamData || []).length > 0) {
            return (
              <div>
                <Layout fields={teamFields} />
                {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                {isFetchingNextPage && (
                  <div className="w-full flex items-center justify-center p-8">
                    <Spinner />
                  </div>
                )}
              </div>
            );
          }
          return (
            <>
              {(debouncedTeamSearchValue === undefined ||
                debouncedTeamSearchValue === '') &&
              teamData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  No Teams found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedTeamSearchValue &&
                    ` for '${debouncedTeamSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Teams;
