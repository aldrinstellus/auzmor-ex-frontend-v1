import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';
import { IDocType } from 'queries/storage';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const documentOptions: ICheckboxListOption[] = [
  {
    data: { value: IDocType.DOCUMENT },
    datatestId: `document-${IDocType.DOCUMENT}`,
  },
  {
    data: { value: IDocType.FOLDER },
    datatestId: `document-${IDocType.FOLDER}`,
  },
  {
    data: { value: IDocType.FORM },
    datatestId: `document-${IDocType.FORM}`,
  },
];

const DocumentType: FC<IVisibilityProps> = ({ control }) => {
  const documentFields = [
    {
      type: FieldType.CheckboxList,
      name: 'documentTypeCheckbox',
      control,
      options: documentOptions,
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">
          {titleCase(option.data.value)}
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

export default DocumentType;
