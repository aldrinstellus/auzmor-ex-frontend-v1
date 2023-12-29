/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from 'components/Card';
import Divider from 'components/Divider';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import timezones from 'utils/timezones.json';
import {
  beforeXUnit,
  formatDate,
  getNow,
  getTimezoneNameFromIANA,
  nDaysFromNow,
  parseDate,
} from 'utils/time';
import { oooReasons } from '../data';
import Button, { Size, Variant } from 'components/Button';
import SwitchToggle from 'components/SwitchToggle';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserById } from 'queries/users';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useAuth from 'hooks/useAuth';

interface IForm {
  timezone: { value: string; label: string };
  'ooo.start': Date;
  'ooo.end': Date;
  'ooo.reason': string;
  'ooo.message': string;
}

const schema = yup.object({
  timezone: yup.object(),
  'ooo.start': yup.date(),
  'ooo.end': yup.date(),
  'ooo.reason': yup.string(),
  'ooo.message': yup
    .string()
    .max(40, 'Message can not be more than 40 characters.'),
});

const BasicSettings = () => {
  const { user, updateUser } = useAuth();
  const [ooo, setOOO] = useState(user?.outOfOffice?.outOfOffice);
  const userTimezone = getTimezoneNameFromIANA(user?.timezone || '');
  const queryClient = useQueryClient();
  const firstUpdate = useRef(true);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      timezone: {
        value: user?.timezone,
        label: userTimezone,
      },
      'ooo.start': parseDate(user?.outOfOffice?.start) || getNow(),
      'ooo.end': parseDate(user?.outOfOffice?.end) || nDaysFromNow(1),
      'ooo.reason': user?.outOfOffice?.otherReason,
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['update-user-settings'],
    mutationFn: (data: any) => updateUserById(user?.id || '', data),
    onSuccess: async (res: any) => {
      // @ts-ignore
      updateUser({ outOfOffice: res?.result?.data?.outOfOffice });
      successToastConfig();
      await queryClient.invalidateQueries(['current-user-me']);
      reset({}, { keepValues: true });
    },
  });

  const oooReason: any = watch('ooo.reason');

  const timezoneField: any = [
    {
      type: FieldType.SingleSelect,
      label: 'Timezone',
      name: 'timezone',
      control: control,
      options: timezones.map((timeZone) => ({
        label: getTimezoneNameFromIANA(timeZone.iana),
        value: timeZone.iana,
        dataTestId: `scheduledpost-timezone-${timeZone.iana}`,
      })),
      defaultValue:
        {
          value: user?.timezone,
          label: userTimezone,
        } || '',
      dataTestId: 'timezone-title',
    },
  ];

  const oooFields = [
    {
      type: FieldType.DatePicker,
      name: 'ooo.start',
      label: 'Start date',
      className: '',
      minDate: beforeXUnit(1, 'days').toDate(),
      control,
      dataTestId: 'ooo-startdate',
      disabled: !ooo,
    },
    {
      type: FieldType.DatePicker,
      name: 'ooo.end',
      label: 'End date',
      className: '',
      minDate: new Date(),
      control,
      dataTestId: 'ooo-enddate',
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
      dataTestId: 'ooo-reason',
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
      dataTestId: 'ooo-others-message',
      error: errors?.['ooo.message']?.message,
      errorDataTestId: 'ooo-reason-error-message',
      disabled: !ooo,
    },
  ];

  const onSubmit = (data: any) => {
    let payload: Record<string, any> = {
      timeZone: data.timezone?.value,
    };
    if (ooo) {
      payload = {
        ...payload,
        outOfOffice: {
          outOfOffice: true,
          start: formatDate(data?.ooo?.start),
          end: formatDate(data?.ooo?.end),
          otherReason: data?.ooo?.reason?.key,
        },
      };
    }
    updateMutation.mutate(payload);
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
                  dataTestId="basic-settings-cancel"
                  disabled={updateMutation.isLoading}
                />
                <Button
                  label="Save changes"
                  size={Size.Small}
                  onClick={handleSubmit(onSubmit)}
                  dataTestId="basic-settings-save-changes"
                  loading={updateMutation.isLoading}
                />
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            To change your personal settings{' '}
            <Link to="/profile">
              <span
                className="text-primary-500 font-bold"
                data-testid="goto-myprofile"
              >
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
            <div
              className="text-neutral-900 text-base font-bold py-4"
              data-testid="outofoffice-title"
            >
              Out of Office
            </div>
            <div>
              <SwitchToggle
                defaultValue={ooo}
                onChange={(checked) => {
                  setOOO(checked);
                  if (!checked) {
                    updateMutation.mutate({
                      outOfOffice: {
                        outOfOffice: checked,
                      },
                    });
                  }
                }}
                dataTestId="ooo-toggle"
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
