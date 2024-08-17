import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';
import { IRadioListOption } from 'components/RadioGroup';
import { useDebounce } from 'hooks/useDebounce';
import useRole from 'hooks/useRole';

export enum ChannelTypeEnum {
  MyChannels = 'MY_CHANNELS',
  Managed = 'MANAGED',
  DiscoverNewChannels = 'DISCOVER_NEW_CHANNELS',
  Starred = 'STARRED',
  Requested = 'REQUESTED',
  Archived = 'ARCHIVED',
}

interface IChannelTypeProps {
  control: Control<IFilterForm>;
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

const ChannelType: FC<IChannelTypeProps> = ({ control, watch }) => {
  const { isAdmin } = useRole();

  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'channelTypeSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `channel-type-search`,
    },
  ];

  const debouncedChannelTypeSearchValue = useDebounce(
    watch('channelTypeSearch') || '',
    300,
  );

  const filteredChannelTypeOptions = channelTypeOptions.filter((option) => {
    if (option.data.value === ChannelTypeEnum.Archived && !isAdmin) {
      return false;
    }
    return enumToTitleCase(option.data.value)
      .toLowerCase()
      .includes(debouncedChannelTypeSearchValue.toLowerCase());
  });

  const channelTypeFields = [
    {
      type: FieldType.Radio,
      name: 'channelTypeRadio',
      control,
      radioList: filteredChannelTypeOptions,
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
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={channelTypeFields} />
      </div>
    </div>
  );
};

export default ChannelType;
