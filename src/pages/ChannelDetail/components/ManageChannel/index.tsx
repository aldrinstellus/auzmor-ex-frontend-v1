import ManageAccessTable from './ManageAccessTable';
import InfiniteSearch from 'components/InfiniteSearch';
import Card from 'components/Card';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useTranslation } from 'react-i18next';
import { useInfiniteChannelMembers } from 'queries/channel';
import { getFullName, getProfileImage, isFiltersEmpty } from 'utils/misc';
import { useForm } from 'react-hook-form';
import useModal from 'hooks/useModal';
import Button from 'components/Button';
import FilterMenu from 'components/FilterMenu';
import { IDepartmentAPI, useInfiniteDepartments } from 'queries/department';
import { useDebounce } from 'hooks/useDebounce';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';
import Avatar from 'components/Avatar';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import { useParams } from 'react-router-dom';
import { UserRole } from 'queries/users';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { FilterModalVariant } from 'components/FilterModal';
import useProduct from 'hooks/useProduct';

const ManageAccess = () => {
  const { t } = useTranslation('channels');
  const { filters } = useAppliedFiltersStore();
  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  const { control } = filterForm;
  const { channelId } = useParams();
  const { isLxp } = useProduct();
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const { data, isLoading } = useInfiniteChannelMembers({
    channelId: channelId,
    q: isFiltersEmpty({
      role: filters?.type,
      departments: 'departmentDebounced',
      // rest payload
    }),
  });
  const channelMembers = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return user;
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  const roleFields = [
    {
      type: FieldType.SingleSelect,
      control,
      height: 36,
      name: 'role',
      placeholder: 'Role',
      size: InputSize.Small,
      dataTestId: 'filterby-role',
      selectClassName: 'single-select-bold',
      // ref: roleSelectRef,
      showSearch: false,
      options: [
        {
          value: UserRole.Admin,
          label: 'Admin',
          dataTestId: 'filterby-role-admin',
        },
        {
          value: UserRole.Member,
          label: 'Member',
          dataTestId: 'filterby-role-member',
        },
      ],
    },
  ];

  const departmentSearch = ''; // add the same debounced value of filters .
  const debouncedDepartmentSearchValue = useDebounce(
    departmentSearch || '',
    500,
  );
  // quick filter
  const {
    data: fetchedDepartments,
    isLoading: departmentLoading,
    isFetchingNextPage: isFetchingNextDepartmentPage,
    fetchNextPage: fetchNextDepartmentPage,
    hasNextPage: hasNextDepartmentPage,
  } = useInfiniteDepartments({
    q: debouncedDepartmentSearchValue,
  });
  const departmentData = fetchedDepartments?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((department: IDepartmentAPI) => {
      try {
        return department;
      } catch (e) {
        console.log('Error', { department });
      }
    });
  });

  return (
    <div>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">
            {t('manageAccess.title')}
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
          variant={FilterModalVariant.ChannelsMangeAcess}
        >
          <div className="flex items-center gap-2">
            <div className="text-neutral-500">
              {!isLoading && <> Showing {channelMembers?.length} results </>}
            </div>

            <div className={`relative ${isLxp ? 'hidden' : 'block'}`}>
              <InfiniteSearch
                triggerNodeClassName={'!py-2 !px-4'}
                title="Departments"
                control={control}
                options={
                  departmentData?.map((department: IDepartmentAPI) => ({
                    label: department.name,
                    value: department,
                    id: department.id,
                  })) || []
                }
                searchName={'departmentSearch'}
                optionsName={'departments'}
                isLoading={departmentLoading}
                isFetchingNextPage={isFetchingNextDepartmentPage}
                fetchNextPage={fetchNextDepartmentPage}
                hasNextPage={hasNextDepartmentPage}
                onApply={() => {}}
                onReset={() => {}}
                // selectionCount={selectedDepartments.length}
              />
            </div>

            <Layout fields={roleFields} />
          </div>
        </FilterMenu>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <ManageAccessTable data={channelMembers} />
        )}
      </Card>
      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          entityType={EntitySearchModalType.Channel}
          dataTestId="add-members"
          entityRenderer={(data: any) => {
            return (
              <div className="flex items-center space-x-4 w-full">
                <Avatar
                  name={getFullName(data) || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                  dataTestId="member-profile-pic"
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div
                        className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1"
                        data-testid="member-name"
                      >
                        {getFullName(data)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="text-xs font-normal text-neutral-500"
                        data-testid="member-email"
                      >
                        {data?.primaryEmail}
                      </div>
                      {data?.department && data?.workLocation?.name && (
                        <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                      )}
                      {data?.department?.name && (
                        <div className="flex space-x-1 items-start">
                          <Icon name="briefcase" size={16} />
                          <div
                            className="text-xs  font-normal text-neutral-500"
                            data-testid="member-department"
                          >
                            {data?.department.name?.substring(0, 22)}
                          </div>
                        </div>
                      )}

                      {data?.isPresent && (
                        <div className="text-xs font-semibold text-neutral-500">
                          Already a member
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          onSubmit={() => {}}
          disableKey="isPresent"
          title="Add  members @DummyChannel"
          submitButtonText="Enroll members"
          onCancel={closeAddMemberModal}
          cancelButtonText="Cancel"
        />
      )}
    </div>
  );
};

export default ManageAccess;
