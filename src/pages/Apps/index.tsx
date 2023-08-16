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
import {
  useInfiniteApps,
  useInfiniteCategories,
  useInfiniteFeaturedApps,
} from 'queries/apps';
import { useAppStore } from 'stores/appStore';
import PopupMenu from 'components/PopupMenu';
import { useDebounce } from 'hooks/useDebounce';
import { isFiltersEmpty } from 'utils/misc';
import AppFilterModal from './components/AppFilterModal';
import AppList from './components/AppList';

interface IAppsProps {}
interface IAppSearchForm {
  search?: string;
}

enum AppGroup {
  MY_APPS = 'My apps',
  ALL_APPS = 'All apps',
  FEATURED = 'Featured',
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

  const { apps, featuredApps } = useAppStore();
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

  const selectedButtonClassName = '!bg-primary-50 text-primary-500 text-sm';
  const regularButtonClassName = '!text-neutral-500 text-sm';

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const isQuickCategorySelected = ![
    AppGroup.ALL_APPS,
    AppGroup.MY_APPS,
    AppGroup.FEATURED,
  ].includes(selectedAppGroup);
  const isAllAppsGroupSelected = selectedAppGroup === AppGroup.ALL_APPS;

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
                    onClick={() => setSelectedAppGroup(category.id)}
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
        <>
          {isAllAppsGroupSelected && (
            <div>
              <div className="flex justify-between mt-6 mb-6">
                <div className="text-xl font-bold">Featured</div>
                <div
                  className="text-base font-semibold text-neutral-500 cursor-pointer"
                  onClick={() => setSelectedAppGroup(AppGroup.FEATURED)}
                >
                  View all featured
                </div>
              </div>
              <AppList
                fetchQuery={useInfiniteFeaturedApps}
                apps={featuredApps}
                queryParams={{
                  limit: 5,
                }}
                showCount={false}
                isInfinite={false}
                showEmptyState={false}
              />
              <div className="text-xl font-bold">All Apps</div>
            </div>
          )}
          <AppList
            fetchQuery={useInfiniteApps}
            apps={apps}
            queryParams={{
              q: debouncedSearchValue,
              sort: sortByFilter,
              ...(isQuickCategorySelected
                ? {
                    'categoryId[0]': isQuickCategorySelected
                      ? selectedAppGroup
                      : undefined,
                  }
                : selectedAppGroup === AppGroup.FEATURED
                ? {
                    featured: true,
                  }
                : {}),
            }}
            openAddAppModal={openModal}
            resetField={resetField}
          />
        </>
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
