import React from 'react';
import { Logo } from 'components/Logo';
import { Success } from 'components/Logo';
import { FieldType } from 'components/Form';
import Button from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
// import PasswordComponent from 'components/PasswordComponent';

interface IResetPasswordProps {}

interface IForm {
  password: string;
}

const schema = yup.object({
  password: yup.string().min(6, 'At least 6 digits'),
});

const ResetPassword: React.FC<IResetPasswordProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const fields = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'New password',
      name: 'new-password',
      label: 'Enter New Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Re-enter Password',
      name: 'confirm-password',
      label: 'Confirm Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];
  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover" />
      <div className="w-1/2 h-full flex justify-center items-center relative">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          {2 + 2 !== 4 ? (
            <>
              <div className="font-extrabold text-neutral-900 text-4xl">
                Reset Password
              </div>
              <form className="mt-16" onSubmit={handleSubmit(() => {})}>
                {/* <PasswordComponent fields={fields} /> */}
                <Button
                  label={'Reset Password'}
                  disabled
                  className="w-full mt-8"
                />
              </form>
            </>
          ) : (
            <>
              <div className="text-center flex justify-center items-center flex-col space-y-9">
                <Success />
                <div className="text-neutral-900">
                  Password has been successfully reset
                </div>
              </div>
              <Link to="/login">
                <Button label={'Sign In Now'} className="w-full mt-8" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
