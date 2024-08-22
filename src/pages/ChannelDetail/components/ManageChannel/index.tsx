import ManageAccessTable from './ManageAccessTable';
import Card from 'components/Card';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useTranslation } from 'react-i18next';
import { useInfiniteChannelMembers } from 'queries/channel';
import { isFiltersEmpty } from 'utils/misc';
import { useForm } from 'react-hook-form';
import useModal from 'hooks/useModal';
import Button from 'components/Button';
import FilterMenu from 'components/FilterMenu';
import Spinner from 'components/Spinner';
import { UserRole } from 'queries/users';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { FilterModalVariant } from 'components/FilterModal';
import { useEffect, useRef } from 'react';
import { ShowingCount } from 'pages/Users/components/Teams';
import AddChannelMembersModal from '../AddChannelMembersModal';
import { IChannel } from 'stores/channelStore';
import useURLParams from 'hooks/useURLParams';
import NoDataFound from 'components/NoDataFound';

type AppProps = {
  channelData: IChannel;
};

const ManageAccess: React.FC<AppProps> = ({ channelData }) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'manageAccess' });
  const { updateParam, deleteParam, serializeFilter, parseParams } =
    useURLParams();
  const parsedRole = parseParams('roles');

  const { filters, clearFilters } = useAppliedFiltersStore();
  const filterForm = useForm<{
    search: string;
    roles?: any;
  }>({
    mode: 'onChange',
    defaultValues: { search: '', roles: parsedRole },
  });
  const { watch, control, resetField } = filterForm;

  const roles = watch('roles');

  const roleSelectRef = useRef<any>();

  useEffect(() => {
    if (roles) {
      const serializedRole = serializeFilter({
        label: roles.label,
        value: roles.value,
      });
      updateParam('roles', serializedRole);
    } else deleteParam('roles');
  }, [roles]);

  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);

  const searchValue = watch('search');
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteChannelMembers({
      channelId: channelData?.id,
      q: isFiltersEmpty({
        q: searchValue,
        sort: filters?.sort,
        userRole: roles?.value,
        userStatus: filters?.status?.length
          ? filters?.status?.map((eachStatus: any) => eachStatus.id).join(',')
          : undefined,
        userTeam: filters?.teams?.length
          ? filters?.teams?.map((eachStatus: any) => eachStatus.id).join(',')
          : undefined,
        byPeople: filters?.byPeople?.length
          ? filters?.byPeople?.map((eachStatus: any) => eachStatus.id).join(',')
          : undefined,
      }),
    });
  const channelMembers = data?.pages.flatMap((page) => {
    return page?.data?.result?.data
      .map((user: any) => {
        try {
          return {
            id: user.id,
            role: user.role,
            createdAt: user.createdAt,
            ...user.user,
          };
        } catch (e) {
          console.log('Error', { user });
        }
      })
      .filter(Boolean);
  });

  const roleFields = [
    {
      type: FieldType.SingleSelect,
      control,
      height: 36,
      name: 'roles',
      placeholder: t('role'),
      size: InputSize.Small,
      dataTestId: 'filterby-role',
      selectClassName: 'single-select-bold',
      ref: roleSelectRef,
      showSearch: false,
      options: [
        {
          value: UserRole.Admin,
          label: t('admin'),
          dataTestId: 'filterby-role-admin',
        },
        {
          value: UserRole.Member,
          label: t('member'),
          dataTestId: 'filterby-role-member',
        },
      ],
    },
  ];

  return (
    <div>
      <Card className="p-8 flex flex-col gap-6 pb-40  ">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">{t('title')}</p>
          <Button
            label={t('members.addMemberCTA')}
            leftIcon="add"
            leftIconClassName="!text-white pointer-events-none group-hover:text-white"
            onClick={() => openAddMemberModal()}
          />
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('members.searchMembers')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
          variant={FilterModalVariant.ChannelsMangeAcess}
        >
          <div className="flex items-center gap-2">
            <ShowingCount
              isLoading={isLoading}
              count={data?.pages[0]?.data?.result?.totalCount}
            />
            <Layout fields={roleFields} />
          </div>
        </FilterMenu>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : channelMembers?.length === 0 ? (
          <NoDataFound
            className="py-4 w-full"
            searchString={searchValue}
            illustration="noResult"
            message={
              <p>
                {t('noDataFound.message')}
                <br />
                {t('noDataFound.messageLine2')}
              </p>
            }
            clearBtnLabel={
              searchValue
                ? t('noDataFound.clearSearch')
                : t('noDataFound.clearFilters')
            }
            onClearSearch={() => {
              searchValue && resetField
                ? resetField('search', { defaultValue: '' })
                : clearFilters();
            }}
            dataTestId="people"
          />
        ) : (
          <ManageAccessTable
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            data={channelMembers}
          />
        )}
      </Card>
      {showAddMemberModal && channelData && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          closeModal={closeAddMemberModal}
          channelData={channelData}
        />
      )}
    </div>
  );
};

export default ManageAccess;
