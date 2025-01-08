import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import SearchResults from './SearchResults';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import { ISearchResultGroup, ISearchResultType } from 'interfaces/search';

export interface IGlobalSearchProps {
  onClose?: () => void;
}

const SearchInput: FC<IGlobalSearchProps> = ({ onClose }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });

  const { control, watch } = useForm<{ globalSearch: string }>({
    defaultValues: { globalSearch: '' },
  });

  const globalSearch = watch('globalSearch');
  const debouncedSearchQuery = useDebounce(globalSearch, 200);

  const getSearchResults = getApi(ApiEnum.GetSearchResults);
  const getRecentSearchResults = getApi(ApiEnum.GetRecentSearchResults);
  const { data: searchResultsData, isFetching: isSearchResultsFetching } =
    getSearchResults({
      q: debouncedSearchQuery,
      limit: 5,
    });
  const {
    data: recentSearchResultsData,
    isFetching: isRecentSearchResultsFetching,
  } = getRecentSearchResults({
    q: debouncedSearchQuery,
    limit: 5,
  });

  const isLoading = isSearchResultsFetching || isRecentSearchResultsFetching;

  const searchResults: ISearchResultGroup[] = [
    {
      module: ISearchResultType.KEYWORD,
      name: '',
      results: recentSearchResultsData?.result?.data || [],
    },
    ...(searchResultsData?.result?.data || []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => setSelectedIndex(-1), [globalSearch]);

  const fields = [
    {
      type: FieldType.Input,
      control,
      name: 'globalSearch',
      dataTestId: 'global-search',
      className: 'w-full',
      placeholder: t('searchPlaceholder'),
      inputClassName: 'border-none !p-0 rounded-none text-sm font-medium',
      autofocus: true,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      clearClassName: '!p-0 !right-0',
    },
  ];

  const handleKeyDown = (e: any) => {
    let totalItems = 0;
    searchResults.forEach(
      (eachEntity: any) => (totalItems += eachEntity.results.length),
    );

    if (e.key === 'ArrowDown') {
      // Move selection down, loop back to the top if at the end
      setSelectedIndex((prevIndex: number) => (prevIndex + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      // Move selection up, loop back to the bottom if at the start
      setSelectedIndex((prevIndex) =>
        prevIndex === 0 ? totalItems - 1 : prevIndex - 1,
      );
    } else if (e.key === 'Enter') {
      document.getElementById(`search-item-${selectedIndex}`)?.click();
    }
  };

  return (
    <div
      className="w-[500px] flex flex-col gap-2 absolute -top-1 right-0 z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center w-full h-12 px-5 py-2 gap-2 bg-white rounded-full border-[1px] border-neutral-200">
        <div className="flex grow">
          <Layout fields={fields} className="w-full" />
        </div>
        {!globalSearch ? <Icon name="search" hover={false} size={16} /> : null}
      </div>
      <div className="w-full bg-white rounded-9xl shadow py-4 max-h-[600px] overflow-y-auto">
        <SearchResults
          searchResults={searchResults}
          searchQuery={debouncedSearchQuery}
          isLoading={isLoading}
          onClose={onClose}
          selectedIndex={selectedIndex}
        />
      </div>
    </div>
  );
};

export default SearchInput;
