import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';

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

export interface IChannelType {
  id: ChannelTypeEnum;
  name: string;
}

const channelTypeOptions: ICheckboxListOption[] = [
  {
    data: {
      id: ChannelTypeEnum.MyChannels,
      name: enumToTitleCase(ChannelTypeEnum.MyChannels),
    },
    datatestId: `channel-type-${ChannelTypeEnum.MyChannels.toLowerCase()}`,
  },
  {
    data: {
      id: ChannelTypeEnum.Managed,
      name: enumToTitleCase(ChannelTypeEnum.Managed),
    },
    datatestId: `channel-type-${ChannelTypeEnum.Managed.toLowerCase()}`,
  },
  {
    data: {
      id: ChannelTypeEnum.DiscoverNewChannels,
      name: enumToTitleCase(ChannelTypeEnum.DiscoverNewChannels),
    },
    datatestId: `channel-type-${ChannelTypeEnum.DiscoverNewChannels.toLowerCase()}`,
  },
  {
    data: {
      id: ChannelTypeEnum.Requested,
      name: enumToTitleCase(ChannelTypeEnum.Requested),
    },
    datatestId: `channel-type-${ChannelTypeEnum.Requested.toLowerCase()}`,
  },
];

const ChannelType: FC<IChannelTypeProps> = ({ control, watch, setValue }) => {
  const [channelTypeCheckbox] = watch(['channelTypeCheckbox']);

  const channelTypeFields = [
    {
      type: FieldType.CheckboxList,
      name: 'channelTypeCheckbox',
      control,
      options: channelTypeOptions,
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!channelTypeCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {channelTypeCheckbox.map((channelType: ICheckboxListOption) => (
              <div
                key={channelType.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {channelType.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'channelTypeCheckbox',
                        channelTypeCheckbox.filter(
                          (selectedChannelType: ICheckboxListOption) =>
                            selectedChannelType.data.id !== channelType.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div>
          <Layout fields={channelTypeFields} />
        </div>
      </div>
    </div>
  );
};

export default ChannelType;
