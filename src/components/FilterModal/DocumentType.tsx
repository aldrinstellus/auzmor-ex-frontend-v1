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
      paramKey: 'Document',
    },
    datatestId: `document-${IDocType.DOCUMENT}`,
  },
  {
    data: {
      id: 'pdf',
      value: ['application/pdf'],
      label: 'PDF',
      icon: 'pdf',
      paramKey: 'PDF',
    },
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
      paramKey: 'Spreadsheet',
    },
    datatestId: `document-${IDocType.XLS}`,
  },
  {
    data: {
      id: 'ppt',
      value: [`ppt`, 'pptx'],
      label: 'Presentation',
      icon: 'ppt',
      paramKey: 'Presentation',
    },
    datatestId: `document-${IDocType.PPT}`,
  },
  {
    data: {
      id: 'form',
      value: ['application/vnd.google-apps.form'],
      label: 'Form',
      icon: 'form',
      paramKey: 'Form',
    },
    datatestId: `document-${IDocType.FORM}`,
  },
  // {
  //   data: {
  //     id: 'text',
  //     value: ['txt'],
  //     label: 'Text',
  //     icon: 'txt',
  //     paramKey: 'Text',
  //   },
  //   datatestId: `document-${IDocType.TXT}`,
  // },
  {
    data: {
      id: 'image',
      value: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      label: 'Image',
      icon: 'imageFile',
      paramKey: 'Image',
    },
    datatestId: `document-${IDocType.IMAGE}`,
  },
  {
    data: {
      id: 'video',
      value: ['mp4', '3gp', 'mkv', 'avi'],
      label: 'Video',
      icon: 'videoFile',
      paramKey: 'Video',
    },
    datatestId: `document-${IDocType.VIDEO}`,
  },
  {
    data: {
      id: 'audio',
      value: ['mp3', 'wav', 'flac'],
      label: 'Audio',
      icon: 'audioFile',
      paramKey: 'Audio',
    },
    datatestId: `document-${IDocType.AUDIO}`,
  },
  // {
  //   data: {
  //     id: 'archive',
  //     value: ['zip', 'rar', '7z', 'tar', 'gz'],
  //     label: 'Archive',
  //     icon: 'archive',
  //     paramKey: 'Archive',
  //   },
  //   datatestId: `document-${IDocType.ARCHIVE}`,
  // },
  // {
  //   data: {
  //     id: 'csv',
  //     value: ['csv'],
  //     label: 'CSV',
  //     icon: 'csv',
  //     paramKey: 'CSV',
  //   },
  //   datatestId: `document-${IDocType.CSV}`,
  // },
  // {
  //   data: {
  //     id: 'json',
  //     value: ['json'],
  //     label: 'JSON',
  //     icon: 'json',
  //     paramKey: 'JSON',
  //   },
  //   datatestId: `document-${IDocType.JSON}`,
  // },
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
