import React, { useEffect, useState } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import WelcomeOffice from 'images/welcomeToOffice.png';
import { useMutation } from '@tanstack/react-query';
import { redirectWithToken } from 'utils/misc';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useSearchParams } from 'react-router-dom';
import { acceptInviteSetPassword, useVerifyInviteLink } from 'queries/users';
import PageLoader from 'components/PageLoader';

interface IForm {
  workEmail: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
}

const schema = yup.object({
  workEmail: yup.string(),
  password: yup
    .string()
    .min(6, 'At leaset 6 digits')
    .required('Required field'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface IAcceptInviteProps {}

const AcceptInvite: React.FC<IAcceptInviteProps> = () => {
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get('token');
  const orgId = searchParams.get('orgId');

  const { data, isLoading, isError } = useVerifyInviteLink({
    token,
    orgId,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInviteSetPassword,
    mutationKey: ['accept-invite-mutation'],
    onSuccess: (data) => {
      redirectWithToken({
        redirectUrl: data.result.data.redirectUrl,
        token: data.result.data.uat,
        showOnboard: true,
      });
    },
    onError: () => {},
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    acceptInviteMutation.reset();
  }, [watch('password'), watch('confirmPassword'), watch('privacyPolicy')]);

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your email address',
      name: 'workEmail',
      label: 'Work Email*',
      error: errors.workEmail?.message,
      dataTestId: 'signup-work-email',
      control,
      disabled: true,
      className:
        'text-neutral-400 disabled:border-none disabled:bg-neutral-200',
      defaultValue: data?.result?.data?.email,
    },
    {
      type: FieldType.Password,
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password*',
      rightIcon: 'people',
      error: errors.password?.message,
      dataTestId: 'signup-work-password',
      control,
      showChecks: false,
    },
    {
      type: FieldType.Password,
      placeholder: 'Re-Enter password',
      name: 'confirmPassword',
      label: 'Confirm Password*',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      dataTestId: 'signup-work-re-password',
      control,
      showChecks: false,
    },
    {
      type: FieldType.Checkbox,
      label:
        'By Signing up you are agreeing to Auzmor Office’s Terms of Use and Privacy Policy',
      name: 'privacyPolicy',
      error: errors.privacyPolicy?.message,
      dataTestId: 'signup-work-privacy',
      control,
    },
  ];

  const onSubmit = (formData: IForm) =>
    acceptInviteMutation.mutate({ password: formData.password, token, orgId });
  return isLoading ? (
    <PageLoader />
  ) : isError ? (
    <div>Error</div>
  ) : (
    <div className="flex h-screen w-screen">
      <img
        src={WelcomeOffice}
        className="h-full w-[48%]"
        alt="Welcome to Auzmor Office"
      />
      <div className="w-[52%] flex justify-center items-center relative bg-white h-full overflow-y-auto">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">
            Sign Up
          </div>
          <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
            {!!acceptInviteMutation.isError && (
              <div className="mb-8">
                <Banner
                  title={
                    acceptInviteMutation.error?.toString() ||
                    'Something went wrong'
                  }
                  variant={BannerVariant.Error}
                />
              </div>
            )}
            <Layout fields={fields} />
            <Button
              label={'Sign Up'}
              disabled={!isValid}
              className="w-full mt-8"
              type={ButtonType.Submit}
              size={Size.Large}
              loading={acceptInviteMutation.isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
