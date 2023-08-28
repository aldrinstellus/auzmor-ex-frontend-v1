import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Button, { Type } from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { changePassword } from 'queries/account';
import { Link } from 'react-router-dom';
import { Variant as InputVariant } from 'components/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { getSubDomain, twConfig } from 'utils/misc';
import { useGetSSOFromDomain } from 'queries/organization';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';

interface IForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: any;
}

interface IAccountSecurity {
  setIsHeaderVisible?: any;
}

const schema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup
    .string()
    .required('New Password is a required field')
    .notOneOf(
      [yup.ref('currentPassword')],
      'New password cannot be the same as current password',
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is a required field')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

const AccountSecurity: React.FC<IAccountSecurity> = ({
  setIsHeaderVisible,
}) => {
  const [err, setErr] = useState(false);

  const domain = getSubDomain(window.location.host);
  const { data, isLoading } = useGetSSOFromDomain(domain);

  const changePasswordMutation = useMutation(
    (formData: any) => changePassword(formData),
    {
      onError: (error: any) => {
        setErr(true);
        if (error?.response?.data?.errors?.length) {
          setError('currentPassword', {
            type: 'custom',
            message: error?.response?.data?.errors[0]?.message,
          });
        }
      },
      onSuccess: (data) => {
        reset();
        toast(<SuccessToast content={'Password updated successfully'} />, {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        });
      },
    },
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
    setError,
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
      className: 'w-1/3',
      placeholder: 'Current password',
      name: 'currentPassword',
      label: 'Current Password',
      rightIcon: 'eye',
      error: err && errors.currentPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-current-password',
      errorDataTestId: 'change-password-error',
      showChecks: false,
      disabled: isLoading || data?.result?.data?.sso?.active,
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: 'New password',
      name: 'newPassword',
      label: 'New Password',
      rightIcon: 'eye',
      error: errors.newPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-new-password',
      errorDataTestId: 'change-password-error',
      disabled: isLoading || data?.result?.data?.sso?.active,
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
      rightIcon: 'eye',
      error: errors.confirmPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-confirm-password',
      errorDataTestId: 'change-password-error',
      showChecks: false,
      disabled: isLoading || data?.result?.data?.sso?.active,
    },
  ];

  const onSubmit = (formData: IForm) => {
    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const [isSettings, setIsSettings] = useState(false);

  return (
    <div className="w-full">
      {!isSettings ? (
        <div className="flex justify-between items-center">
          <div>Password</div>
          <Button
            label="Change Password"
            onClick={() => {
              setIsSettings(true);
              setIsHeaderVisible(true);
            }}
            dataTestId="change-password-btn"
          />
        </div>
      ) : (
        <div className="flex justify-between items-center space-x-14 w-full">
          <div className="bg-white rounded-9xl w-full">
            <div
              className="flex mb-4 cursor-pointer"
              onClick={() => {
                setIsSettings(false);
                setIsHeaderVisible(false);
              }}
            >
              <Icon className="rotate-90" name={'arrowDown'} />
              <div className="text-base font-bold">Change Password</div>
            </div>
            <Divider className="mb-10" />
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <Layout fields={passwordField} className="mb-4" />
              <Layout fields={confirmPasswordField} />
              <div className="flex justify-between items-center mt-28">
                <div
                  className="text-primary-500 text-base font-bold"
                  data-testId="forgot-password-cta"
                >
                  <a
                    href={`${process.env.REACT_APP_BASE_URL}/forgot-password`}
                    className="text-primary-500"
                  >
                    Forgot Password
                  </a>
                </div>
                <div className="">
                  <Button
                    type={Type.Submit}
                    label={'Change Password'}
                    className="w-full"
                    loading={changePasswordMutation.isLoading}
                    disabled={!isValid}
                    dataTestId="change-password-btn"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSecurity;
