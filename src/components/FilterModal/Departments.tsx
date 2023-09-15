import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IDepartment, useInfiniteDepartments } from 'queries/department';
import React, { useEffect } from 'react';
import {
  Control,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';

interface IDepartmentsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Departments: React.FC<IDepartmentsProps> = ({
  control,
  watch,
  setValue,
}) => {
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
      name: 'departmentSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `department-search`,
    },
  ];

  const [departmentSearch, departmentCheckbox] = watch([
    'departmentSearch',
    'departmentCheckbox',
  ]);

  // fetch department from search input
  const debouncedDepartmentSearchValue = useDebounce(
    departmentSearch || '',
    300,
  );
  const {
    data: fetchedDepartments,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteDepartments({
    q: debouncedDepartmentSearchValue,
  });
  const departmentData = fetchedDepartments?.pages.flatMap((page) => {
    return page.data.result.data.map((department: IDepartment) => department);
  });

  const departmentFields = [
    {
      type: FieldType.CheckboxList,
      name: 'departmentCheckbox',
      control,
      options: departmentData?.map((department: IDepartment) => ({
        data: department,
        datatestId: `department-${department.name}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-96 overflow-y-auto">
        {!!departmentCheckbox?.length && (
          <div className="flex mt-2 mb-3">
            {departmentCheckbox.map((location: ICheckboxListOption) => (
              <div
                key={location.data.id}
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium">
                  {location.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'departmentCheckbox',
                        departmentCheckbox.filter(
                          (selectedLocation: ICheckboxListOption) =>
                            selectedLocation.data.id !== location.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading ? (
          <div className="w-full flex items-center justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div>
            <Layout fields={departmentFields} />
            {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
            {isFetchingNextPage && (
              <div className="w-full flex items-center justify-center p-8">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
