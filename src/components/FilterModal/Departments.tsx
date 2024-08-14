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
import NoDataFound from 'components/NoDataFound';
import Truncate from 'components/Truncate';

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
        <>
          <Truncate
            text={option.data.name}
            className="ml-2.5 cursor-pointer text-xs max-w-[200px]"
          />
        </>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!departmentCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {departmentCheckbox.map((department: ICheckboxListOption) => (
              <li
                key={department.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <Truncate
                  text={department.data.name}
                  className="text-primary-500 text-sm font-medium whitespace-nowrap max-w-[128px]"
                />
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
              </li>
            ))}
          </ul>
        )}
        {(() => {
          if (isLoading) {
            return (
              <>
                {[...Array(10)].map((_value, i) => (
                  <div
                    key={`${i}-department-item-skeleton`}
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
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={''}
                    onClearSearch={() => {}}
                    labelHeader={<p> No Departments found</p>}
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
                </div>
              ) : (
                <div className="flex items-center w-full text-lg font-bold ">
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={debouncedDepartmentSearchValue}
                    onClearSearch={() => {}}
                    message={
                      <p>
                        Sorry we can&apos;t find the department you are looking
                        for.
                        <br /> Please try using different filters
                      </p>
                    }
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
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
