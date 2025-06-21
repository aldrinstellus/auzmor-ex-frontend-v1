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
      name,
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `doc-owner-search`,
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
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      {isLoading ? (
        <>
          {[...Array(6)].map((_value, i) => (
            <div
              key={`${i}-document-item-skeleton`}
              className={`px-6 py-3 border-b-1 border-b-bg-neutral-200 flex items-center`}
            >
              <ItemSkeleton />
            </div>
          ))}
        </>
      ) : isError ? (
        <div>Network error</div>
      ) : !!owners.length ? (
        <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
          <Layout fields={documentFields} />
        </div>
      ) : (
        <NoDataFound
          className="pt-8"
          onClearSearch={() => setValue(name, '')}
        />
      )}
    </div>
  );
};

export default DocumentOwner;
