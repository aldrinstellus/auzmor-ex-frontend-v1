import React, { useEffect } from 'react';
import { Logo } from 'components/Logo';
import WelcomeOffice from 'images/welcomeToOffice.png';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from 'queries/account';
import 'utils/custom-yup-validators/email/validateEmail';

interface IForgotPasswordProps {}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup.string().required().validateEmail(),
});

const ForgotPassword: React.FC<IForgotPasswordProps> = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation((formData: any) =>
    forgotPassword(formData),
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    forgotPasswordMutation.reset();
  }, [watch('email')]);

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full',
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: errors.email?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];

  const onSubmit = (formData: IForm) => {
    forgotPasswordMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <img
        src={WelcomeOffice}
        className="h-full w-[48%]"
        data-testid="forgot-password-cover-image"
        alt="Welcome to Auzmor Office"
      />
      <div className="w-[52%] h-full flex justify-center items-center relative bg-white overflow-y-auto">
        <div
          className="absolute top-8 right-8"
          data-testid="forgot-password-logo-image"
        >
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          {forgotPasswordMutation.isSuccess ? (
            <>
              <div
                className="text-center flex justify-center items-center flex-col space-y-9"
                data-testid="forgot-password-success-message"
              >
                <Success />
                <div>
                  Email has been sent to <b>{getValues().email}</b> with
                  instructions on resetting your password.
                </div>
              </div>
              <Button
                label={'Back to Sign In'}
                className="w-full mt-8"
                onClick={() => navigate('/login')}
                size={Size.Large}
              />
            </>
          ) : (
            <>
              <div className="font-extrabold text-neutral-900 text-4xl">
                Forgot Password
              </div>
              <form
                className="mt-16"
                onSubmit={handleSubmit(onSubmit)}
                data-testid="forgot-password-form"
              >
                <Layout fields={fields} />
                <Button
                  type={Type.Submit}
                  label={'Reset Via Email'}
                  loading={forgotPasswordMutation.isLoading}
                  className="w-full mt-8"
                  size={Size.Large}
                  disabled={!isValid}
                  data-testid="forgot-password-submit"
                />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
