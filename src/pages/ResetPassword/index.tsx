import React, { useEffect } from 'react';
import { Logo } from 'components/Logo';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { resetPassword, useTokenValidation } from 'queries/account';
import PasswordExpiry from 'pages/PasswordExpiry';
import clsx from 'clsx';
import PageLoader from 'components/PageLoader';

interface IForm {
  newPassword: string;
  password: string;
  token: any;
}

const schema = yup.object({
  newPassword: yup.string().required(),
  password: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
  token: yup.string(),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading } = useTokenValidation(token || '');

  const resetPasswordMutation = useMutation((formData: any) =>
    resetPassword(formData),
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      password: '',
      token,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    resetPasswordMutation.reset();
  }, [watch('newPassword'), watch('password')]);

  const passwordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Enter password',
      name: 'newPassword',
      label: 'New Password',
      rightIcon: 'people',
      error: errors.newPassword?.message,
      setError,
      control,
      onChange: (e: any) => {
        const value = e.target.value;
      },
      dataTestId: 'new-password',
      inputClassName: 'h-[44px]',
    },
  ];

  const confirmPasswordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Re-enter Password',
      name: 'password',
      label: 'Confirm Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      dataTestId: 'confirm-password',
      showChecks: false,
      inputClassName: 'h-[44px]',
    },
  ];

  const onSubmit = (formData: IForm) => {
    resetPasswordMutation.mutate({
      password: formData.password,
      token: formData.token,
    });
  };

  const resetPasswordContainerStyles = clsx(
    { 'w-full': true },
    { 'max-w-[440px]': !!data },
    { 'h-full': true },
    { 'pt-[80px]': true },
    { 'mr-6': !!data },
  );

  return (
    <div className="flex h-screen w-screen">
      <div
        className="w-[49.3vw] h-full bg-welcome-to-office bg-no-repeat bg-cover bg-bottom"
        data-testid="reset-password-cover-image"
      />
      <div className="h-full flex flex-1 justify-center items-center relative bg-white overflow-y-auto">
        <div
          className="absolute top-[4.55vh] right-[3.5vw]"
          data-testid="reset-password-logo-image"
        >
          <Logo />
        </div>
        <div className={resetPasswordContainerStyles}>
          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              {!!data ? (
                <div className="w-[414px] h-full pt-2">
                  {resetPasswordMutation.isSuccess ? (
                    <div className="text-center flex flex-col space-y-8 h-full justify-center items-center mt-[-110px]">
                      <Success />
                      <div className="text-neutral-900 font-bold">
                        Password has been successfully reset
                      </div>
                      <Button
                        label={'Sign In Now'}
                        className="w-full mt-8"
                        size={Size.Large}
                        onClick={() => navigate('/login')}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="font-extrabold text-neutral-900 text-4xl">
                        Reset Password
                      </div>
                      <form className="mt-9" onSubmit={handleSubmit(onSubmit)}>
                        <Layout fields={passwordField} className="mb-4" />
                        <Layout fields={confirmPasswordField} />
                        <Button
                          type={Type.Submit}
                          label={'Reset Password'}
                          className="w-full mt-8"
                          loading={resetPasswordMutation.isLoading}
                          disabled={!isValid || !!errors?.password?.type}
                          size={Size.Large}
                        />
                      </form>
                    </>
                  )}
                </div>
              ) : (
                <PasswordExpiry />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
