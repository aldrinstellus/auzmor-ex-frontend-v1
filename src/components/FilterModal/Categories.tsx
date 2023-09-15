import React, { useEffect } from 'react';
import { IFilterForm } from '.';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import Layout, { FieldType } from 'components/Form';
import { useDebounce } from 'hooks/useDebounce';
import { ICategory, useInfiniteCategories } from 'queries/category';
import { ICheckboxListOption } from 'components/CheckboxList';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';

interface ICategoriesProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Categories: React.FC<ICategoriesProps> = ({
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
      name: 'categorySearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `category-search`,
    },
  ];

  const [categorySearch, categoryCheckbox] = watch([
    'categorySearch',
    'categoryCheckbox',
  ]);

  // fetch category from search input
  const debouncedDepartmentSearchValue = useDebounce(categorySearch || '', 300);
  const {
    data: fetchedDepartments,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteCategories({
    q: debouncedDepartmentSearchValue,
  });
  const categoryData = fetchedDepartments?.pages.flatMap((page) => {
    return page.data.result.data.map((category: ICategory) => category);
  });

  const categoryFields = [
    {
      type: FieldType.CheckboxList,
      name: 'categoryCheckbox',
      control,
      options: categoryData?.map((category: ICategory) => ({
        data: category,
        datatestId: `category-${category.name}`,
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
        {!!categoryCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {categoryCheckbox.map((location: ICheckboxListOption) => (
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
                        'categoryCheckbox',
                        categoryCheckbox.filter(
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
            <Layout fields={categoryFields} />
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

export default Categories;
