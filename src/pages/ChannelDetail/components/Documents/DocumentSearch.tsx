import React, { FC } from 'react';
import { humanizeTime } from 'utils/time';
import Icon from 'components/Icon';
import { getIconName } from './components/Doc';
import PageLoader from 'components/PageLoader';
import { humanFileSize } from 'utils/misc';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';
import Button, { Variant } from 'components/Button';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type DocumentSearchProps = {
  searchQuery?: string;
};

const DocumentSearch: FC<DocumentSearchProps> = ({ searchQuery = '' }) => {
  const { getApi } = usePermissions();
  const { filters, clearFilters } = useAppliedFiltersForDoc();
  const searchStorage = getApi(ApiEnum.SearchStorage);
  const { data: documentData, isLoading } = searchStorage({
    q: searchQuery,
    mimeTypes:
      filters?.docTypeCheckbox
        .map((eachType: Record<string, string>) => eachType.value)
        .flat() || [],
    ownerEmail:
      filters?.docPeopleCheckbox.map(
        (eachType: Record<string, string>) => eachType.emailAddress,
      ) || [],
    modifiedBefor: '',
    modifiedAfter:
      filters?.docModifiedRadio &&
      new Date(filters?.docModifiedRadio).toISOString(),
    limit: 30,
  });

  const documents = documentData?.data?.result?.data || [];

  if (isLoading) {
    return <PageLoader />;
  }

  const EmptyState = () => {
    return (
      <div className="flex flex-col w-full justify-center items-center gap-4 pt-8">
        <div className="flex w-full justify-center">
          <img src={require('images/noResult.png')} alt="No Results Found" />
        </div>
        <p className="font-bold text-xl text-neutral-900">No results found</p>
        <Button
          label="Clear filters"
          variant={Variant.Secondary}
          className="text-base font-semibold !text-neutral-500 hover:!text-primary-500"
          onClick={clearFilters}
        />
      </div>
    );
  };

  if (!isLoading && !!!documents.length) {
    return <EmptyState />;
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
