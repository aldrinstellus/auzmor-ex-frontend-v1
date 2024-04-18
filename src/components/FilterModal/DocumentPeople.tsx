import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';
import { useGetStorageUser } from 'queries/storage';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

// call get document user api.

const DocumentPeople: FC<IVisibilityProps> = ({ control }) => {
  const { data: documentUser } = useGetStorageUser({
    q: '',
  });
  console.log('documentUser :', documentUser);
  const Docusers = documentUser?.data?.result?.data || [];
  console.log('Docusers :', Docusers);

  const documentFields = [
    {
      type: FieldType.CheckboxList,
      name: 'documentTypeCheckbox',
      control,

      options: Docusers?.map((user: any) => ({
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
  ];

  return (
    <div className="px-2 py-4">
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={documentFields} />
      </div>
    </div>
  );
};

export default DocumentPeople;
