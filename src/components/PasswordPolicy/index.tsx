import React, { useMemo, useState } from 'react';
import { Check } from '../Logo/';
import clsx from 'clsx';
import { string } from 'yup';

export interface IPasswordPolicyProps {
  policyName: any;
  isChecked?: boolean;
  className?: string;
  dataTestId?: string;
}

const PasswordPolicy: React.FC<IPasswordPolicyProps> = ({
  policyName,
  isChecked,
  className,
  dataTestId,
}) => {
  const checkStyles = useMemo(
    () =>
      clsx(
        {
          'h-4 w-4 rounded-full flex justify-center items-center': true,
        },
        {
          'bg-primary-500': isChecked,
        },
        {
          'border border-2 border-neutral-50': !isChecked,
        },
      ),
    [isChecked],
  );

  return (
    <div className="flex justify-start items-center space-x-4">
      <div className={checkStyles} data-testid={dataTestId}>
        {isChecked && <Check />}
      </div>
      <div>{policyName}</div>
    </div>
  );
};

export default PasswordPolicy;
