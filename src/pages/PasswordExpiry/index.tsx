import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Info } from 'components/Logo';

export interface IPasswordExpiryProps {}

const PasswordExpiry: FC<IPasswordExpiryProps> = () => {
  const { t } = useTranslation('auth', { keyPrefix: 'passwordExpiry' });

  return (
    <div className="h-full flex justify-center relative">
      <div className="flex relative h-[362px]">
        <div className="w-full">
          <>
            <div className="text-center flex justify-center items-center flex-col">
              <Info />
              <div className="text-neutral-900 text-2xl font-extrabold mt-2">
                {t('title')}
              </div>
            </div>
            <div className="text-neutral-900 text-center text-sm font-normal mt-2">
              {t('description')}
            </div>
            <div className="mt-12 text-neutral-500 text-sm font-normal text-center">
              {t('resendText')}{' '}
              <Link
                to="/forgot-password"
                className="text-primary-500 text-sm font-bold"
              >
                {t('resendLink')}
              </Link>
            </div>
          </>
        </div>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center">
        <div className="text-neutral-900 text-sm font-normal text-center">
          {t('rememberPasswordText')}{' '}
          <Link to="/login" className="text-primary-500 font-bold">
            {t('signInLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordExpiry;
