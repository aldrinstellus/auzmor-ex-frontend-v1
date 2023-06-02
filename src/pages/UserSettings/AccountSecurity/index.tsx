import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Button, { Type } from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { changePassword } from 'queries/account';
import { Link, useNavigate } from 'react-router-dom';
import { Variant as InputVariant } from 'components/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ChangePassword from '../ChangePassword';

interface IForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: any;
}

interface IAccountSecurity {
  setIsSettings?: any;
  isSettings?: boolean;
}

const schema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup
    .string()
    .required()
    .notOneOf(
      [yup.ref('currentPassword')],
      'New password cannot be the same as current password',
    ),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

const AccountSecurity: React.FC<IAccountSecurity> = ({
  setIsSettings,
  isSettings,
}) => {
  const [err, setErr] = useState(false);

  const [success, setSuccess] = useState(false);

  const changePasswordMutation = useMutation(
    (formData: any) => changePassword(formData),
    {
      onError: (data) => {
        setErr(true);
      },
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
    setErr(false);
  }, [
    watch('currentPassword'),
    watch('newPassword'),
    watch('confirmPassword'),
  ]);

  const passwordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/2',
      placeholder: 'Current password',
      name: 'currentPassword',
      label: 'Current Password',
      rightIcon: 'eye',
      error: err || errors.currentPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'new-password',
      showChecks: false,
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/2 mt-6',
      placeholder: 'New password',
      name: 'newPassword',
      label: 'New Password',
      rightIcon: 'eye',
      error: errors.newPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'new-password',
    },
  ];

  const confirmPasswordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/2 mt-6',
      placeholder: 'Re-enter Password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      rightIcon: 'eye',
      error: errors.confirmPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'confirm-password',
      showChecks: false,
    },
  ];

  const onSubmit = (formData: IForm) => {
    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const navigate = useNavigate();

  return (
    // <Link to="/change-password">
    <div className="flex justify-between items-center">
      <div>Password</div>
      <Button
        label="Change Password"
        onClick={() => {
          setIsSettings(true);
          navigate('/change-password');
        }}
      />
    </div>
    // </Link>
  );
};

export default AccountSecurity;
