import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';
import { IRadioListOption } from 'components/RadioGroup';

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

export const channelTypeOptions: IRadioListOption[] = [
  {
    data: {
      value: ChannelTypeEnum.MyChannels,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.MyChannels.toLowerCase()}`,
  },
  {
    data: {
      value: ChannelTypeEnum.Managed,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.Managed.toLowerCase()}`,
  },
  {
    data: {
      value: ChannelTypeEnum.DiscoverNewChannels,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.DiscoverNewChannels.toLowerCase()}`,
  },
  {
    data: {
      value: ChannelTypeEnum.Starred,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.Starred.toLowerCase()}`,
  },
  {
    data: {
      value: ChannelTypeEnum.Requested,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.Requested.toLowerCase()}`,
  },
  {
    data: {
      value: ChannelTypeEnum.Archived,
    },
    dataTestId: `channel-type-${ChannelTypeEnum.Archived.toLowerCase()}`,
  },
];

const ChannelType: FC<IChannelTypeProps> = ({ control }) => {
  const channelTypeFields = [
    {
      type: FieldType.Radio,
      name: 'channelTypeRadio',
      control,
      radioList: channelTypeOptions,
      labelRenderer: (option: IRadioListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">
          {enumToTitleCase(option.data.value)}
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={channelTypeFields} />
      </div>
    </div>
  );
};

export default ChannelType;
