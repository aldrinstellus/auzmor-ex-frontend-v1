import React, { ReactElement, useEffect } from 'react';
import timezones from 'utils/timezones.json';
import OnboardTimezone from 'images/onboard-timezone.png';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import Button, { Type } from 'components/Button';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDefaultTimezoneOption } from '../utils/';
import Banner, { Variant } from 'components/Banner';

type SelectTimezoneScreenProps = {
  next: () => void;
  setDisableClose: (disableClose: boolean) => void;
  dataTestId?: string;
};

interface IForm {
  timeZone: OptionType;
}

export type OptionType = {
  label: string;
  value: string[];
};

const SelectTimezoneScreen: React.FC<SelectTimezoneScreenProps> = ({
  next,
  setDisableClose,
  dataTestId,
}): ReactElement => {
  const defaultTimezone = getDefaultTimezoneOption();

  const schema = yup.object({
    timeZone: yup.object(),
  });

  const { control, handleSubmit, getValues } = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const updateUserTimezoneMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-timeZone-mutation'],
    onError: (error: any) => {
      console.log('Error while updating timezone: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated timezone successfully', response);
    },
  });

  const onSubmit = async () => {
    const selectedTimezone = getValues();
    let timezoneValue;
    if (selectedTimezone.timeZone === undefined) {
      timezoneValue = defaultTimezone.value[0];
    } else {
      timezoneValue = selectedTimezone.timeZone.value[0];
    }
    await updateUserTimezoneMutation.mutateAsync({
      timeZone: timezoneValue,
    });
    next();
  };

  const { isLoading, isError } = updateUserTimezoneMutation;

  useEffect(() => setDisableClose(isLoading), [isLoading]);

  const fields = [
    {
      type: FieldType.SingleSelect,
      name: 'timeZone',
      control,
      options: timezones.map((timeZone) => ({
        label: timeZone.timezoneName,
        value: timeZone.iana,
      })),
      dataTestId: dataTestId,
      defaultValue: defaultTimezone,
      menuPlacement: 'top',
    },
  ];

  return (
    <div className="flex flex-col min-h-full justify-between min-w-full">
      <div className="flex items-center flex-col justify-between gap-y-3 px-10 mt-6">
        <img src={OnboardTimezone} />
        <p className="font-bold text-neutral-900 text-2xl">
          Select your timezone
        </p>
        <p className="font-normal text-sm text-neutral-500">
          Please select your timezone from the options given below
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4 items-center"
      >
        <Layout className="min-w-[450px] max-w-[450px]" fields={fields} />
        <div className="min-w-full">
          <div>
            <Banner
              variant={Variant.Error}
              title="Failed to set timezone. Please try again!"
              className={`min-w-full ${
                isError && !isLoading ? 'visible' : 'invisible'
              }`}
            />
          </div>
          <div className="bg-blue-50 min-w-full rounded-b-9xl">
            <div className="p-3 flex items-center justify-between">
              <div />
              <Button
                className="font-bold"
                label="Next"
                type={Type.Submit}
                disabled={isLoading}
                dataTestId="select-timezone-next"
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelectTimezoneScreen;
