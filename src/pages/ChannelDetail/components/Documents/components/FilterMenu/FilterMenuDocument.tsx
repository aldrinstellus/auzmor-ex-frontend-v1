import FilterModal, { FilterModalVariant } from 'components/FilterModal';
import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
// import Sort from 'components/Sort';
import useModal from 'hooks/useModal';
import { FC, ReactNode, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useURLParams from 'hooks/useURLParams';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import NoDataFound from 'components/NoDataFound';
import DocSearchRow from 'pages/ChannelDetail/components/Documents/components/DocSearchRow';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
}

interface IFilterMenu {
  children: ReactNode;
  filterForm: UseFormReturn<
    {
      search: string;
      [key: string]: any;
    },
    any
  >;
  searchPlaceholder?: string;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  dataTestIdSearch?: string;
}

const FilterMenuDocument: FC<IFilterMenu> = ({
  children,
  filterForm,
  // dataTestIdSort,
  dataTestIdFilter,
}) => {
  const { getApi } = usePermissions();
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters } = useAppliedFiltersForDoc();
  const { control } = filterForm;
  const [documentSearch, setDocument] = useState('');
  const debouncedDocumentSearch = useDebounce(documentSearch || '', 300);
  const searchStorage = getApi(ApiEnum.SearchStorage);
  const { data: documentData, isFetching } = searchStorage({
    q: debouncedDocumentSearch,
    mimeType: '',
    ownerEmail: '',
    modifiedBefor: '',
    modifiedAfter: '',
    limit: 4,
  });
  const documents = documentData?.data?.result?.data || [];
  const { updateParam, serializeFilter, deleteParam } = useURLParams();

  useEffect(() => {
    if (filters) {
      Object.keys(filters).forEach((key: string) => {
        if (!!filters[key] && filters[key].length === 0) {
          deleteParam(key);
        } else {
          if (typeof filters[key] === 'object') {
            const serializedFilters = serializeFilter(filters[key]);
            updateParam(key, serializedFilters);
          } else {
            updateParam(key, filters[key]);
          }
        }
      });
    }
  }, [filters]);

  // const handleRemoveFilters = (key: FilterKey, id: any) => {
  //   if (filters) {
  //     const updatedFilter = filters[key]!.filter((item: any) => item.id !== id);
  //     const serializedFilters = serializeFilter(updatedFilter);
  //     if (updatedFilter.length === 0) {
  //       deleteParam(key);
  //     } else {
  //       updateParam(key, serializedFilters);
  //     }
  //     setFilters({ ...filters, [key]: updatedFilter });
  //   }
  // };

  // const clearFilters = () => {
  //   deleteParam('documentTypeCheckbox');
  //   deleteParam('documentPeopleCheckbox');
  //   deleteParam('documentModifiedCheckbox');
  //   setFilters({
  //     ...filters,
  //     documentTypeCheckbox: [],
  //     documentPeopleCheckbox: [],
  //     documentModifiedCheckbox: [],
  //   });
  // };

  const memberSearchfields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'documentSearch',
      dataTestId: 'docs-search',
      className: `mr-2 min-w-[245px] block`,
      selectClassName: 'docs-select',
      placeholder: 'Search documents',
      placement: 'bottomRight',
      suffixIcon: <></>,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      isLoading: isFetching,
      options: documents?.map(
        (doc: any) =>
          ({
            value: doc.name,
            label: doc.name,
            raw: doc,
          } as any),
      ),
      onEnter: () => {
        if (documentSearch) {
          updateParam(`search`, documentSearch);
        }
      },
      disableFilterOption: true,
      onSearch: (searchString: string) => {
        setDocument(searchString);
      },
      optionRenderer: (documents: any) => {
        return <DocSearchRow data={documents} />;
      },
      onClear: () => {},
      noOptionsMessage: (
        <NoDataFound
          className="py-4 w-full"
          illustration="noDocumentFound"
          labelHeader={
            <p>We&apos;re a little lost. Can you give us a hint? </p>
          }
          hideClearBtn
          dataTestId="membersearch"
        />
      ),
      // dataTestId: 'member-search',
    },
  ];

  const isFilterApplied =
    !!filters?.docTypeCheckbox?.length ||
    !!filters?.docPeopleCheckbox?.length ||
    !!filters?.docModifiedRadio;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>{children}</div>
          <div className="flex space-x-2 justify-center items-center relative">
            <div className="relative flex">
              <IconButton
                onClick={openFilterModal}
                icon="filterLinear"
                variant={IconVariant.Secondary}
                size={IconSize.Medium}
                borderAround
                className="bg-white !p-[10px]"
                dataTestId={dataTestIdFilter}
              />
              {isFilterApplied && (
                <div className="absolute w-2 h-2 rounded-full bg-red-500 top-0.5 right-0" />
              )}
            </div>
            {/* <Sort
              setFilter={(sortValue) => {
                setFilters({ sort: sortValue });
              }}
              filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
              selectedValue={filters ? filters.sort : ''}
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              entity={'CHANNEL'}
              dataTestId={dataTestIdSort}
            /> */}
            <div>
              <Layout fields={memberSearchfields} />
            </div>
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={{
            docTypeCheckbox: filters?.docTypeCheckbox || [],
            docPeopleCheckbox: filters?.docPeopleCheckbox || [],
            docModifiedRadio: filters?.docModifiedRadio || [],
          }}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
            closeFilterModal();
          }}
          onClear={() => {
            setFilters({
              docPeopleCheckbox: [],
              docTypeCheckbox: [],
              docModifiedRadio: [],
            });
            closeFilterModal();
          }}
          variant={FilterModalVariant.Document}
        />
      )}
    </>
  );
};

export default FilterMenuDocument;
