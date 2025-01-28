import Layout, { FieldType } from 'components/Form';
import { FC, useMemo } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import ItemSkeleton from './ItemSkeleton';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import { ICheckboxListOption } from 'components/CheckboxList';
import { titleCase } from 'utils/misc';
import { useChannelStore } from 'stores/channelStore';
import { useDebounce } from 'hooks/useDebounce';
import NoDataFound from 'components/NoDataFound';
interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const DocumentOwner: FC<IVisibilityProps> = ({ control, watch, setValue }) => {
  const { getApi } = usePermissions();
  const { channelId = '' } = useParams();
  const { rootFolderId } = useChannelStore();

  const [docOwnerSearch] = watch(['docOwnerSearch']);
  const debouncedDocOwnerSearch = useDebounce(docOwnerSearch, 300);

  const useChannelDocOwners = getApi(ApiEnum.GetChannelDocOwners);
  const { data: owners, isLoading } = useChannelDocOwners({
    channelId,
    rootFolderId,
    name: debouncedDocOwnerSearch,
  });

  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'docOwnerSearch',
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
        name: 'documentOwnerCheckbox',
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

  console.log(owners);

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
      ) : !!owners.length ? (
        <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
          <Layout fields={documentFields} />
        </div>
      ) : (
        <NoDataFound
          className="pt-8"
          onClearSearch={() => setValue('docOwnerSearch', '')}
        />
      )}
    </div>
  );
};

export default DocumentOwner;
