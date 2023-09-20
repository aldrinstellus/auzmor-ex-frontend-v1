import { FC, useMemo } from 'react';
import { Check } from '../Logo/';
import clsx from 'clsx';
import Icon from 'components/Icon';

export interface IPasswordPolicyProps {
  policyName: any;
  isChecked?: boolean;
  className?: string;
  dataTestId?: string;
}

const PasswordPolicy: FC<IPasswordPolicyProps> = ({
  policyName,
  isChecked,
  // className,
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
          'bg-red-500': !isChecked,
        },
        {
          'border-neutral-50': !isChecked,
        },
      ),
    [isChecked],
  );

  return (
    <div className="flex justify-start items-center space-x-4">
      <div className={checkStyles} data-testid={dataTestId}>
        {isChecked ? (
          <Check />
        ) : (
          <Icon name="closeCircle" size={24} color="text-white" hover={false} />
        )}
      </div>
      <div>{policyName}</div>
    </div>
  );
};

export default PasswordPolicy;
