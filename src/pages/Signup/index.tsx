import React from 'react';
import { Variant as InputVariant } from '@auzmorui/component-library.components.input';
import { useForm } from 'react-hook-form';
import { Layout, FieldType } from '@auzmorui/component-library.components.form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@auzmorui/component-library.components.button';
import Logo from 'components/Logo';

interface IForm {
  email: string;
  domain: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
}

const schema = yup.object({
  email: yup
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
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full',
      placeholder: 'Enter your email address',
      name: 'email',
      label: 'Work Email*',
      error: errors.email?.message,
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
          <form className="mt-16" onSubmit={handleSubmit(() => {})}>
            <Layout className="w-full" fields={fields} />
            <Button
              label={'Sign Up'}
              disabled={!isValid}
              className="w-full mt-8"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
