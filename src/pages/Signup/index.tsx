import React, { useEffect, useState } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import { useMutation } from '@tanstack/react-query';
import { redirectWithToken } from 'utils/misc';
import { signup } from 'queries/account';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useDebounce } from 'hooks/useDebounce';
import { useDomainExists, useIsUserExist } from 'queries/users';

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
  password: yup.string().required('Required field'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'This must match the password')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface ISignupProps {}

export interface IValidationErrors {
  isError: boolean;
  isLoading: boolean;
}

const Signup: React.FC<ISignupProps> = () => {
  const [emailValidationErrors, setEmailValidationErrors] =
    useState<IValidationErrors | null>(null);

  const [domainValidationErrors, setDomainValidationErrors] =
    useState<IValidationErrors | null>(null);

  const isEmailValid = () => {
    if (emailValidationErrors) {
      let error = true;
      Object.keys(emailValidationErrors).forEach((key: string) => {
        if (emailValidationErrors.isError || emailValidationErrors.isLoading) {
          error = false;
          return;
        }
      });
      return error;
    } else return true;
  };

  const isDomainValid = () => {
    if (domainValidationErrors) {
      let error = true;
      Object.keys(domainValidationErrors).forEach((key: string) => {
        if (
          domainValidationErrors.isError ||
          domainValidationErrors.isLoading
        ) {
          error = false;
          return;
        }
      });
      return error;
    } else return true;
  };

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
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      workEmail: '',
      password: '',
      confirmPassword: '',
    },
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
      error:
        errors.workEmail?.message ||
        (emailValidationErrors?.isError && 'User already exists'),
      dataTestId: 'sign-up-email',
      control,
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter domain',
      name: 'domain',
      label: 'Domain*',
      error:
        errors.domain?.message ||
        (domainValidationErrors?.isError && 'Domain already exists'),
      dataTestId: 'sign-up-domain',
      control,
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password*',
      rightIcon: 'people',
      error: errors.password?.message,
      dataTestId: 'sign-up-password',
      control,
      getValues,
      onChange: () => {},
    },
    {
      type: FieldType.Password,
      placeholder: 'Re-Enter password',
      name: 'confirmPassword',
      label: 'Confirm Password*',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      dataTestId: 'sign-confirm-password',
      control,
      showChecks: false,
    },
    {
      type: FieldType.Checkbox,
      label:
        'By Signing up you are agreeing to Auzmor Office’s Terms of Use and Privacy Policy',
      name: 'privacyPolicy',
      error: errors.privacyPolicy?.message,
      dataTestId: 'sign-up-checkbox',
      control,
    },
  ];

  const onSubmit = (formData: IForm) => {
    signupMutation.mutate(formData);
  };

  const debouncedEmailValue = useDebounce(getValues().workEmail, 500);
  const { isLoading: isEmailLoading, data: isEmailData } =
    useIsUserExist(debouncedEmailValue);

  const debouncedDomainValue = useDebounce(getValues().domain, 500);
  const { isLoading: isDomainLoading, data: isDomainData } =
    useDomainExists(debouncedDomainValue);

  useEffect(() => {
    setEmailValidationErrors({
      ...emailValidationErrors,
      isError: isEmailData ? !!isEmailData.result.data.userExists : false,
      isLoading: isEmailLoading,
    });
  }, [isEmailLoading, isEmailData]);

  useEffect(() => {
    setDomainValidationErrors({
      ...domainValidationErrors,
      isError: isDomainData ? !!isDomainData.data.exists : false,
      isLoading: isDomainLoading,
    });
  }, [isDomainLoading, isDomainData]);

  return (
    <div className="flex h-screen w-screen">
      <div
        className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"
        data-testid="signup-cover-image"
      ></div>
      <div className="w-1/2 flex justify-center items-center relative bg-white">
        <div className="absolute top-8 right-8" data-testid="signup-logo-image">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">
            Sign Up
          </div>
          <form
            className="mt-12"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="signup-form"
          >
            {!!signupMutation.isError && (
              <div className="mb-8">
                <Banner
                  dataTestId="signup-error-msg"
                  title={
                    signupMutation.error?.toString() || 'Something went wrong'
                  }
                  variant={BannerVariant.Error}
                />
              </div>
            )}
            <Layout fields={fields} />
            <Button
              dataTestId="sign-up-btn"
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
