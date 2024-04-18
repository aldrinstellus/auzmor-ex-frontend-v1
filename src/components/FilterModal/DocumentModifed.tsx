import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const documentOptions: ICheckboxListOption[] = [
  {
    data: { value: 'Today', label: 'Today' },
    datatestId: `document-`,
  },
  {
    data: {
      value: 'Last 7 days',
      label: 'Last 7 days',
    },
    datatestId: `document-`,
  },
  {
    data: {
      value: 'Last-30-days',
      label: 'Last 30 days',
    },
    datatestId: `document`,
  },
];

const DocumentModified: FC<IVisibilityProps> = ({ control }) => {
  const documentFields = [
    {
      type: FieldType.CheckboxList,
      name: 'documentTypeCheckbox',
      control,
      options: documentOptions,
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">
          {titleCase(option.data.label)}
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

export default DocumentModified;
