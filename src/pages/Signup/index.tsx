import React, { useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import { useMutation } from '@tanstack/react-query';
import { readFirstAxiosError, redirectWithToken } from 'utils/misc';
import { signup } from 'queries/account';
import Banner, { Variant as BannerVariant } from 'components/Banner';

interface IForm {
  workEmail: string;
  domain: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
}

const schema = yup.object({
  workEmail: yup
    .string()
    .email('Please enter valid email address')
    .required('Required field'),
  domain: yup.string().required('Required field'),
  password: yup
    .string()
    .min(6, 'At leaset 6 digits')
    .required('Required field'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'This must match the password')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface ISignupProps {}

const Signup: React.FC<ISignupProps> = () => {
  const signupMutation = useMutation((formData: IForm) => signup(formData), {
    onSuccess: (data) =>
      redirectWithToken(
        data.result.data.redirectUrl,
        data.result.data.uat,
        true,
      ),
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
    signupMutation.reset();
  }, [
    watch('workEmail'),
    watch('domain'),
    watch('password'),
    watch('confirmPassword'),
    watch('privacyPolicy'),
  ]);

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
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter domain',
      name: 'domain',
      label: 'Domain*',
      error: errors.domain?.message,
      dataTestId: 'signup-work-domain',
      control,
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

  const onSubmit = (formData: IForm) => {
    signupMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"></div>
      <div className="w-1/2 flex justify-center items-center relative bg-white">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">
            Sign Up
          </div>
          <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
            {!!signupMutation.isError && (
              <div className="mb-8">
                <Banner
                  title={
                    readFirstAxiosError(signupMutation.error) ||
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
              loading={signupMutation.isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
