import React, { useEffect, useState } from 'react';
import { Logo } from 'components/Logo';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import PasswordPolicy from 'components/PasswordPolicy';
import { useMutation } from '@tanstack/react-query';
import { redirectWithToken } from 'utils/misc';
import { resetPassword } from 'queries/account';
import PasswordExpiry from 'pages/PasswordExpiry';

interface IResetPasswordProps {
  token: string;
}

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

const ResetPassword: React.FC<IResetPasswordProps> = ({ token }) => {
  const [success, setSuccess] = useState(false);

  const [passwordRule, setPasswordRule] = useState({
    length: false,
    isUppercase: false,
    isLowercase: false,
    isNumber: false,
    isSymbol: false,
  });

  const resetPasswordMutation = useMutation(
    (formData: any) => resetPassword(formData),
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
      getValues,
      onChange: (e: any) => {
        const value = e.target.value;
        validatePassword(value);
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
      getValues,
      onChange: () => {},
      dataTestId: 'confirm-password',
    },
  ];

  const onSubmit = (formData: IForm) => {
    console.log(formData, 'DATA');
    resetPasswordMutation.mutate({
      password: formData.password,
      token: formData.token,
    });
  };

  const validatePassword = (value: string) => {
    const validationState = {
      length: true,
      isUppercase: true,
      isLowercase: true,
      isNumber: true,
      isSymbol: true,
    };
    let isValid = true;

    // password length should be at least 6 characters
    if (value.length < 6) {
      isValid = false;
      validationState.length = false;
    }

    // password should contain at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      isValid = false;
      validationState.isUppercase = false;
    }

    // password should contain at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      isValid = false;
      validationState.isLowercase = false;
    }

    // password should contain at least one digit
    if (!/\d/.test(value)) {
      isValid = false;
      validationState.isNumber = false;
    }

    // password should contain at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      isValid = false;
      validationState.isSymbol = false;
    }

    setPasswordRule(validationState);
    return isValid;
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover" />
      <div className="w-1/2 h-full flex justify-center items-center relative">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          {!success ? (
            <>
              <div className="font-extrabold text-neutral-900 text-4xl">
                Reset Password
              </div>
              <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
                <>
                  <Layout fields={passwordField} className="mb-4" />
                  <PasswordPolicy
                    policyName="Must have atleast 6 characters"
                    isChecked={passwordRule.length}
                  />
                  <PasswordPolicy
                    policyName="Must have atleast 1 Lowercase letter"
                    isChecked={passwordRule.isLowercase}
                  />
                  <PasswordPolicy
                    policyName="Must have atleast 1 Uppercase letter"
                    isChecked={passwordRule.isUppercase}
                  />
                  <PasswordPolicy
                    policyName="Must have atleast 1 number"
                    isChecked={passwordRule.isNumber}
                  />
                  <PasswordPolicy
                    policyName="Must have atleast 1 symbol"
                    isChecked={passwordRule.isSymbol}
                  />
                  <Layout fields={confirmPasswordField} />
                  <Button
                    type={Type.Submit}
                    label={'Reset Password'}
                    className="w-full mt-8"
                    loading={resetPasswordMutation.isLoading}
                    disabled={!isValid}
                  />
                </>
              </form>
            </>
          ) : (
            <>
              <div className="text-center flex justify-center items-center flex-col space-y-9">
                <Success />
                <div className="text-neutral-900">
                  Password has been successfully reset
                </div>
              </div>
              <Link to="/login">
                <Button label={'Sign In Now'} className="w-full mt-8" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
