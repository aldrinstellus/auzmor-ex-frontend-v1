import Layout, { FieldType } from 'components/Form';
import { FC, useMemo } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import { ICheckboxListOption } from 'components/CheckboxList';
import { titleCase } from 'utils/misc';
import { useChannelStore } from 'stores/channelStore';
import { useDebounce } from 'hooks/useDebounce';
import NoDataFound from 'components/NoDataFound';
import ItemSkeleton from 'components/FilterModal/ItemSkeleton';
import { useTranslation } from 'react-i18next';
interface IVisibilityProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  name: string;
}

const DocumentOwner: FC<IVisibilityProps> = ({
  control,
  watch,
  setValue,
  name,
}) => {
  const { t } = useTranslation('channelDetail');
  const { getApi } = usePermissions();
  const { channelId = '' } = useParams();
  const { rootFolderId } = useChannelStore();

  const [docOwnerSearch] = watch([`${name}-search`]);
  const debouncedDocOwnerSearch = useDebounce(docOwnerSearch, 300);

  const useChannelDocOwners = getApi(ApiEnum.GetChannelDocOwners);
  const {
    data: owners,
    isLoading,
    isError,
  } = useChannelDocOwners({
    channelId,
    rootFolderId,
    name: debouncedDocOwnerSearch,
  });

  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: `${name}-search`,
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `doc-owner-search`,
      className: 'h-9 text-sm [&_input]:!h-9', 
    },
  ];
  const documentFields = useMemo(
    () => [
      {
        type: FieldType.CheckboxList,
        name,
        control,
        options: owners?.map((owner: any) => ({
          data: { ...owner, id: owner.name },
          datatestId: `department-owner`,
        })),
        labelRenderer: (option: ICheckboxListOption) => (
          <div className="ml-2.5 cursor-pointer text-xs">
            {titleCase(option?.data?.name || '')}
          </div>
        ),
        rowClassName: 'px-6 py-3 border-b border-neutral-200',
      },
    ],
    [owners],
  );

  return (
    <div className="flex flex-col h-full max-h-[400px] px-2 pt-2">
      <div className="shrink-0 mb-2">
        <Layout fields={searchField} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <>
            {[...Array(6)].map((_value, i) => (
              <div
                key={`${i}-document-item-skeleton`}
                className="px-6 py-3 border-b border-neutral-200 flex items-center"
              >
                <ItemSkeleton />
              </div>
            ))}
          </>
        ) : isError ? (
          <div className="px-4 text-sm text-red-600">Network error</div>
        ) : !!owners.length ? (
          <div className="max-h-[330px] overflow-y-auto">
            <Layout fields={documentFields} />
          </div>
        ) : (
          <NoDataFound
            message={t('refineSearch')}
            className="flex flex-col h-full items-center justify-center"
            illustrationClassName="w-[30%] h-[30%]"
            onClearSearch={() => setValue(`${name}-search`, '')}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentOwner;
