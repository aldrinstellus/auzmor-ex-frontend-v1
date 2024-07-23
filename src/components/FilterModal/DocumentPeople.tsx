import Layout, { FieldType } from 'components/Form';
import { FC, useMemo } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';
import { useGetStorageUser } from 'queries/storage';
import ItemSkeleton from './ItemSkeleton';
import { useDebounce } from 'hooks/useDebounce';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const DocumentPeople: FC<IVisibilityProps> = ({ control, watch }) => {
  const [docUserSearch] = watch(['docUserSearch']);

  // fetch team from search input
  const debouncedTeamSearchValue = useDebounce(docUserSearch || '', 300);
  const { data: documentUser, isLoading } = useGetStorageUser({
    q: debouncedTeamSearchValue,
  });
  const docUsers = documentUser?.data?.result?.data || [];

  const documentFields = useMemo(
    () => [
      {
        type: FieldType.CheckboxList,
        name: 'documentPeopleCheckbox',
        control,
        options: docUsers?.map((user: any) => ({
          data: user,
          datatestId: `department-`,
        })),
        labelRenderer: (option: ICheckboxListOption) => (
          <div className="ml-2.5 cursor-pointer text-xs">
            {titleCase(option.data.name)}
          </div>
        ),
        rowClassName: 'px-6 py-3 border-b border-neutral-200',
      },
    ],
    [docUsers],
  );
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'docUserSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `doc-user-search`,
    },
  ];

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
      ) : (
        <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
          <Layout fields={documentFields} />
        </div>
      )}
    </div>
  );
};

export default DocumentPeople;
