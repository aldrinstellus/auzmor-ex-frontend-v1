import React, { ReactElement, useEffect } from 'react';
import timezones from 'utils/timezones.json';
import OnboardTimezone from 'images/onboard-timezone.png';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import Button, { Type } from 'components/Button';
import useAuth from 'hooks/useAuth';
import { updateUserAPI } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDefaultTimezoneOption } from '../utils/';
import Banner, { Variant } from 'components/Banner';

type SelectTimezoneScreenProps = {
  next: () => void;
  setDisableClose: (disableClose: boolean) => void;
};

interface IForm {
  timezone: OptionType;
}

export type OptionType = {
  label: string;
  value: string[];
};

const SelectTimezoneScreen: React.FC<SelectTimezoneScreenProps> = ({
  next,
  setDisableClose,
}): ReactElement => {
  const defaultTimezone = getDefaultTimezoneOption();

  const schema = yup.object({
    timezone: yup.object(),
  });

  const { control, handleSubmit, getValues } = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { user } = useAuth();

  const updateUserTimezoneMutation = useMutation({
    mutationFn: updateUserAPI,
    mutationKey: ['update-user-timezone-mutation'],
    onError: (error: any) => {
      console.log('Error while updating timezone: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated timezone successfully', response);
    },
  });

  const onSubmit = async () => {
    const selectedTimezone = getValues();
    await updateUserTimezoneMutation.mutateAsync({
      id: user?.id || '',
      timezone: selectedTimezone.timezone.value[0],
    });
    next();
  };

  const { isLoading, isError } = updateUserTimezoneMutation;

  useEffect(() => setDisableClose(isLoading), [isLoading]);

  const fields = [
    {
      type: FieldType.SingleSelect,
      name: 'timezone',
      control,
      options: timezones.map((timezone) => ({
        label: timezone.timezoneName,
        value: timezone.iana,
      })),
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
          <div className="bg-blue-50 min-w-full">
            <div className="p-3 flex items-center justify-between">
              <div />
              <Button
                className="font-bold"
                label="Next"
                type={Type.Submit}
                disabled={isLoading}
              ></Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelectTimezoneScreen;
