import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { IRadioListOption } from 'components/RadioGroup';
import { titleCase } from 'utils/misc';
import { Role } from 'utils/enum';

interface IRolesProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

export const roleOptions: IRadioListOption[] = [
  {
    data: { value: Role.Member },
    dataTestId: `roles-${Role.Member}`,
  },
  {
    data: { value: Role.Admin },
    dataTestId: `roles-${Role.Admin}`,
  },
];

const Roles: FC<IRolesProps> = ({ control }) => {
  const visibilityFields = [
    {
      type: FieldType.Radio,
      name: 'roles',
      control,
      radioList: roleOptions,
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
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={visibilityFields} />
      </div>
    </div>
  );
};

export default Roles;
