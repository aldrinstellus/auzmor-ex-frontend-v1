import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { IFilterForm } from '.';
import { ChannelVisibilityEnum } from 'stores/channelStore';
import { IRadioListOption } from 'components/RadioGroup';
import { titleCase } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';

interface IVisibilityProps {
  control: Control<IFilterForm>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const visibilityOptions: IRadioListOption[] = [
  {
    data: { value: ChannelVisibilityEnum.All },
    dataTestId: `visibility-${ChannelVisibilityEnum.All}`,
  },
  {
    data: { value: ChannelVisibilityEnum.Private },
    dataTestId: `visibility-${ChannelVisibilityEnum.Private}`,
  },
  {
    data: { value: ChannelVisibilityEnum.Public },
    dataTestId: `visibility-${ChannelVisibilityEnum.Public}`,
  },
];

const Visibility: FC<IVisibilityProps> = ({ control, watch }) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'visibilitySearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `visibility-search`,
    },
  ];

  const debouncedVisibilitySearchValue = useDebounce(
    watch('visibilitySearch') || '',
    300,
  );

  const filteredVisibilityOptions = visibilityOptions.filter((option) =>
    titleCase(option.data.value)
      .toLowerCase()
      .includes(debouncedVisibilitySearchValue.toLowerCase()),
  );

  const visibilityFields = [
    {
      type: FieldType.Radio,
      name: 'visibilityRadio',
      control,
      radioList: filteredVisibilityOptions,
      labelRenderer: (option: IRadioListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">
          {titleCase(option.data.value)}
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={visibilityFields} />
      </div>
    </div>
  );
};

export default Visibility;
