import React, { useEffect, useState } from 'react';
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
      placeholder: 'New password',
      name: 'newPassword',
      label: 'Enter New Password',
      rightIcon: 'people',
      error: errors.newPassword?.message,
      control,
      onChange: (e: any) => {
        const value = e.target.value;
      },
      dataTestId: 'new-password',
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
  );

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover" />
      <div className="w-1/2 h-full flex justify-center items-center relative bg-white">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className={resetPasswordContainerStyles}>
          {isLoading ? (
            <div className="flex justify-center items-center">Loading ...</div>
          ) : (
            <>
              {!!data ? (
                <>
                  {resetPasswordMutation.isSuccess ? (
                    <>
                      <div className="text-center flex justify-center items-center flex-col space-y-9">
                        <Success />
                        <div className="text-neutral-900">
                          Password has been successfully reset
                        </div>
                      </div>
                      <Button
                        label={'Sign In Now'}
                        className="w-full mt-8"
                        size={Size.Large}
                        onClick={() => navigate('/login')}
                      />
                    </>
                  ) : (
                    <>
                      <div className="font-extrabold text-neutral-900 text-4xl">
                        Reset Password
                      </div>
                      <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
                        <>
                          <Layout fields={passwordField} className="mb-4" />
                          <Layout fields={confirmPasswordField} />
                          <Button
                            type={Type.Submit}
                            label={'Reset Password'}
                            className="w-full mt-8"
                            loading={resetPasswordMutation.isLoading}
                            disabled={!isValid}
                            size={Size.Large}
                          />
                        </>
                      </form>
                    </>
                  )}
                </>
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
