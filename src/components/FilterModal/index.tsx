import Button, { Variant as ButtonVariant } from 'components/Button';
import Divider from 'components/Divider';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { IDepartment } from 'queries/department';
import { ILocation } from 'queries/location';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Locations from './Locations';
import Departments from './Departments';
import { IRadioListOption } from 'components/RadioGroup';
import Status from './Status';
import { ICheckboxListOption } from 'components/CheckboxList';
import Categories from './Categories';
import { ICategory } from 'queries/category';

export interface IFilterForm {
  status: IRadioListOption;
  locationCheckbox: ICheckboxListOption[];
  departmentCheckbox: ICheckboxListOption[];
  categoryCheckbox: ICheckboxListOption[];
  locationSearch: string;
  departmentSearch: string;
  categorySearch: string;
}

export interface IStatus {
  value: UserStatus;
  label: string;
  id?: string;
}
export enum UserStatus {
  Invited = 'INVITED',
  Active = 'ACTIVE',
  All = 'ALL',
}

export enum FilterModalVariant {
  Orgchart = 'ORGCHART',
  People = 'PEOPLE',
  Team = 'TEAM',
}

export interface IAppliedFilters {
  location?: ILocation[];
  departments?: IDepartment[];
  status?: IStatus | null;
  categories?: ICategory[];
}

export enum FilterNavigationOption {
  Locations = 'LOCATIONS',
  Departments = 'DEPARTMENTS',
  Categories = 'CATEGORIES',
  Status = 'STATUS',
}

interface IFilterModalProps {
  open: boolean;
  closeModal: () => void;
  appliedFilters: IAppliedFilters;
  onApply: (appliedFilters: IAppliedFilters) => void;
  onClear: () => void;
  variant?: FilterModalVariant;
}

interface IFilters {
  key: string;
  isHidden: boolean;
  label: () => React.ReactNode;
  component: () => React.ReactNode;
}

const FilterModal: React.FC<IFilterModalProps> = ({
  open,
  closeModal,
  appliedFilters = {
    location: [],
    departments: [],
    categories: [],
    status: null,
  },
  onApply,
  onClear,
  variant = FilterModalVariant.People,
}) => {
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<IFilterForm>({
      mode: 'onChange',
      defaultValues: {
        status: appliedFilters.status
          ? {
              data: {
                ...appliedFilters.status,
                id: `userstatus-${appliedFilters.status.label.toLowerCase()}`,
              },
              dataTestId: `userstatus-${appliedFilters.status.label.toLowerCase()}`,
            }
          : {
              data: {
                value: UserStatus.All,
                label: 'All',
                id: 'userstatus-all',
              },
              dataTestId: 'userstatus-all',
            },
        locationCheckbox: (appliedFilters.location || []).map((location) => ({
          data: location,
          dataTestId: `location-${location.name}`,
        })),
        departmentCheckbox: (appliedFilters.departments || []).map(
          (department) => ({
            data: department,
            dataTestId: `department-${department.name}`,
          }),
        ),
        categoryCheckbox: (appliedFilters.categories || []).map((category) => ({
          data: category,
          dataTestId: `category-${category.name}`,
        })),
      },
    });

  const [locationCheckbox, departmentCheckbox, categoryCheckbox] = watch([
    'locationCheckbox',
    'departmentCheckbox',
    'categoryCheckbox',
  ]);

  const onSubmit = (formData: IFilterForm) => {
    onApply({
      location: formData.locationCheckbox.map(
        (location) => location.data,
      ) as ILocation[],
      departments: formData.departmentCheckbox.map(
        (department) => department.data,
      ) as IDepartment[],
      categories: formData.categoryCheckbox.map(
        (category) => category.data,
      ) as ICategory[],
      status: formData.status.data as IStatus,
    } as unknown as IAppliedFilters);
  };

  const filterNavigation = [
    {
      label: () => (
        <div className="flex items-center">
          <div>Location</div>
          {!!locationCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {locationCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'location-filters',
      component: () => (
        <Locations control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [FilterModalVariant.Team, FilterModalVariant.People].includes(
        variant,
      ),
      dataTestId: 'filterby-location',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>Department</div>
          {!!departmentCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {departmentCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'departments-filters',
      component: () => (
        <Departments control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [FilterModalVariant.Team, FilterModalVariant.People].includes(
        variant,
      ),
      dataTestId: 'filterby-department',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>Category</div>
          {!!categoryCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {categoryCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'categories-filters',
      component: () => (
        <Categories control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
      ].includes(variant),
      dataTestId: 'filterby-categories',
    },
    {
      label: () => 'Status',
      key: 'status-filters',
      component: () => <Status control={control} />,
      isHidden: [FilterModalVariant.Team].includes(variant),
      dataTestId: 'filterby-status',
    },
  ].filter((filter) => !filter.isHidden);
  const [activeFilter, setActiveFilter] = useState<IFilters>(
    filterNavigation[0],
  );
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[665px]">
      <Header
        title="Filter By"
        onClose={() => closeModal()}
        closeBtnDataTestId="close-filters"
      />

      <form>
        <div className="flex w-full">
          <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
            <div className="border-b-2 border-b-bg-neutral-200">
              {filterNavigation.map((item, index) => (
                <div
                  key={item.key}
                  onClick={() => setActiveFilter(item)}
                  data-testid={item?.dataTestId}
                >
                  <div
                    className={`text-sm font-medium p-4 hover:cursor-pointer ${
                      item.key === activeFilter.key &&
                      'text-primary-500 bg-primary-50 hover:cursor-default'
                    }`}
                  >
                    {item.label()}
                  </div>
                  {index !== filterNavigation.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3">{activeFilter.component()}</div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Clear Filters"
          variant={ButtonVariant.Secondary}
          onClick={onClear}
          className="mr-4"
          dataTestId="clear-filters"
        />
        <Button
          label="Apply"
          variant={ButtonVariant.Primary}
          onClick={handleSubmit(onSubmit)}
          className="mr-4"
          dataTestId="apply-filter"
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
