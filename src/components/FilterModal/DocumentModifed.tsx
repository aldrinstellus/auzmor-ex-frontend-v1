import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { titleCase } from 'utils/misc';
import { ICheckboxListOption } from 'components/CheckboxList';
import moment from 'moment';

interface IVisibilityProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const documentOptions: ICheckboxListOption[] = [
  {
    data: {
      id: 'today',
      value: moment(new Date().setHours(0, 0, 0, 0)).toString(),
      label: 'Today',
    },
    datatestId: `document-modified-today`,
  },
  {
    data: {
      id: 'last7days',
      value: moment().subtract(7, 'days').toString(),
      label: 'Last 7 days',
    },
    datatestId: `document-modified-last7days`,
  },
  {
    data: {
      id: 'last30days',
      value: moment().subtract(30, 'days').toString(),
      label: 'Last 30 days',
    },
    datatestId: `document-modified-last30days`,
  },
  {
    data: {
      id: 'thisyear',
      value: moment(
        new Date().setFullYear(new Date().getFullYear(), 1, 1),
      ).toString(),
      label: `This year (${new Date().getFullYear()})`,
    },
    datatestId: `document-modified-thisyear`,
  },
  {
    data: {
      id: 'lastyear',
      value: moment(
        new Date().setFullYear(new Date().getFullYear() - 1, 1, 1),
      ).toString(),
      label: 'Last year (2023)',
    },
    datatestId: `document-modified-lastyear`,
  },
];

const DocumentModified: FC<IVisibilityProps> = ({ control }) => {
  const documentFields = [
    {
      type: FieldType.CheckboxList,
      name: 'documentModifiedCheckbox',
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
