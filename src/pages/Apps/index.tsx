import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import { FC, useEffect, useState } from 'react';
// import AppsBanner from 'images/appsBanner.png';
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
// import AppBannerSkeleton from './components/Skeletons/AppBannerSkeleton';
import useRole from 'hooks/useRole';
import Skeleton from 'react-loading-skeleton';
import Sort from 'components/Sort';
import useURLParams from 'hooks/useURLParams';
import FilterModal, {
  FilterModalVariant,
  IChannelFilter,
} from 'components/FilterModal';
import { ICategory } from 'queries/category';
import { ITeam } from 'queries/teams';
import useProduct from 'hooks/useProduct';
import { useInfiniteLearnCategory } from 'queries/learn';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from 'hooks/usePageTitle';
import { isTrim } from 'pages/ChannelDetail/components/utils';
import { useLocation } from 'react-router-dom';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';

interface IAppsProps {}
interface IAppSearchForm {
  search?: string;
}

interface IAppFilters {
  categories: ICategory[];
  teams: ITeam[];
  featured?: boolean;
  myApp?: boolean;
  channels: IChannelFilter[];
}

enum AppFilterKey {
  categories = 'categories',
  teams = 'teams',
  channels = 'channels',
}

enum AppGroup {
  MY_APPS = 'myApps',
  ALL_APPS = 'allApps',
  FEATURED = 'featured',
}

const defaultAppFilters: IAppFilters = {
  categories: [],
  teams: [],
  channels: [],
};

const Apps: FC<IAppsProps> = () => {
  usePageTitle('apps');
  const { t } = useTranslation('appLauncher');
  const {
    searchParams,
    updateParam,
    deleteParam,
    serializeFilter,
    parseParams,
    removeSensitiveData,
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
      search: searchParams.get('search') || '',
    },
  });
  const { isLxp } = useProduct();
  const { user } = useAuth();
  const { apps, featuredApps } = useAppStore();
  const { isAdmin } = useRole();
  const [selectedQuickCategory, setSelectedQuickCategory] =
    useState<string>('');
  const { pathname } = useLocation();

  // Redirect Non Admins to /user/apps for LMS
  if (
    isLxp &&
    user?.organization.type === 'LMS' &&
    pathname === '/apps' &&
    !isAdmin
  ) {
    window.location.assign('/user/apps');
    return (
      <div className="w-full h-screen">
        <PageLoader />
      </div>
    );
  }

  // Add apps modal
  const [open, openModal, closeModal] = useModal(false, false);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [appFilters, setAppFilters] = useState<IAppFilters>({
    ...defaultAppFilters,
  });
  const [appsCount, setAppsCount] = useState<any>();
  const [featuredAppsCount, setFeaturedAppsCount] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFeauturedAppLoading, setIsFeaturedAppLoading] = useState(false);
  // const [imageLoading, setImageLoading] = useState(true);
  const [startFetching, setStartFetching] = useState(false);

  const selectedButtonClassName = '!bg-primary-50 text-primary-500 text-sm';
  const regularButtonClassName =
    '!text-neutral-500 text-sm hover:border hover:border-primary-500 focus:border focus:border-primary-500';

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data: categories } = isLxp
    ? useInfiniteLearnCategory(
        isFiltersEmpty({
          limit: 3,
        }),
      )
    : useInfiniteCategories(
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

  const handleRemoveFilters = (key: AppFilterKey, id: string) => {
    const updatedFilter = {
      ...appFilters,
      [key]: appFilters[key].filter(
        (item: ICategory | ITeam) => item.id !== id,
      ),
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
      ...appFilters,
      categories: [],
      teams: [],
      channels: [],
    });
    deleteParam('categories');
    deleteParam('teams');
    deleteParam('channels');
  };

  const onChangeFilters = (filters: IAppFilters) => {
    setAppFilters(filters);
    if (filters.categories.length > 0) {
      const serializedCategories = serializeFilter(
        filters.categories.map((category: ICategory) => ({
          id: category.id,
          name: category.name,
        })),
      );
      updateParam('categories', serializedCategories);
    } else deleteParam('categories');
    if (filters.teams.length > 0) {
      const serializedTeams = serializeFilter(
        filters.teams.map((team: ITeam) => ({
          id: team.id,
          name: team.name,
        })),
      );
      updateParam('teams', serializedTeams);
    } else deleteParam('teams');
    if (filters.channels.length > 0) {
      const serializedTeams = serializeFilter(
        filters.channels.map((channel: any) => ({
          id: channel.id,
          name: channel.name,
        })),
      );
      updateParam('channels', serializedTeams);
    } else deleteParam('channels');
    if (filters.myApp) updateParam('myApp', 'true');
    else deleteParam('myApp');
    if (filters.featured) updateParam('featured', 'true');
    else deleteParam('featured');
  };

  const handleSetSortFilter = (sortValue: any) => {
    setSortByFilter(sortValue);
  };

  const handleTabChange = (tab: AppGroup) => {
    const filters = {
      categories: appFilters.categories,
      teams: appFilters.teams,
      channels: appFilters.channels,
    };
    if (selectedQuickCategory) {
      setSelectedQuickCategory('');
      filters.categories = filters.categories.filter(
        (category) => category.id !== selectedQuickCategory,
      );
    }
    if (tab === AppGroup.ALL_APPS) onChangeFilters(filters);
    if (tab === AppGroup.MY_APPS) onChangeFilters({ ...filters, myApp: true });
    if (tab === AppGroup.FEATURED)
      onChangeFilters({ ...filters, featured: true });
  };

  const handleQuickCategorySelect = (category: ICategory) => {
    setSelectedQuickCategory(category.id);
    onChangeFilters({
      ...defaultAppFilters,
      teams: appFilters.teams,
      categories: [category],
    });
  };

  // parse the persisted filters from the URL on page load
  useEffect(() => {
    const parsedFeatured = parseParams('featured');
    const parsedMyApp = parseParams('myApp');
    const parsedCategories = parseParams('categories');
    const parsedChannels = parseParams('channels');
    const parsedTeams = parseParams('teams');
    const parsedSort = parseParams('sort');
    setAppFilters((prevFilters: IAppFilters) => ({
      ...prevFilters,
      ...(parsedFeatured && { featured: !!parsedFeatured }),
      ...(parsedMyApp && { myApp: !!parsedMyApp }),
      ...(parsedCategories && { categories: parsedCategories }),
      ...(parsedTeams && { teams: parsedTeams }),
      ...(parsedChannels && { channels: parsedChannels }),
    }));
    if (parsedSort) {
      setSortByFilter(parsedSort);
    }
    setStartFetching(true);
    removeSensitiveData();
  }, []);

  // Change URL params for search filters
  useEffect(() => {
    if (debouncedSearchValue) {
      updateParam('search', debouncedSearchValue);
    } else {
      deleteParam('search');
    }
  }, [debouncedSearchValue]);

  let selectedTab: AppGroup | string = AppGroup.ALL_APPS;
  if (appFilters.featured) selectedTab = AppGroup.FEATURED;
  else if (appFilters.myApp) selectedTab = AppGroup.MY_APPS;
  else if (
    selectedQuickCategory &&
    appFilters.categories.some(
      (category) => category.id === selectedQuickCategory,
    ) &&
    flattenCategories?.some((category) => category.id === selectedQuickCategory)
  )
    selectedTab = selectedQuickCategory;

  const categoryFilterPills = appFilters.categories.filter(
    (category) => category.id !== selectedTab,
  );

  return (
    <div>
      <Card className="p-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl text-black" tabIndex={0}>
            {t('title')}
          </h1>
          {isAdmin && (
            <Button
              onClick={openModal}
              label={t('add-app-CTA')}
              leftIcon="add"
              leftIconClassName="!text-white"
              className="flex space-x-1"
              leftIconSize={20}
              dataTestId="app-add-app-cta"
            />
          )}
        </div>
        <div className="flex justify-between py-4">
          <div className="flex items-center gap-x-4">
            {isAdmin && (
              <Button
                variant={ButtonVariant.Secondary}
                label={t('my-apps')}
                dataTestId="my-apps"
                className={`${
                  selectedTab === AppGroup.MY_APPS
                    ? selectedButtonClassName
                    : regularButtonClassName
                }`}
                onClick={() => handleTabChange(AppGroup.MY_APPS)}
              />
            )}
            <Button
              variant={ButtonVariant.Secondary}
              label={t('all-apps')}
              className={
                selectedTab === AppGroup.ALL_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              dataTestId="all-apps"
              onClick={() => handleTabChange(AppGroup.ALL_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={t('featured')}
              dataTestId="featured-apps"
              className={
                selectedTab === AppGroup.FEATURED
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
                    label={isTrim(category.name)}
                    className={`capitalize ${
                      selectedTab === category.id
                        ? selectedButtonClassName
                        : regularButtonClassName
                    }`}
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
              controlled
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
        <div className="flex flex-col gap-4">
          {!isLoading ? (
            <div className="text-neutral-500">
              {t('show-results', { count: !isLoading && appsCount })}
            </div> // used for dynamic copy
          ) : (
            <Skeleton
              className="!w-32"
              containerClassName="flex-1"
              borderRadius={100}
            />
          )}

          {/* Filters pills */}
          {(categoryFilterPills.length > 0 ||
            appFilters.teams.length > 0 ||
            appFilters.channels.length > 0) && (
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <div className="text-base text-neutral-500 whitespace-nowrap">
                  {t('filter-by')}
                </div>
                {categoryFilterPills.map((category: any) => (
                  <div
                    key={category.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:shadow-lg focus:shadow-lg group cursor-pointer outline-none"
                    data-testid={`apps-filterby-category`}
                    onClick={() =>
                      handleRemoveFilters(AppFilterKey.categories, category.id)
                    }
                    onKeyUp={(e) =>
                      e.code === 'Enter'
                        ? handleRemoveFilters(
                            AppFilterKey.categories,
                            category.id,
                          )
                        : ''
                    }
                    tabIndex={0}
                  >
                    <div className="mr-1 text-neutral-500 whitespace-nowrap">
                      {t('category')}{' '}
                      <span className="text-primary-500">{category.name}</span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      dataTestId={`applied-filter-close`}
                    />
                  </div>
                ))}
                {appFilters.teams.map((team: any) => (
                  <div
                    key={team.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1  hover:shadow-lg focus:shadow-lg group cursor-pointer outline-none"
                    data-testid={`apps-filterby-team`}
                    onClick={() =>
                      handleRemoveFilters(AppFilterKey.teams, team.id)
                    }
                    onKeyUp={(e) =>
                      e.code === 'Enter'
                        ? handleRemoveFilters(AppFilterKey.teams, team.id)
                        : ''
                    }
                    tabIndex={0}
                  >
                    <div className="mr-1 text-neutral-500">
                      {t('team')}{' '}
                      <span className="text-primary-500">{team.name}</span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      dataTestId={`applied-filter-close`}
                    />
                  </div>
                ))}
                {appFilters.channels.map((channel: any) => (
                  <div
                    key={channel.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1  hover:shadow-lg focus:shadow-lg group cursor-pointer outline-none"
                    data-testid={`apps-filterby-team`}
                    onClick={() =>
                      handleRemoveFilters(AppFilterKey.channels, channel.id)
                    }
                    onKeyUp={(e) =>
                      e.code === 'Enter'
                        ? handleRemoveFilters(AppFilterKey.channels, channel.id)
                        : ''
                    }
                    tabIndex={0}
                  >
                    <div className="mr-1 text-neutral-500">
                      {t('channel')}
                      <span className="text-primary-500"> {channel.name}</span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      dataTestId={`applied-filter-close`}
                    />
                  </div>
                ))}
              </div>
              <div
                className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer focus:text-primary-600 focus:border-primary-600 outline-none"
                data-testid="apps-clear-filters"
                onClick={clearFilters}
                onKeyUp={(e) => (e.code === 'Enter' ? clearFilters() : '')}
                tabIndex={0}
              >
                {t('clear-filters')}
              </div>
            </div>
          )}

          {!appFilters.featured && (
            <div>
              {featuredAppsCount > 0 && !isFeauturedAppLoading && (
                <div className="flex justify-between mb-4">
                  <div className="text-xl font-bold">Featured</div>
                  <div
                    className="text-base font-semibold text-primary-500 cursor-pointer"
                    onClick={() => handleTabChange(AppGroup.FEATURED)}
                    onKeyUp={(e) =>
                      e.code === 'Enter'
                        ? handleTabChange(AppGroup.FEATURED)
                        : ''
                    }
                    role="button"
                    aria-label="view all featured"
                    tabIndex={0}
                  >
                    {t('view-all')}
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
                  channelIds:
                    appFilters.channels.length > 0
                      ? appFilters.channels
                          .map((channels: any) => channels.id)
                          .join(',')
                      : undefined,
                }}
                isInfinite={false}
                showEmptyState={false}
                setAppsCount={setFeaturedAppsCount}
                setAppsLoading={setIsFeaturedAppLoading}
                startFetching={startFetching}
                myApp={appFilters.myApp || !isAdmin}
                appGridTitle="Featured apps"
              />
              {featuredAppsCount > 0 && !isFeauturedAppLoading && (
                <div className="text-xl font-bold mt-4">All Apps</div>
              )}
            </div>
          )}
          <AppList
            fetchQuery={useInfiniteApps}
            apps={apps}
            queryParams={{
              q: debouncedSearchValue,
              sort: sortByFilter,
              ...(appFilters.featured ? { featured: true } : {}),
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
              channelIds:
                appFilters.channels.length > 0
                  ? appFilters.channels
                      .map((channels: any) => channels.id)
                      .join(',')
                  : undefined,
            }}
            setTotalAppsCount={setAppsCount}
            setAppsLoading={setIsLoading}
            openAddAppModal={openModal}
            resetField={resetField}
            startFetching={startFetching}
            myApp={appFilters.myApp || !isAdmin}
            appGridTitle="All apps"
          />
        </div>
      </Card>
      <AddApp open={open} closeModal={closeModal} />
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appFilters}
          variant={isLxp ? FilterModalVariant.LxpApp : FilterModalVariant.App}
          onApply={(filters) => {
            onChangeFilters({ ...appFilters, ...filters });
            closeFilterModal();
          }}
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
