import { FC } from 'react';
import SearchModal from './components/SearchModal';
import IconButton from 'components/IconButton';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ISearchResultType } from 'interfaces/search';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface IGlobalSearchProps {}

const GlobalSearch: FC<IGlobalSearchProps> = () => {
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });
  const { getApi } = usePermissions();
  const [isModalOpen, openModal, closeModal] = useModal();

  const getRecentSearchTerms = getApi(ApiEnum.GetRecentSearchTerms);
  const getRecentClickedResults = getApi(ApiEnum.GetRecentClickedResults);

  const {
    data: recentSearchTermsData,
    isLoading: isRecentSearchTermsFetching,
  } = getRecentSearchTerms({
    limit: 5,
  });

  const {
    data: recentClickedResultsData,
    isLoading: isRecentClickedResultsFetching,
  } = getRecentClickedResults({
    limit: 5,
  });

  const isRecentSearchResultsFetching =
    isRecentClickedResultsFetching || isRecentSearchTermsFetching;
  const recentSearchResults = [
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
  ];

  return (
    <div data-testid="global-search">
      <IconButton
        icon="search2"
        size={24}
        dataTestId="global-search-icon"
        ariaLabel={t('search')}
        onClick={openModal}
        color="text-[#888888]"
        className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[10px] px-[13px]"
        iconClassName="group-hover:!text-neutral-500"
      />
      {isModalOpen && (
        <SearchModal
          recentSearchResults={recentSearchResults}
          isRecentSearchResultsFetching={isRecentSearchResultsFetching}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default GlobalSearch;
