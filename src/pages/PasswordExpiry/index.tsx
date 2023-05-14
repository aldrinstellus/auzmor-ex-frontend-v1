import { Info, Logo } from 'components/Logo';
import React from 'react';
import { Link } from 'react-router-dom';

export interface IPasswordExpiryProps {}

const PasswordExpiry: React.FC<IPasswordExpiryProps> = () => {
  return (
    <>
      <div className="bg-[url(images/welcomeToAuzmor.png)] w-1/2 h-full bg-no-repeat bg-cover" />
      <div className="h-full flex justify-center items-center relative">
        <div className="w-full">
          <>
            <div className="text-center flex justify-center items-center flex-col">
              <Info />
              <div className="text-neutral-900 text-2xl font-extrabold mt-9">
                RESET PASSWORD LINK HAS EXPIRED
              </div>
            </div>
            <div className="text-neutral-900 text-center text-sm font-normal mt-2">
              To protect your account, password reset link expires after 10
              mins.
            </div>
            <div className="mt-12 text-neutral-500 text-sm font-bold text-center">
              Need a new account activation link?{' '}
              <Link
                to="/forgot-password"
                className="text-primary-500 text-sm font-bold"
              >
                Resend
              </Link>
            </div>
            <div className="mt-60 text-neutral-900 text-sm font-bold text-center">
              Remeber Password?{' '}
              <Link to="/login" className="text-primary-500 text-sm font-bold">
                Sign In
              </Link>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default PasswordExpiry;
