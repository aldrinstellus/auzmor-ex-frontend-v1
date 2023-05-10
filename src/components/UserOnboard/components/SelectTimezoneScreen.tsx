import React, { ReactElement, useRef } from 'react';
import timezones from 'utils/timezones.json';
import OnboardTimezone from 'images/onboard-timezone.png';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import Button, { Type } from 'components/Button';
import useAuth from 'hooks/useAuth';
import { updateUserMutation } from 'queries/users';

type SelectTimezoneScreenProps = {
  next: any;
};

interface IForm {
  timezone: string;
}

const SelectTimezoneScreen: React.FC<SelectTimezoneScreenProps> = ({
  next,
}): ReactElement => {
  // Note: The timezone selector dropdown has to be a form component here.
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const { user, updateUser } = useAuth();
  const updateUserTimezoneMutation: any = updateUserMutation(
    'update-user-timezone-mutation',
    updateUser,
  );

  const onSubmit = (formData: IForm) => {
    console.log(formData);
    updateUserTimezoneMutation.mutate({
      id: user?.id,
      timezone: formData?.timezone,
    });
  };

  const selectTimezoneForm = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-col min-h-full justify-between min-w-full">
      <div className="flex items-center flex-col justify-between gap-y-4 px-10 mt-6">
        <img src={OnboardTimezone} />
        <p className="font-bold text-neutral-900 text-2xl">
          Select your timezone
        </p>
        <p className="font-normal text-sm text-neutral-500">
          Please select your timezone from the options given below
        </p>
        <form onSubmit={handleSubmit(onSubmit)} ref={selectTimezoneForm}>
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
                  className: '!hover:bg-green-900',
                })),
                // defaultValue: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                placeholder: 'Select your timezone',
                menuPlacement: 'top',
              },
            ]}
          />
        </form>
      </div>
      <div className="bg-blue-50">
        <div className="p-4 flex items-center justify-between">
          <div />
          <Button
            className="font-bold"
            label="Next"
            type={Type.Submit}
            onClick={() => selectTimezoneForm.current?.submit()}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default SelectTimezoneScreen;
