import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';
import { IDocType } from 'interfaces';
import Icon from 'components/Icon';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const documentOptions: ICheckboxListOption[] = [
  {
    data: {
      id: 'document',
      value: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.google-apps.document',
      ],
      label: 'Document',
      icon: 'doc',
    },
    datatestId: `document-${IDocType.DOCUMENT}`,
  },
  {
    data: { id: 'pdf', value: ['application/pdf'], label: 'PDF', icon: 'pdf' },
    datatestId: `document-${IDocType.PDF}`,
  },
  {
    data: {
      id: 'xls',
      value: [
        `application/vnd.google-apps.spreadsheet`,
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      label: 'XLS',
      icon: 'xls',
    },
    datatestId: `document-${IDocType.XLS}`,
  },
  {
    data: {
      id: 'form',
      value: ['application/vnd.google-apps.form'],
      label: 'Form',
      icon: 'form',
    },
    datatestId: `document-${IDocType.FORM}`,
  },
  {
    data: {
      id: 'folder',
      value: ['application/vnd.google-apps.folder'],
      label: 'Folder',
      icon: 'folder',
    },
    datatestId: `document-${IDocType.FOLDER}`,
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
        <div className="flex items-center ml-2.5 cursor-pointer text-xs gap-2">
          <Icon name={option?.data?.icon} />
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

export default DocumentType;
