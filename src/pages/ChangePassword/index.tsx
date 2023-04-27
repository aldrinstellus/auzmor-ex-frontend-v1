import React, { useEffect, useState } from 'react';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import Button, { Type } from 'components/Button';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from 'queries/account';
import { Link } from 'react-router-dom';

export interface IChangePasswordProps {}

interface IForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: any;
}

const schema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

const ChangePassword: React.FC<IChangePasswordProps> = () => {
  const [success, setSuccess] = useState(false);

  const changePasswordMutation = useMutation(
    (formData: any) => changePassword(formData),
    {
      onSuccess: (data) => {
        setSuccess(true);
      },
    },
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    changePasswordMutation.reset();
  }, [
    watch('currentPassword'),
    watch('newPassword'),
    watch('confirmPassword'),
  ]);

  const passwordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: 'Current password',
      name: 'currentPassword',
      label: 'Current Password',
      rightIcon: 'people',
      error: errors.currentPassword?.message,
      control,
      getValues,
      onChange: (e: any) => {
        const value = e.target.value;
        // validatePassword(value);
      },
      dataTestId: 'new-password',
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: 'New password',
      name: 'newPassword',
      label: 'New Password',
      rightIcon: 'people',
      error: errors.newPassword?.message,
      control,
      getValues,
      onChange: (e: any) => {
        const value = e.target.value;
        // validatePassword(value);
      },
      dataTestId: 'new-password',
    },
  ];

  const confirmPasswordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: 'Re-enter Password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'confirm-password',
    },
  ];

  const onSubmit = (formData: IForm) => {
    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const sideNav = [
    { label: 'My Settings' },
    { label: 'General' },
    { label: 'Profile Settings' },
    { label: 'Out of Office' },
    { label: 'Account' },
    { label: 'Account Security' },
    { label: 'Notifications' },
  ];
  //TODO: side bar navigation
  //TODO: Policy check

  return (
    <div className="flex justify-between items-center w-full space-x-14">
      <div className="bg-white px-8 py-9 rounded-9xl w-[30%] h-[100%]">
        {sideNav.map((ele) => (
          <div className="mb-8 text-sm font-medium" key={ele.label}>
            {ele.label}
          </div>
        ))}
      </div>
      <div className="bg-white px-8 py-9 rounded-9xl w-[70%] h-[100%]">
        <div className="flex mb-4">
          <Icon name={'people'} />
          Change Password
        </div>
        <Divider className="mb-10 w-full" />
        <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
          <>
            <Layout fields={passwordField} className="mb-4" />
            <Layout fields={confirmPasswordField} />
            <div className="flex justify-between items-center mt-28">
              <div className="text-primary-500 text-base font-bold">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="w-1/4">
                <Button
                  type={Type.Submit}
                  label={'Change Password'}
                  className="w-full"
                  loading={changePasswordMutation.isLoading}
                  disabled={!isValid}
                />
              </div>
            </div>
          </>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
