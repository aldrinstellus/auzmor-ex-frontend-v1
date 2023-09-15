import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import timezones from 'utils/timezones.json';
import { getTimezoneNameFromIANA } from 'utils/time';
import useAuth from 'hooks/useAuth';
import { oooReasons } from '../data';
import Button, { Size, Variant } from 'components/Button';
import SwitchToggle from 'components/SwitchToggle';

interface IForm {
  timezone: string;
  'ooo.start': Date;
  'ooo.end': Date;
  'ooo.reason': string;
  'ooo.message': string;
}

const schema = yup.object({
  timezone: yup.string().required(),
  'ooo.start': yup.date(),
  'ooo.end': yup.date(),
  'ooo.reason': yup.string(),
  'ooo.message': yup
    .string()
    .max(40, 'Message can not be more than 40 characters.'),
});

const BasicSettings = () => {
  const { user } = useAuth();
  const [ooo, setOOO] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const oooReason: any = watch('ooo.reason');

  const timezoneField = [
    {
      type: FieldType.SingleSelect,
      label: 'Time zone',
      name: 'timezone',
      control: control,
      options: timezones.map((timeZone) => ({
        label: getTimezoneNameFromIANA(timeZone.iana),
        value: timeZone.iana,
      })),
      defaultValue: user?.timezone || '',
      dataTestId: 'timezone',
    },
  ];

  const oooFields = [
    {
      type: FieldType.DatePicker,
      name: 'ooo.start',
      label: 'Start date',
      className: '',
      minDate: new Date(),
      control,
      dataTestId: 'ooo-start',
      disabled: !ooo,
    },
    {
      type: FieldType.DatePicker,
      name: 'ooo.end',
      label: 'End date',
      className: '',
      minDate: new Date(),
      control,
      dataTestId: 'ooo-stop',
      disabled: !ooo,
    },
  ];

  const oooMessageField = [
    {
      type: FieldType.SingleSelect,
      label: 'Out of office reason',
      name: 'ooo.reason',
      control: control,
      options: oooReasons,
      placeholder: 'Select a reason',
      dataTestId: 'ooo-message',
      disabled: !ooo,
    },
  ];

  const oooCustomMessageField = [
    {
      type: FieldType.Input,
      label: 'Message',
      name: 'ooo.message',
      control: control,
      placeholder: 'ex. family function. will be available through text',
      dataTestId: 'ooo-message',
      error: errors?.['ooo.message']?.message,
      disabled: !ooo,
    },
  ];

  const onSubmit = (data: any) => {
    console.log('------->>>>', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Card className="!px-6 !py-4">
          <div className="flex justify-between items-center">
            <div className="text-neutral-900 text-base font-bold">
              User Settings
            </div>
            {isDirty && (
              <div className="flex items-center space-x-2">
                <Button
                  label="Cancel"
                  size={Size.Small}
                  variant={Variant.Secondary}
                />
                <Button
                  label="Save changes"
                  size={Size.Small}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            To change your personal settings{' '}
            <Link to="/profile">
              <span className="text-primary-500 font-bold">
                go to my profile
              </span>
            </Link>
          </div>
        </Card>
        <Card className="!px-6 !pt-0 !pb-6">
          <div className="text-neutral-900 text-base font-bold py-4">
            General Settings
          </div>
          <Divider />
          <div className="pt-4">
            <Layout fields={timezoneField} />
          </div>
        </Card>
        <Card className="!px-6 !pt-0 !pb-6 !mt-4">
          <div className="flex justify-between items-center">
            <div className="text-neutral-900 text-base font-bold py-4">
              Out of Office
            </div>
            <div>
              <SwitchToggle
                defaultValue={ooo}
                onChange={(checked) => setOOO(checked)}
              />
            </div>
          </div>
          <Divider />
          <div className="pt-4">
            <Layout className="grid grid-cols-2 gap-x-12" fields={oooFields} />
            <Layout className="mt-6" fields={oooMessageField} />
            {oooReason?.value === 'others' && (
              <Layout className="mt-6" fields={oooCustomMessageField} />
            )}
          </div>
        </Card>
      </div>
    </form>
  );
};

export default BasicSettings;
