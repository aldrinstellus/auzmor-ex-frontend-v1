import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import { useDebounce } from 'hooks/useDebounce';
import DocSearchRow from 'pages/ChannelDetail/components/Documents/components/DocSearchRow';
import { useDocument } from 'queries/storage';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DocType } from 'queries/files';
import { useNavigate } from 'react-router-dom';

export interface IGlobalSearchProps {}

enum OptionType {
  Document = 'DOCUMENT',
  People = 'PEOPLE',
  Team = 'TEAM',
  Channel = 'CHANNEL',
  Event = 'EVENT',
  TRAINING = 'TRAINING',
}

const GlobalSearch: FC<IGlobalSearchProps> = () => {
  const searchForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  const navigate = useNavigate();

  const { control } = searchForm;

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery || '', 300);

  const { data: documentData, isFetching } = useDocument({
    q: debouncedSearchQuery,
    limit: 4,
  });
  const documents = (documentData?.data?.result?.data || []).map(
    (document: DocType) => ({ optionType: OptionType.Document, ...document }),
  );

  const options = [...documents];

  const fields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'globalSearch',
      dataTestId: 'global-search',
      className: 'px-5 py-3',
      placeholder: 'Search name, channel, team, document etc.,',
      selectClassName: 'global-select',
      suffixIcon: <></>,
      clearIcon: (
        <Icon name="closeCircle" size={16} className="-mt-0.5 !mr-4" />
      ),
      isClearable: true,
      isLoading: isFetching,
      options: options?.map(
        (doc: any) =>
          ({
            value: doc.id,
            label: doc.name,
            raw: doc,
          } as any),
      ),
      onSearch: (searchQuery: string) => {
        setSearchQuery(searchQuery);
      },
      onEnter: () => {
        if (searchQuery) {
          navigate(`/search?q=${searchQuery}`);
        }
      },
      optionRenderer: (option: any) => {
        return <DocSearchRow key={option.key} data={option} />;
      },
      disableFilterOption: true,
      onClear: () => {},
      noOptionsMessage: (
        <NoDataFound
          className="py-4 w-full"
          illustration="noDocumentFound"
          labelHeader={
            <p>We&apos;re a little lost. Can you give us a hint? </p>
          }
          hideClearBtn
          dataTestId="globalsearch-noDataFound"
        />
      ),
    },
  ];

  return <Layout fields={fields} />;
};

export default GlobalSearch;
