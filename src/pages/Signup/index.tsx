import React from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import { useMutation } from '@tanstack/react-query';
import { IOrganization, signup } from 'queries/organization';
import { redirectWithToken } from 'utils/misc';

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
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface ISignupProps {}

const Signup: React.FC<ISignupProps> = () => {
  const signupMutation = useMutation(
    (formData: IOrganization) => signup(formData),
    {
      onSuccess: (data) =>
        redirectWithToken(data.result.data.redirectUrl, data.result.data.uat),
    },
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full',
      placeholder: 'Enter your email address',
      name: 'workEmail',
      label: 'Work Email*',
      error: errors.workEmail?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full mt-8',
      placeholder: 'Enter domain',
      name: 'domain',
      label: 'Domain*',
      error: errors.domain?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password*',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Re-Enter password',
      name: 'confirmPassword',
      label: 'Confirm Password*',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Checkbox,
      className: 'w-full mt-8 flex',
      label: 'This is privacy policy',
      name: 'privacyPolicy',
      error: errors.privacyPolicy?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];
  return (
    <div className="flex h-[100vh] w-[100vw]">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"></div>
      <div className="w-1/2 flex justify-center items-center relative">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">
            Sign Up
          </div>
          <form
            className="mt-16"
            onSubmit={handleSubmit((data) =>
              signupMutation.mutate({
                workEmail: data.workEmail,
                password: data.password,
                domain: data.domain,
              }),
            )}
          >
            <Layout className="w-full" fields={fields} />
            <Button
              label={'Sign Up'}
              disabled={!isValid}
              className="w-full mt-8"
              type={ButtonType.Submit}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
