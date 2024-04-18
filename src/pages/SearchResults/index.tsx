import PageLoader from 'components/PageLoader';
import DocSearchRow from 'pages/ChannelDetail/components/Documents/components/DocSearchRow';
import { DocType } from 'queries/files';
import { useDocument } from 'queries/storage';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';

enum OptionType {
  Document = 'DOCUMENT',
  People = 'PEOPLE',
  Team = 'TEAM',
  Channel = 'CHANNEL',
  Event = 'EVENT',
  TRAINING = 'TRAINING',
}

const SearchResults: FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || undefined;
  if (!searchQuery) {
    return <div>Error</div>;
  }

  const { data: documentData, isLoading } = useDocument({
    q: searchQuery,
    limit: 30,
  });
  const documents = (documentData?.data?.result?.data || []).map(
    (document: DocType) => ({ optionType: OptionType.Document, raw: document }),
  );

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <>
      <div className="mb-12 flex flex-col gap-6 w-full">
        <div className="bg-white rounded-[12px] px-6 py-4 text-2xl font-medium">{`Search Results for '${searchQuery}'`}</div>
        <div className="bg-white rounded-[12px] px-6 py-4">
          {documents.map((doc: DocType) => (
            <DocSearchRow key={doc.id} data={doc} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
