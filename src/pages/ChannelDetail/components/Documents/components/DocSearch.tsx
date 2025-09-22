import Layout, { FieldType } from 'components/Form';
import React, { FC, useEffect, useRef } from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { IForm } from '..';
import clsx from 'clsx';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { Link, useParams } from 'react-router-dom';
import { useDebounce } from 'hooks/useDebounce';
import DocSearchRow from './DocSearchRow';
import { Doc } from 'interfaces';
import Skeleton from 'react-loading-skeleton';
import NoDataFound from 'components/NoDataFound';
import { useTranslation } from 'react-i18next';

interface IDocSearchProps {
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  dirtyFields: any;
  onEnter: (documentSearchDebounceValue: string) => void;
  onClick: (doc: Doc) => void;
  getRowUrl: (pathWithId: any) => string;
  disable: boolean;
}

const DocSearch: FC<IDocSearchProps> = ({
  disable,
  control,
  watch,
  dirtyFields,
  onEnter,
  onClick,
  getRowUrl,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const documentSearch = watch('documentSearch');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { getApi } = usePermissions();
  const useChannelDocDeepSearch = getApi(ApiEnum.GetChannelDocDeepSearch);
  const { channelId } = useParams();
  const [isSearching, setIsSearching] = React.useState(false);
  const documentSearchDebounceValue = useDebounce(documentSearch, 500);
  const shouldFetch = !!documentSearchDebounceValue && dirtyFields?.documentSearch;

  // Api call: Get search results
  const { data, isFetching, isError } = useChannelDocDeepSearch({
    channelId,
    params: { q: documentSearchDebounceValue || '' },
  }, {enabled: shouldFetch});

  const documents = isError
    ? []
    : data?.pages?.flatMap((page: { data: any }) => page?.data?.result?.data);

  useEffect(() => {
    if (!documentSearch) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    if (!isFetching && shouldFetch) {
      setIsSearching(false);
    }
  }, [documentSearch, isFetching]);

  useEffect(() => {
    const elem = document.getElementById(
      'document-deep-search-input',
    ) as HTMLInputElement;
    if (elem) {
      inputRef.current = elem;
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
          inputRef.current!.blur();
          onEnter(documentSearch);
        }
      };
      inputRef.current.addEventListener('keyup', handleKeyUp);
      return () => {
        inputRef.current?.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [documentSearch, onEnter]);

  const style = clsx({
    'absolute flex flex-col gap-[15px] w-full px-3 py-4 bg-white overflow-auto top-full mt-2 rounded-7xl border border-[#E7EDF6] transition-all duration-100 opacity-0 max-h-[212px] z-40 hidden':
      true,
    'group-focus-within/searchdoc:opacity-100 group-focus-within/searchdoc:flex':
      true,
  });

  return (
    <div className="flex relative group/searchdoc">
      <Layout
        fields={[
          {
            type: FieldType.Input,
            id: 'document-deep-search-input',
            control,
            name: 'documentSearch',
            placeholder: t('docSearchPlaceholder'),
            inputClassName: 'text-sm !py-2 h-10',
            leftIcon: 'search',
            isClearable: true,
            className: 'w-[480px] h-10',
            disabled: disable,
          },
        ]}
        className="w-[480px]"
      />
      {dirtyFields?.documentSearch && (
        <ul
          className={style}
          style={{ boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)' }}
        >
          {isSearching ? (
            [...Array(3)].map((each, index: number) => (
              <li key={`doc-deep-search-skeleton-${index}`}>
                <div className="flex items-center gap-2">
                  <Skeleton height={32} width={32} />
                  <div className="flex flex-col flex-grow">
                    <Skeleton className="w-full" />
                    <Skeleton className="w-full" />
                  </div>
                </div>
              </li>
            ))
          ) : (documents || []).length === 0 ? (
            <NoDataFound illustrationClassName="h-24" hideClearBtn />
          ) : (
            (documents || []).map((doc: Doc) => (
              <li key={doc.id}>
                <Link to={getRowUrl(doc?.pathWithId)} onClick={(e) => e.preventDefault}>
                  <DocSearchRow
                    data={doc}
                    searchQuery={documentSearchDebounceValue}
                    onClick={onClick}
                  />
                </Link>
              </li>
            ))
          )}
        </ul>
    )}
    </div>
  );
};

export default DocSearch;
