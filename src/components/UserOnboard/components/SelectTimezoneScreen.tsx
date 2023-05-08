import React, { ReactElement } from 'react';
import timezones from 'utils/timezones.json';
import OnboardTimezone from 'images/onboard-timezone.png';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import Button, { Type } from 'components/Button';

const SelectTimezoneScreen: React.FC = (): ReactElement => {
  // Note: The timezone selector dropdown has to be a form component here.
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
  });
  return (
    <div className="flex items-center flex-col justify-between gap-y-4 px-10">
      <img src={OnboardTimezone} />
      <p className="font-bold text-neutral-900 text-2xl">
        Select your timezone
      </p>
      <p className="font-normal text-sm text-neutral-500">
        Please select your timezone from the options given below
      </p>
      <form onSubmit={() => console.log('submitted')}>
        <Layout
          className="min-w-[450px] max-w-[450px]"
          fields={[
            {
              type: FieldType.SingleSelect,
              name: 'timezone',
              control,
              options: timezones.map((timezone) => ({
                label: timezone.text,
                value: timezone.abbr,
              })),
              // defaultValue: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
              placeholder: 'Select your timezone',
            },
          ]}
        />
      </form>
    </div>
  );
};

export default SelectTimezoneScreen;
