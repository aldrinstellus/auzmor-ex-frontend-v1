import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import { useDebounce } from 'hooks/useDebounce';
import DocSearchRow from 'pages/ChannelDetail/components/Documents/components/DocSearchRow';
import { useConnectedStatus, useDocument } from 'queries/storage';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DocType } from 'queries/files';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });

  const { user } = useAuth();

  const {
    data: syncStatus,
    isLoading,
    error,
  } = useConnectedStatus(user?.email || '');

  const isSynced = !error && !!syncStatus?.data?.result?.data;

  const navigate = useNavigate();

  const { control, reset } = searchForm;

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery || '', 300);

  const { data: documentData, isFetching } = useDocument(
    {
      q: debouncedSearchQuery,
      limit: 4,
    },
    !isLoading && isSynced,
  );
  const documents = (documentData?.data?.result?.data || []).map(
    (document: DocType) => ({ optionType: OptionType.Document, ...document }),
  );

  const options = [...documents];

  useEffect(() => {
    const nodes = document.getElementsByClassName('global-select');
    if (nodes.length) {
      for (const each of nodes) {
        (
          each.firstChild?.firstChild?.firstChild as HTMLInputElement
        ).setAttribute('aria-label', 'search');
      }
    }
  });

  const fields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'globalSearch',
      dataTestId: 'global-search',
      className: 'px-5 py-3',
      placeholder: t('searchPlaceholder'),
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
        reset();
        setSearchQuery('');
        if (searchQuery) {
          navigate(`/search?q=${searchQuery}`);
        }
      },
      onSelect: (value: any, option: any) => {
        reset();
        setSearchQuery('');
        const fileUrl = option?.children?.props?.data?.raw?.fileUrl || '';
        if (fileUrl) window.open(fileUrl, '_blank');
      },
      optionRenderer: (option: any) => {
        return <DocSearchRow key={option.key} data={option} />;
      },
      disableFilterOption: true,
      onClear: () => {
        reset();
        setSearchQuery('');
      },
      noOptionsMessage: (
        <NoDataFound
          className="py-4 w-full"
          illustration="noDocumentFound"
          labelHeader={
            isSynced ? (
              <p>{t('noResultsHint')}</p>
            ) : (
              <p>{t('connectStorageHint')}</p>
            )
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
