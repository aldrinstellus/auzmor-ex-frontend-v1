import { FC, useEffect } from 'react';
import { IFilterForm } from '.';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import Layout, { FieldType } from 'components/Form';
import { useDebounce } from 'hooks/useDebounce';
import { ICategory, useInfiniteCategories } from 'queries/category';
import { ICheckboxListOption } from 'components/CheckboxList';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';
import ItemSkeleton from './ItemSkeleton';
import { CategoryType } from 'queries/apps';
import NoDataFound from 'components/NoDataFound';
import { useInfiniteLearnCategory } from 'queries/learn';
import useProduct from 'hooks/useProduct';

interface ICategoriesProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
  type: CategoryType;
}

const Categories: FC<ICategoriesProps> = ({
  control,
  watch,
  setValue,
  type,
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
  const { isLxp } = useProduct();
  // fetch category from search input
  const debouncedCategorySearchValue = useDebounce(categorySearch || '', 300);

  // hit learn category api for lxp
  const {
    data: fetchedDCategory,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = isLxp
    ? useInfiniteLearnCategory({
        q: debouncedCategorySearchValue,
      })
    : useInfiniteCategories({
        q: debouncedCategorySearchValue,
        type,
      });

  const categoryData = fetchedDCategory?.pages.flatMap((page) => {
    return page.data?.result?.data?.map((category: ICategory) => category);
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
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!categoryCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {categoryCheckbox.map((category: ICheckboxListOption) => (
              <li
                key={category.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {category.data.name}
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
                          (selectedCategory: ICheckboxListOption) =>
                            selectedCategory.data.id !== category.data.id,
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
          if ((categoryData || []).length > 0) {
            return (
              <div>
                <Layout fields={categoryFields} />
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
              {(debouncedCategorySearchValue === undefined ||
                debouncedCategorySearchValue === '') &&
              categoryData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  <NoDataFound
                    className="py-12 w-full"
                    searchString={''}
                    onClearSearch={() => {}}
                    labelHeader={<p>No Categories found</p>}
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
                </div>
              ) : (
                <div className="flex items-center w-full text-lg font-bold ">
                  <NoDataFound
                    className="py-10 w-full"
                    searchString={debouncedCategorySearchValue}
                    onClearSearch={() => {}}
                    message={
                      <p>
                        Sorry we can&apos;t find the categories you are looking
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

export default Categories;
