import { useDocument } from 'queries/storage';
import React, { FC } from 'react';
import { humanizeTime } from 'utils/time';
import Icon from 'components/Icon';
import { getIconName } from './components/Doc';
import PageLoader from 'components/PageLoader';
import { humanFileSize } from 'utils/misc';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';

type DocumentSearchProps = {
  searchQuery?: string;
};

const DocumentSearch: FC<DocumentSearchProps> = ({ searchQuery = '' }) => {
  const { filters } = useAppliedFiltersForDoc();
  console.log(
    filters?.docTypeCheckbox
      .map((eachType: Record<string, string>) => eachType.value)
      .flat(),
  );
  const { data: documentData, isLoading } = useDocument({
    q: searchQuery,
    mimeType:
      filters?.docTypeCheckbox
        .map((eachType: Record<string, string>) => eachType.value)
        .flat() || [],
    ownerEmail: '',
    modifiedBefor: '',
    modifiedAfter: filters?.docModifiedRadio,
    limit: 30,
  });

  const documents = documentData?.data?.result?.data || [];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Search results</p>
        {documents?.map((data: any) => {
          const iconName = getIconName(data?.mimeType);
          return (
            <div
              key={data?.name}
              className="flex items-center hover:bg-primary-50 w-full cursor-pointer gap-4"
              onClick={() => {
                window.open(data?.fileUrl, '_blank');
              }}
            >
              <div className="flex gap-2">
                <Icon name={iconName} size={56} />
                <div className="flex flex-col">
                  <div className="text-xxs font-medium text-neutral-500">
                    {iconName === 'folder' ? 'FOLDER' : 'DOCUMENT'}
                  </div>
                  <div className="text-base font-semibold text-neutral-900 ">
                    {data?.name}
                  </div>
                  <div className="flex items-center justify-start gap-4 text-xs text-neutral-500 font-normal">
                    {data?.size ? (
                      <div>{humanFileSize(data?.size || 0)}</div>
                    ) : null}
                    {data?.size ? (
                      <div className="bg-neutral-500 w-2 h-2 rounded-full" />
                    ) : null}
                    {data?.modifiedAt ? (
                      <div>{`Updated ${humanizeTime(data?.modifiedAt)}`}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DocumentSearch;
