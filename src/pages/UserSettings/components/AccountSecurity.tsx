import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Button, { Type } from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { Variant as InputVariant } from 'components/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { getSubDomain } from 'utils/misc';
import Card from 'components/Card';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

interface IForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: any;
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

const AccountSecurity = () => {
  const { t } = useTranslation('userSetting', {
    keyPrefix: 'sign-in-security',
  });
  const { getApi } = usePermissions();
  const [err, setErr] = useState(false);

  const domain = getSubDomain(window.location.host);

  const useGetSSOFromDomain = getApi(ApiEnum.GetOrganizationDomain);
  const { data, isLoading } = useGetSSOFromDomain(domain);

  const changePassword = getApi(ApiEnum.ChangePassword);
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
      onSuccess: (_data) => {
        reset();
        successToastConfig({ content: 'Password updated successfully' });
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
      placeholder: t('currentPassword'),
      name: 'currentPassword',
      label: t('currentPassword'),
      rightIcon: 'eye',
      error: err && errors.currentPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-current-password',
      errorDataTestId: 'change-password-error',
      showChecks: false,
      disabled: isLoading || data?.result?.data?.sso?.active,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: t('newPassword'),
      name: 'newPassword',
      label: t('newPassword'),
      rightIcon: 'eye',
      error: errors.newPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-new-password',
      errorDataTestId: 'change-password-error',
      disabled: isLoading || data?.result?.data?.sso?.active,
      inputClassName: 'h-[44px]',
    },
  ];

  const confirmPasswordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-1/3 mt-6',
      placeholder: t('re-enter-password'),
      name: 'confirmPassword',
      label: t('confirmPassword'),
      rightIcon: 'eye',
      error: errors.confirmPassword?.message,
      control,
      getValues,
      onChange: () => {},
      dataTestId: 'change-password-confirm-password',
      errorDataTestId: 'change-password-error',
      showChecks: false,
      disabled: isLoading || data?.result?.data?.sso?.active,
      inputClassName: 'h-[44px]',
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
    <Card className="py-4 px-6 space-y-4">
      <div className="text-neutral-900 text-base font-bold">{t('title')}</div>
      <Divider />
      <div className="w-full">
        {!isSettings ? (
          <div className="flex justify-between items-center">
            <div>{t('password')}</div>
            <Button
              label={t('passwordCTA')}
              onClick={() => setIsSettings(true)}
              dataTestId="change-password-btn"
            />
          </div>
        ) : (
          <div className="flex justify-between items-center space-x-14 w-full">
            <div className="bg-white rounded-9xl w-full">
              <div
                className="flex mb-4 cursor-pointer"
                onClick={() => setIsSettings(false)}
              >
                <Icon className="rotate-90" name={'arrowDown'} />
                <div className="text-base font-bold">{t('changePassword')}</div>
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
                    <a href={`/forgot-password`} className="text-primary-500">
                      {t('forgotPassword')}
                    </a>
                  </div>
                  <div className="">
                    <Button
                      type={Type.Submit}
                      label={t('passwordCTA')}
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
    </Card>
  );
};

export default AccountSecurity;
