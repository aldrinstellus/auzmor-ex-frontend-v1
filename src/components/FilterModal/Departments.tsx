import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IDepartment, useInfiniteDepartments } from 'queries/department';
import { FC, useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';
import ItemSkeleton from './ItemSkeleton';

interface IDepartmentsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Departments: FC<IDepartmentsProps> = ({ control, watch, setValue }) => {
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
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!departmentCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {departmentCheckbox.map((department: ICheckboxListOption) => (
              <div
                key={department.data.id}
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {department.data.name}
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
                          (selectedDepartment: ICheckboxListOption) =>
                            selectedDepartment.data.id !== department.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
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
          if ((departmentData || []).length > 0) {
            return (
              <div>
                <Layout fields={departmentFields} />
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
              {(debouncedDepartmentSearchValue === undefined ||
                debouncedDepartmentSearchValue === '') &&
              departmentData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  No Categories found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedDepartmentSearchValue &&
                    ` for '${debouncedDepartmentSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Departments;
