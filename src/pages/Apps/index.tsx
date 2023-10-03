import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import { FC, useEffect, useState } from 'react';
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
import {
  useInfiniteApps,
  useInfiniteCategories,
  useInfiniteFeaturedApps,
} from 'queries/apps';
import { useAppStore } from 'stores/appStore';
import { useDebounce } from 'hooks/useDebounce';
import { isFiltersEmpty } from 'utils/misc';
import AppList from './components/AppList';
import Icon from 'components/Icon';
import AppBannerSkeleton from './components/Skeletons/AppBannerSkeleton';
import useRole from 'hooks/useRole';
import Skeleton from 'react-loading-skeleton';
import Sort from 'components/Sort';
import useURLParams from 'hooks/useURLParams';
import FilterModal, { FilterModalVariant } from 'components/FilterModal';

interface IAppsProps {}
interface IAppSearchForm {
  search?: string;
}

enum AppGroup {
  MY_APPS = 'myApps',
  ALL_APPS = 'allApps',
  FEATURED = 'featured',
}

const Apps: FC<IAppsProps> = () => {
  const {
    searchParams,
    updateParam,
    deleteParam,
    serializeFilter,
    parseParams,
  } = useURLParams();
  // Form for searching apps
  const {
    control,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<IAppSearchForm>({
    mode: 'onChange',
    defaultValues: {
      search: searchParams.get('search'),
    },
  });

  const { apps, featuredApps } = useAppStore();
  const { isAdmin } = useRole();
  // State to store apps group
  const [selectedAppGroup, setSelectedAppGroup] = useState<AppGroup>(
    searchParams.get('tab') || AppGroup.ALL_APPS,
  );

  // Add apps modal
  const [open, openModal, closeModal] = useModal(false, false);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [appFilters, setAppFilters] = useState<any>({
    categories: [],
    teams: [],
  });
  const [appsCount, setAppsCount] = useState<any>();
  const [featuredAppsCount, setFeaturedAppsCount] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFeauturedAppLoading, setIsFeaturedAppLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [startFetching, setStartFetching] = useState(false);

  const selectedButtonClassName = '!bg-primary-50 text-primary-500 text-sm';
  const regularButtonClassName = '!text-neutral-500 text-sm';

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const isQuickCategorySelected = ![
    AppGroup.ALL_APPS,
    AppGroup.MY_APPS,
    AppGroup.FEATURED,
  ].includes(selectedAppGroup);
  const isAllAppsGroupSelected = [AppGroup.ALL_APPS, AppGroup.MY_APPS].includes(
    selectedAppGroup,
  );

  const { data: categories } = useInfiniteCategories(
    isFiltersEmpty({
      limit: 3,
    }),
  );

  const flattenCategories = categories?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((category: any) => {
      try {
        return category;
      } catch (e) {
        console.log('Error', { category });
      }
    });
  });

  const handleRemoveFilters = (key: any, id: any) => {
    const updatedFilter = {
      ...appFilters,
      [key]: appFilters[key].filter((item: any) => item.id !== id),
    };
    if (updatedFilter[key].length === 0) {
      deleteParam(key);
    } else {
      const serializedFilters = serializeFilter(updatedFilter[key]);
      updateParam(key, serializedFilters);
    }
    setAppFilters(updatedFilter);
  };

  const clearFilters = () => {
    setAppFilters({
      categories: [],
      teams: [],
    });
    deleteParam('categories');
    deleteParam('teams');
  };

  const onApplyFilter = (filters: any) => {
    setAppFilters(filters);
    if (filters.categories.length > 0) {
      const serializedCategories = serializeFilter(
        filters.categories.map((category: any) => ({
          id: category.id,
          name: category.name,
        })),
      );
      updateParam('categories', serializedCategories);
    }
    if (filters.teams.length > 0) {
      const serializedTeams = serializeFilter(
        filters.teams.map((team: any) => ({
          id: team.id,
          name: team.name,
        })),
      );
      updateParam('teams', serializedTeams);
    }
    if (filters.categories.length > 0) {
      setSelectedAppGroup(AppGroup.ALL_APPS);
      deleteParam('tab');
    }
    closeFilterModal();
  };

  const handleSetSortFilter = (sortValue: any) => {
    setSortByFilter(sortValue);
  };

  const handleTabChange = (tab: AppGroup) => {
    setSelectedAppGroup(tab);
    updateParam('tab', tab);
  };

  const handleQuickCategorySelect = (category: any) => {
    setSelectedAppGroup(category.id);
    updateParam('tab', category.id);
    setAppFilters((prevFilters: any) => ({
      ...prevFilters,
      categories: [],
    }));
  };

  // parse the persisted filters from the URL on page load
  useEffect(() => {
    const parsedCategories = parseParams('categories');
    const parsedTeams = parseParams('teams');
    const parsedSort = parseParams('sort');
    setAppFilters({
      ...appFilters,
      ...(parsedCategories && { categories: parsedCategories }),
      ...(parsedTeams && { teams: parsedTeams }),
    });
    if (parsedSort) {
      setSortByFilter(parsedSort);
    }
    setStartFetching(true);
  }, []);

  // Change URL params for search filters
  useEffect(() => {
    if (debouncedSearchValue) {
      updateParam('search', debouncedSearchValue);
    } else {
      deleteParam('search');
    }
  }, [debouncedSearchValue]);

  return (
    <div>
      <Card className="p-8">
        <div className="flex justify-between">
          <p className="font-bold text-2xl text-black">App Launcher</p>
          {isAdmin && (
            <Button
              onClick={openModal}
              label="Add apps"
              leftIcon="add"
              leftIconClassName="!text-white"
              className="flex space-x-1"
              leftIconSize={20}
              dataTestId="app-add-app-cta"
            />
          )}
        </div>
        {/* Banner */}
        <img
          src={AppsBanner}
          alt="Apps Banner"
          className={`w-full py-6 ${imageLoading ? 'hidden' : ''}`}
          onLoad={() => setImageLoading(false)}
        />
        {imageLoading && <AppBannerSkeleton />}
        {/* App groups and sort/filter/search */}
        <div className="flex justify-between pb-6">
          <div className="flex items-center gap-x-4">
            {isAdmin && (
              <Button
                variant={ButtonVariant.Secondary}
                label="My apps"
                dataTestId="my-apps"
                className={`${
                  selectedAppGroup === AppGroup.MY_APPS
                    ? selectedButtonClassName
                    : regularButtonClassName
                }`}
                onClick={() => handleTabChange(AppGroup.MY_APPS)}
              />
            )}
            <Button
              variant={ButtonVariant.Secondary}
              label="All apps"
              className={
                selectedAppGroup === AppGroup.ALL_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              dataTestId="all-apps"
              onClick={() => handleTabChange(AppGroup.ALL_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label="Featured"
              dataTestId="featured-apps"
              className={
                selectedAppGroup === AppGroup.FEATURED
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => handleTabChange(AppGroup.FEATURED)}
            />
            {flattenCategories &&
              flattenCategories.length > 0 &&
              flattenCategories.map((category) => (
                <div key={category.id}>
                  <Button
                    variant={ButtonVariant.Secondary}
                    label={category.name}
                    className={
                      selectedAppGroup === category.id
                        ? selectedButtonClassName
                        : regularButtonClassName
                    }
                    onClick={() => handleQuickCategorySelect(category)}
                  />
                </div>
              ))}
          </div>
          <div className="flex space-x-2 justify-center items-center relative">
            <IconButton
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px]"
              onClick={openFilterModal}
              dataTestId="app-filters"
            />
            <Sort
              setFilter={handleSetSortFilter}
              filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
              selectedValue={sortByFilter}
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              dataTestId="teams-sort"
              entity="apps-filters"
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
                  placeholder: 'Search apps',
                  error: errors.search?.message,
                  dataTestId: 'app-searchbar',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {!isLoading ? (
            <div className="text-neutral-500">
              Showing {!isLoading && appsCount} results
            </div>
          ) : (
            <Skeleton
              className="!w-32"
              containerClassName="flex-1"
              borderRadius={100}
            />
          )}

          {/* Filters pills */}
          {(appFilters.categories.length > 0 ||
            appFilters.teams.length > 0) && (
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <div className="text-base text-neutral-500 whitespace-nowrap">
                  Filter By
                </div>
                {appFilters.categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1"
                    data-testid={`applied-filterby-category`}
                  >
                    <div className="mr-1 text-neutral-500 whitespace-nowrap">
                      Category{' '}
                      <span className="text-primary-500">{category.name}</span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      onClick={() =>
                        handleRemoveFilters('categories', category.id)
                      }
                      dataTestId={`applied-filter-close`}
                    />
                  </div>
                ))}
                {appFilters.teams.map((team: any) => (
                  <div
                    key={team.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1"
                    data-testid={`people-filterby`}
                  >
                    <div className="mr-1 text-neutral-500">
                      Team <span className="text-primary-500">{team.name}</span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      onClick={() => handleRemoveFilters('teams', team.id)}
                      dataTestId={`people-filterby-close`}
                    />
                  </div>
                ))}
              </div>
              <div
                className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
                onClick={clearFilters}
                data-testid="teams-clear-filters"
              >
                Clear Filters
              </div>
            </div>
          )}

          {isAllAppsGroupSelected && (
            <div>
              {featuredAppsCount > 0 && !isFeauturedAppLoading && (
                <div className="flex justify-between mb-6">
                  <div className="text-xl font-bold">Featured</div>
                  <div
                    className="text-base font-semibold text-primary-500 cursor-pointer"
                    onClick={() => handleTabChange(AppGroup.FEATURED)}
                  >
                    View all featured
                  </div>
                </div>
              )}
              <AppList
                fetchQuery={useInfiniteFeaturedApps}
                apps={featuredApps}
                queryParams={{
                  limit: 5,
                  featured: true,
                  q: debouncedSearchValue,
                  sort: sortByFilter,
                  teamId:
                    appFilters.teams.length > 0
                      ? appFilters.teams.map((team: any) => team.id).join(',')
                      : undefined,
                  categoryId:
                    appFilters.categories.length > 0
                      ? appFilters.categories
                          .map((category: any) => category.id)
                          .join(',')
                      : undefined,
                }}
                isInfinite={false}
                showEmptyState={false}
                setAppsCount={setFeaturedAppsCount}
                setAppsLoading={setIsFeaturedAppLoading}
                startFetching={startFetching}
                myApp={selectedAppGroup === AppGroup.MY_APPS || !isAdmin}
              />
              {featuredAppsCount > 0 && !isFeauturedAppLoading && (
                <div className="text-xl font-bold mt-6">All Apps</div>
              )}
            </div>
          )}
          <AppList
            fetchQuery={useInfiniteApps}
            apps={apps}
            queryParams={{
              q: debouncedSearchValue,
              sort: sortByFilter,
              teamId:
                appFilters.teams.length > 0
                  ? appFilters.teams.map((team: any) => team.id).join(',')
                  : undefined,
              ...(isQuickCategorySelected
                ? {
                    categoryId: isQuickCategorySelected
                      ? selectedAppGroup
                      : undefined,
                  }
                : selectedAppGroup === AppGroup.FEATURED
                ? {
                    featured: true,
                  }
                : {
                    categoryId:
                      appFilters.categories.length > 0
                        ? appFilters.categories
                            .map((category: any) => category.id)
                            .join(',')
                        : undefined,
                  }),
            }}
            setTotalAppsCount={setAppsCount}
            setAppsLoading={setIsLoading}
            openAddAppModal={openModal}
            resetField={resetField}
            startFetching={startFetching}
            myApp={selectedAppGroup === AppGroup.MY_APPS || !isAdmin}
          />
        </div>
      </Card>
      <AddApp open={open} closeModal={closeModal} />
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appFilters}
          variant={FilterModalVariant.App}
          onApply={onApplyFilter}
          onClear={() => {
            clearFilters();
            closeFilterModal();
          }}
        />
      )}
    </div>
  );
};

export default Apps;
