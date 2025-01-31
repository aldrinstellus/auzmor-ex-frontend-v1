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
import Modal from 'components/Modal';
import { sumBy } from 'lodash';

export interface ISearchModalProps {
  onClose?: () => void;
}

const SearchModal: FC<ISearchModalProps> = ({ onClose }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });

  const { control, watch, setValue, setFocus } = useForm<{
    globalSearch: string;
  }>({
    defaultValues: { globalSearch: '' },
  });

  const globalSearch = watch('globalSearch');
  const debouncedSearchQuery = useDebounce(globalSearch, 200);

  const showRecentSearchResults = debouncedSearchQuery?.length === 0;

  const getSearchResults = getApi(ApiEnum.GetSearchResults);
  const getRecentSearchTerms = getApi(ApiEnum.GetRecentSearchTerms);
  const getRecentClickedResults = getApi(ApiEnum.GetRecentClickedResults);

  const { data: searchResultsData, isLoading: isSearchResultsFetching } =
    getSearchResults(
      {
        q: debouncedSearchQuery,
        limit: 5,
      },
      { enabled: !showRecentSearchResults },
    );

  const { data: documentSearchResultsData } = getSearchResults(
    {
      q: debouncedSearchQuery,
      limit: 5,
      module: 'document',
    },
    { enabled: !showRecentSearchResults },
  );

  const {
    data: recentSearchTermsData,
    isLoading: isRecentSearchTermsFetching,
  } = getRecentSearchTerms(
    {
      limit: 5,
    },
    { enabled: showRecentSearchResults },
  );

  const {
    data: recentClickedResultsData,
    isLoading: isRecentClickedResultsFetching,
  } = getRecentClickedResults(
    {
      limit: 5,
    },
    { enabled: showRecentSearchResults },
  );

  const isLoading = showRecentSearchResults
    ? isRecentClickedResultsFetching || isRecentSearchTermsFetching
    : isSearchResultsFetching;

  const searchResults: ISearchResultGroup[] = showRecentSearchResults
    ? [
        {
          module: ISearchResultType.RECENT,
          name: t('modules.recent'),
          results: recentClickedResultsData?.result?.data || [],
        },
        {
          module: ISearchResultType.KEYWORD,
          name: '',
          results: recentSearchTermsData?.result?.data || [],
        },
      ]
    : [
        ...(searchResultsData?.result?.data || []),
        ...(documentSearchResultsData?.results?.data?.filter(
          (item: ISearchResultGroup) =>
            item.module === ISearchResultType.DOCUMENT,
        ) || []),
      ].map((item: ISearchResultGroup) => ({
        ...item,
        name: t(`modules.${item.module}`),
      }));

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
      inputClassName: 'border-none !p-0 rounded-none text-base font-medium',
      autofocus: true,
      clearIcon: (
        <Icon
          name="closeCircle2"
          size={16}
          className="-mr-1"
          color="!text-neutral-500"
        />
      ),
      isClearable: true,
    },
  ];

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      document.getElementById(`search-item-${selectedIndex}`)?.click();
      return;
    }

    const totalItems = sumBy(searchResults, (entity) => entity.results.length);

    if (totalItems === 0) {
      setSelectedIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      // Move selection down, loop back to the top if at the end
      setSelectedIndex((prevIndex: number) => (prevIndex + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      // Move selection up, loop back to the bottom if at the start
      setSelectedIndex((prevIndex) =>
        prevIndex === 0 ? totalItems - 1 : prevIndex - 1,
      );
    }
  };

  const hideSearchResults =
    showRecentSearchResults &&
    (isLoading ||
      sumBy(searchResults, (entity) => entity.results.length) === 0);

  return (
    <Modal
      open={true}
      className="fixed max-w-[700px] flex flex-col gap-2 !bg-transparent"
      wrapperClassName="h-[440px]"
      maskClassName="!backdrop-blur-none !bg-black/[.85]"
      onKeyDown={handleKeyDown}
      closeModal={onClose}
    >
      <div className="flex items-center w-full h-[60px] px-3 pr-1 py-3 gap-3 bg-white rounded-[10px] shadow">
        <Icon name="search" hover={false} size={24} />
        <div className="flex grow">
          <Layout fields={fields} className="w-full" />
        </div>
      </div>
      {!hideSearchResults && (
        <div className="w-full bg-white rounded-[8px] shadow pr-3 py-4">
          <SearchResults
            searchResults={searchResults}
            searchQuery={debouncedSearchQuery}
            isLoading={isLoading}
            onClose={onClose}
            selectedIndex={selectedIndex}
            updateSearchQuery={(value: string) => {
              setValue('globalSearch', value);
              setFocus('globalSearch');
            }}
          />
        </div>
      )}
    </Modal>
  );
};

export default SearchModal;
