import NoDataFound from 'components/NoDataFound';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import { usePageTitle } from 'hooks/usePageTitle';
import DocSearchRow, {
  Variant,
} from 'pages/ChannelDetail/components/Documents/components/DocSearchRow';
import { DocType } from 'interfaces';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

enum OptionType {
  Document = 'DOCUMENT',
  People = 'PEOPLE',
  Team = 'TEAM',
  Channel = 'CHANNEL',
  Event = 'EVENT',
  TRAINING = 'TRAINING',
}

const SearchResults: FC = () => {
  usePageTitle('searchResults');
  const { getApi } = usePermissions();
  const { t } = useTranslation('document', { keyPrefix: 'searchResults' });
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || undefined;

  if (!searchQuery) {
    return <div>Error</div>;
  }

  const { user } = useAuth();

  const useConnectedStatus = getApi(ApiEnum.GetStorageConnectionStatus);
  const {
    data: syncStatus,
    isLoading: isStatusLoading,
    error,
  } = useConnectedStatus(user?.email || '');
  const isSynced = !error && !!syncStatus?.data?.result?.data;

  const searchStorage = getApi(ApiEnum.SearchStorage);
  const { data: documentData, isLoading } = searchStorage(
    {
      q: searchQuery,
      limit: 30,
    },
    !isStatusLoading && isSynced,
  );
  const documents = (documentData?.data?.result?.data || []).map(
    (document: DocType) => ({ optionType: OptionType.Document, raw: document }),
  );

  return (
    <>
      <div className="mb-12 flex flex-col gap-6 w-full h-full">
        <div className="bg-white rounded-[12px] px-6 py-4 text-2xl font-medium">{`${t(
          'searchPrefix',
        )} '${searchQuery}'`}</div>
        <div className="bg-white rounded-[12px] px-6 py-6 flex flex-col gap-6 flex-auto">
          {isLoading ? <PageLoader /> : null}
          {!isLoading && documents?.length === 0 ? (
            <NoDataFound
              className="py-4 w-full"
              searchString={searchQuery}
              message={
                <p>
                  {t('noDataMessage')} <br /> {t('noDataMessage2')}{' '}
                </p>
              }
              hideClearBtn
              dataTestId={`$search-noresult`}
            />
          ) : null}
          {!isLoading && documents?.length > 0
            ? documents.map((doc: DocType) => (
                <DocSearchRow key={doc.id} data={doc} variant={Variant.Large} />
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
