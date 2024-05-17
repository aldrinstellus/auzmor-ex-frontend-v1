import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';
import { IRadioListOption } from 'components/RadioGroup';
import moment from 'moment';

export enum ChannelTypeEnum {
  MyChannels = 'MY_CHANNELS',
  Managed = 'MANAGED',
  DiscoverNewChannels = 'DISCOVER_NEW_CHANNELS',
  Starred = 'STARRED',
  Requested = 'REQUESTED',
  Archived = 'ARCHIVED',
}

interface IChannelTypeProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const documentModifiedOptions: IRadioListOption[] = [
  {
    data: {
      id: 'today',
      value: moment(new Date().setHours(0, 0, 0, 0)).toString(),
      label: 'Today',
    },
    dataTestId: `document-modified-today`,
  },
  {
    data: {
      id: 'last7days',
      value: moment().subtract(7, 'days').toString(),
      label: 'Last 7 days',
    },
    dataTestId: `document-modified-last7days`,
  },
  {
    data: {
      id: 'last30days',
      value: moment().subtract(30, 'days').toString(),
      label: 'Last 30 days',
    },
    dataTestId: `document-modified-last30days`,
  },
  {
    data: {
      id: 'thisyear',
      value: moment(
        new Date().setFullYear(new Date().getFullYear(), 1, 1),
      ).toString(),
      label: `This year (${new Date().getFullYear()})`,
    },
    dataTestId: `document-modified-thisyear`,
  },
  {
    data: {
      id: 'lastyear',
      value: moment(
        new Date().setFullYear(new Date().getFullYear() - 1, 1, 1),
      ).toString(),
      label: 'Last year (2023)',
    },
    dataTestId: `document-modified-lastyear`,
  },
];

const ChannelType: FC<IChannelTypeProps> = ({ control }) => {
  const documentModifiedFields = [
    {
      type: FieldType.Radio,
      name: 'documentModifiedRadio',
      control,
      radioList: documentModifiedOptions,
      labelRenderer: (option: IRadioListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">
          {enumToTitleCase(option.data.label)}
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={documentModifiedFields} />
      </div>
    </div>
  );
};

export default ChannelType;
