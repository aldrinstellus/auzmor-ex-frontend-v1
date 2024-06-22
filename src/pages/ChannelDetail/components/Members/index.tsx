import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import AddChannelMembersModal from '../AddChannelMembersModal';
import FilterMenu from 'components/FilterMenu';
import useModal from 'hooks/useModal';
import PeopleCard from 'pages/Users/components/People/PeopleCard';
import UsersSkeleton from 'pages/Users/components/Skeletons/UsersSkeleton';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isFiltersEmpty } from 'utils/misc';
import { useEffect, useState } from 'react';
import { useInfiniteChannelMembers } from 'queries/channel';

import useURLParams from 'hooks/useURLParams';
import PopupMenu from 'components/PopupMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import MemberTable from './MemberTable';
import useRole from 'hooks/useRole';
import { FilterModalVariant } from 'components/FilterModal';
import { IChannel } from '../../../../stores/channelStore';

const Members: React.FC<{ channelData: IChannel }> = ({ channelData }) => {
  const { t } = useTranslation('channels');
  const { filters, setFilters, clearFilters, updateFilter } =
    useAppliedFiltersStore();
  const [isGrid, setGrid] = useState(true);
  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  const { watch } = filterForm;
  const searchValue = watch('search');

  const { searchParams } = useURLParams();
  const parsedTab = searchParams.get('type');
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  useEffect(() => () => clearFilters(), []);
  const { data, isLoading } = useInfiniteChannelMembers({
    channelId: channelData?.id,
    q: isFiltersEmpty({
      q: searchValue,
      status: filters?.status?.length
        ? filters?.status?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
    }),
  });

  const users = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return user;
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  // quick Filters options
  const { isAdmin } = useRole();
  const requestOptions = [
    {
      label: 'All members ',
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'All_Members');
        setGrid(true);
      },
    },
    isAdmin && {
      label: 'Requests',
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'requests');
        setGrid(false);
      },
    },
  ].filter(Boolean); // request options only for admin

  const selectAllEntity = () => {
    // channelMembers?.forEach((user: any) => setValue(`users.${user.id}`, user));
  };

  const deselectAll = () => {
    // Object.keys(users || {}).forEach((key) => {
    //   setValue(`users.${key}`, false);
    // });
  };

  useEffect(() => {
    setFilters({
      type: searchParams.get('type') || 'All_Members',
    });
    if (parsedTab !== 'All_Members') {
      setGrid(false);
    } else {
      setGrid(true);
    }
    return () => clearFilters();
  }, [parsedTab]);

  return (
    <>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">
            {t('members.title')}
          </p>
          <Button
            label={t('members.addMemberCTA')}
            leftIcon="add"
            leftIconClassName="text-white pointer-events-none group-hover:text-white"
            onClick={() => openAddMemberModal()}
          />
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('searchChannels')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
          variant={FilterModalVariant.ChannelMember}
        >
          <div className="flex items-center gap-2">
            <div className="text-neutral-500">
              Showing {users?.length} results
              {/*  {!isLoading && data?.pages[0]?.data?.result?.totalCount}{' '} */}
            </div>
            <div className="relative">
              {isAdmin ? (
                <PopupMenu
                  triggerNode={
                    <Button
                      active={filters?.type}
                      variant={Variant.Secondary}
                      label={
                        filters?.type == 'All_Members'
                          ? 'All members'
                          : 'Requests'
                      }
                      rightIcon={`${isAdmin ? 'arrowDown' : ''}`}
                    />
                  }
                  menuItems={requestOptions as any}
                  className=" w-full "
                />
              ) : (
                <Button
                  active={filters?.type}
                  variant={Variant.Secondary}
                  label={'All members'}
                /> // for end user its a button
              )}
            </div>
          </div>
        </FilterMenu>
        {isGrid ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 xl:grid-cols-4 1.5xl:grid-cols-5">
            {isLoading
              ? [...Array(10)].map((element) => (
                  <div key={element}>
                    <UsersSkeleton />
                  </div>
                ))
              : null}
            {users?.map((user) => (
              <PeopleCard key={user.id} userData={user} />
            ))}
          </div>
        ) : (
          <MemberTable
            data={users}
            selectAllEntity={selectAllEntity}
            deselectAll={deselectAll}
          />
        )}
      </Card>
      {showAddMemberModal && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          title={`Add members @${channelData.name}`}
          dataTestId="add-members"
          onSubmit={() => {}}
          onCancel={closeAddMemberModal}
        />
      )}
    </>
  );
};

export default Members;
