import Layout, { FieldType } from 'components/Form';
import React from 'react';
import { IFilterForm, UserStatus } from '.';
import { IRadioListOption } from 'components/RadioGroup';
import { Control, FieldValues } from 'react-hook-form';

interface IUserStatusProps {
  control: Control<IFilterForm, any>;
}

const Status: React.FC<IUserStatusProps> = ({ control }) => {
  const userStatusfields = [
    {
      type: FieldType.Radio,
      control,
      name: 'status',
      radioList: [
        {
          data: {
            value: UserStatus.Active,
            label: 'Active',
            id: 'userstatus-active',
          },
          dataTestId: 'userstatus-active',
        },
        {
          data: {
            value: UserStatus.Invited,
            label: 'Invited',
            id: 'userstatus-invited',
          },
          dataTestId: 'userstatus-invited',
        },
        {
          data: { value: UserStatus.All, label: 'All', id: 'userstatus-all' },
          dataTestId: 'userstatus-all',
        },
      ],
      labelRenderer: (option: IRadioListOption) => (
        <div className="cursor-pointer text-xs text-neutral-900 font-medium ml-2.5">
          {option.data.label}
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];
  return (
    <div className="px-2 py-4">
      <Layout fields={userStatusfields} />
    </div>
  );
};

export default Status;
