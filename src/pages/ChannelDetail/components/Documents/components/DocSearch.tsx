import Layout, { FieldType } from 'components/Form';
import React, { FC, useEffect, useRef } from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { IForm } from '..';
import clsx from 'clsx';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'hooks/useDebounce';
import DocSearchRow from './DocSearchRow';
import { Doc } from 'interfaces';
import Skeleton from 'react-loading-skeleton';
import NoDataFound from 'components/NoDataFound';

interface IDocSearchProps {
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  onEnter: (documentSearchDebounceValue: string) => void;
  onClick: (doc: Doc) => void;
}

const DocSearch: FC<IDocSearchProps> = ({
  control,
  watch,
  onEnter,
  onClick,
}) => {
  const documentSearch = watch('documentSearch');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { getApi } = usePermissions();
  const useChannelFiles = getApi(ApiEnum.GetChannelFiles);
  const { channelId } = useParams();
  const documentSearchDebounceValue = useDebounce(documentSearch, 100);

  // Api call: Get search results
  const { data: documents, isLoading } = useChannelFiles({
    channelId,
    params: { byTitle: documentSearchDebounceValue },
  });

  useEffect(() => {
    const elem = document.getElementById(
      'document-deep-search-input',
    ) as HTMLInputElement;
    if (elem) {
      inputRef.current = elem;
    }
  }, []);

  if (!!inputRef?.current) {
    inputRef!.current!.onkeyup = (e) => {
      if (e.code === 'Enter') {
        inputRef.current!.blur();
        onEnter(documentSearchDebounceValue);
      }
    };
  }

  const style = clsx({
    'absolute flex flex-col gap-[15px] w-full px-3 py-4 bg-white overflow-auto top-full mt-2 rounded-7xl border border-[#E7EDF6] transition-all duration-100 opacity-0 max-h-[212px] z-10':
      true,
    'group-focus-within/searchdoc:opacity-100': true,
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
            placeholder: 'Search documents',
            inputClassName: 'text-sm !py-2 h-10',
            leftIcon: 'search',
            isClearable: true,
            className: 'w-[480px] h-10',
          },
        ]}
        className="w-[480px]"
      />
      <ul
        className={style}
        style={{ boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)' }}
      >
        {isLoading ? (
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
        ) : (documents || []).length <= 0 ? (
          <NoDataFound illustrationClassName="h-24" hideClearBtn />
        ) : (
          (documents || []).map((doc: Doc) => (
            <li key={doc.id}>
              <DocSearchRow
                data={doc}
                searchQuery={documentSearchDebounceValue}
                onClick={onClick}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DocSearch;
