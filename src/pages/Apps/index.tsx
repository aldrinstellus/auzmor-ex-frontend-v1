import Button, { Variant as ButtonVariant, Variant } from 'components/Button';
import Card from 'components/Card';
import React, { useEffect, useState } from 'react';
import AppsBanner from 'images/appsBanner.png';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import useModal from 'hooks/useModal';
import AddApp from './components/AddApp';
import AppGrid from './components/AppGrid';
import { uniqueId } from 'lodash';
import { useInfiniteApps } from 'queries/apps';
import { useAppStore } from 'stores/appStore';
import AppCardSkeleton from './components/Skeletons/AppCardSkeleton';
import PopupMenu from 'components/PopupMenu';
import { useDebounce } from 'hooks/useDebounce';
import { isFiltersEmpty } from 'utils/misc';
import AppFilterModal from './components/AppFilterModal';
import TeamNotFound from 'images/TeamNotFound.svg';
import { useInView } from 'react-intersection-observer';
import PageLoader from 'components/PageLoader';

interface IAppsProps {}
interface IAppSearchForm {
  search?: string;
}

enum AppGroup {
  MY_APPS = 'My apps',
  ALL_APPS = 'All apps',
  FEATURED = 'Featured',
  COMMUNICATION = 'Communication',
  CUSTOMER_SUPPORT = 'Customer support',
  RESOURCES = 'Resources',
}

const Apps: React.FC<IAppsProps> = () => {
  // Form for searching apps
  const {
    control,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<IAppSearchForm>({
    mode: 'onChange',
  });

  const { apps } = useAppStore();
  // State to store apps group
  const [selectedAppGroup, setSelectedAppGroup] = useState<AppGroup>(
    AppGroup.MY_APPS,
  );

  // Add apps modal
  const [open, openModal, closeModal] = useModal(false, false);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [appFilters, setAppFilters] = useState<any>({
    categories: [],
    teams: [],
  });
  const { ref, inView } = useInView();

  const selectedButtonClassName = '!bg-primary-50 text-primary-500 text-sm';
  const regularButtonClassName = '!text-neutral-500 text-sm';

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteApps(
      isFiltersEmpty({
        q: debouncedSearchValue,
        sort: sortByFilter,
      }),
    );

  const appIds = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((apps: any) => {
      try {
        return apps;
      } catch (e) {
        console.log('Error', { apps });
      }
    });
  }) as { id: string }[];

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div>
      <Card className="p-8">
        <div className="flex justify-between">
          <p className="font-bold text-2xl text-black">App Launcher</p>
          <Button
            onClick={openModal}
            label="+ Add apps"
            dataTestId="app-add-app-cta"
          />
        </div>
        {/* Banner */}
        <img src={AppsBanner} className="w-full py-6" />
        {/* App groups and sort/filter/search */}
        <div className="flex justify-between pb-6">
          <div className="flex items-center gap-x-4">
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.MY_APPS}
              dataTestId="my-apps"
              className={
                selectedAppGroup === AppGroup.MY_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.MY_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.ALL_APPS}
              className={
                selectedAppGroup === AppGroup.ALL_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              dataTestId="all-apps"
              onClick={() => setSelectedAppGroup(AppGroup.ALL_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.FEATURED}
              dataTestId="featured-apps"
              className={
                selectedAppGroup === AppGroup.FEATURED
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.FEATURED)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.COMMUNICATION}
              className={
                selectedAppGroup === AppGroup.COMMUNICATION
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.COMMUNICATION)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.CUSTOMER_SUPPORT}
              className={
                selectedAppGroup === AppGroup.CUSTOMER_SUPPORT
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.CUSTOMER_SUPPORT)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.RESOURCES}
              className={
                selectedAppGroup === AppGroup.RESOURCES
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.RESOURCES)}
            />
          </div>
          <div className="flex space-x-2 justify-center items-center relative">
            <IconButton
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white"
              onClick={openFilterModal}
              dataTestId="app-filters"
            />
            <PopupMenu
              triggerNode={
                <IconButton
                  icon="arrowSwap"
                  variant={IconVariant.Secondary}
                  size={IconSize.Medium}
                  borderAround
                  className="bg-white"
                  dataTestId="apps-sort"
                />
              }
              title={
                <div className="bg-blue-50 flex px-6 py-2 font-xs font-medium text-neutral-500">
                  Sort by
                </div>
              }
              menuItems={[
                {
                  icon: 'calendar',
                  label: 'Date added',
                  onClick: () => {
                    setSortByFilter('createdAt:DESC');
                  },
                  dataTestId: 'app-filter-sort-date',
                  permissions: [''],
                },
                {
                  icon: 'sortByAcs',
                  label: 'A to Z',
                  onClick: () => {
                    setSortByFilter('createdAt:ASC');
                  },
                  dataTestId: 'app-filter-sort-ascending',
                  permissions: [''],
                },
                {
                  icon: 'sortByDesc',
                  label: 'Z to A',
                  onClick: () => {
                    setSortByFilter('createdAt:DESC');
                  },
                  dataTestId: 'app-filter-sort-descending',
                  permissions: [''],
                },
              ]}
              className="right-48 w-[157px] top-12"
            />
            <Layout
              fields={[
                {
                  type: FieldType.Input,
                  variant: InputVariant.Text,
                  size: InputSize.Small,
                  leftIcon: 'search',
                  control,
                  getValues,
                  name: 'search',
                  placeholder: 'Search members',
                  error: errors.search?.message,
                  dataTestId: 'app-searchbar',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
        <div className="text-neutral-500 mt-6 mb-6">
          Showing {!isLoading && appIds.length} results
        </div>
        {(() => {
          if (isLoading) {
            return (
              <div className="flex flex-wrap gap-6">
                {[...Array(30)].map((element) => (
                  <div key={element}>
                    <AppCardSkeleton />
                  </div>
                ))}
              </div>
            );
          }

          if (appIds && appIds?.length > 0) {
            return (
              <div className="pt-6">
                <AppGrid
                  apps={appIds
                    ?.filter(({ id }) => !!apps[id])
                    ?.map(({ id }) => apps[id])}
                />
                <div className="h-12 w-12">
                  {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                </div>
                {isFetchingNextPage && <PageLoader />}
              </div>
            );
          }

          return (
            <>
              {(debouncedSearchValue === undefined ||
                debouncedSearchValue === '') &&
              appIds?.length === 0 ? (
                <div className="flex flex-col space-y-3 items-center w-full">
                  <div className="flex flex-col space-y-6 items-center">
                    <img
                      src={TeamNotFound}
                      alt="Apps Not Found"
                      height={140}
                      width={165}
                    />
                    <div
                      className="text-lg font-bold"
                      data-testid="no-app-found"
                    >
                      No Apps found
                    </div>
                  </div>
                  <div className="flex space-x-1 text-xs font-normal">
                    <div className="text-neutral-500">
                      There is no app found in your organization right now. Be
                      the first to
                    </div>
                    <div
                      className="text-blue-500 cursor-pointer"
                      onClick={openModal}
                      data-testid="create-app"
                    >
                      create one
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 w-full">
                  <div className="flex w-full justify-center">
                    <img src={require('images/noResult.png')} />
                  </div>
                  <div className="text-center">
                    <div
                      className="mt-8 text-lg font-bold"
                      data-testid="apps-noresult-found"
                    >
                      No result found for &apos;{searchValue}&apos;
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Sorry we can&apos;t find the app you are looking for.
                      <br /> Please try using different filters.
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button
                      label={'Clear search'}
                      variant={Variant.Secondary}
                      onClick={() => {
                        resetField('search', { defaultValue: '' });
                      }}
                      dataTestId="apps-clear-applied-filter"
                    />
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </Card>
      <AddApp open={open} closeModal={closeModal} />
      {showFilterModal && (
        <AppFilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          setFilters={setAppFilters}
        />
      )}
    </div>
  );
};

export default Apps;
