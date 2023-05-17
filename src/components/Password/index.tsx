import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import Icon from 'components/Icon';
import PasswordPolicy from 'components/PasswordPolicy';

export enum Size {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
}

export type PasswordProps = {
  name: string;
  id?: string;
  size?: Size;
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  onChange?: any;
  showChecks?: boolean;
};

const Password: React.FC<PasswordProps> = ({
  name,
  id,
  size = Size.Medium,
  defaultValue = '',
  placeholder = '',
  loading = false,
  disabled = false,
  className = '',
  dataTestId = '',
  error,
  helpText,
  control,
  label,
  onChange,
  showChecks = true,
}) => {
  const [show, setShow] = useState(false);
  const [validationChecks, setValidationChecks] = useState({
    length: false,
    isUppercase: false,
    isLowercase: false,
    isNumber: false,
    isSymbol: false,
  });

  const { field } = useController({
    name,
    control,
  });

  useEffect(() => {
    showChecks && validatePassword(field?.value);
  }, [field.value]);

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

    setValidationChecks(validationState);
    return isValid;
  };

  const inputStyles = useMemo(
    () =>
      clsx(
        {
          'focus:border-primary-500 focus:ring-primary-500': !error,
        },
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500':
            error,
        },
        {
          'py-2': size === Size.Small,
        },
        {
          'py-2.5': size === Size.Medium,
        },
        {
          'py-3': size === Size.Large,
        },
        {
          'bg-neutral-100': disabled,
        },
        {
          'w-full rounded-19xl border border-neutral-200 focus:outline-none pl-5 pr-11':
            true,
        },
      ),
    [error, size],
  );

  const labelStyle = useMemo(
    () =>
      clsx(
        {
          '!text-red-500': !!error,
        },
        {
          'text-sm text-neutral-900 font-bold truncate': true,
        },
      ),
    [error],
  );

  const helpTextStyles = useMemo(
    () =>
      clsx(
        {
          'text-red-500': error,
        },
        { 'text-neutral-500': helpText },
      ),
    [error, helpText],
  );

  return (
    <div className={`relative ${className}`}>
      <div className={labelStyle}>{label}</div>
      <label
        className={`flex justify-between flex-1 relative items-center my-1 w-full`}
        htmlFor={id}
      >
        <div className="flex relative items-center w-full">
          <input
            id={id}
            name={field.name}
            type={show ? 'text' : 'password'}
            className={inputStyles}
            disabled={loading || disabled}
            placeholder={placeholder}
            data-testid={dataTestId}
            defaultValue={defaultValue}
            ref={field.ref}
            onChange={(e: any) => {
              field.onChange(e);
              onChange && onChange(e);
            }}
            onBlur={field.onBlur}
          />
        </div>
        <div
          className="absolute right-5 cursor-pointer"
          onClick={() => setShow((t) => !t)}
        >
          <Icon
            name={show ? 'eyeSlashOutline' : 'eyeOutline'}
            size={16}
            className="cursor-pointer"
          />
        </div>
      </label>
      <div
        className={`absolute -bottom-4 text-xs truncate leading-tight ${helpTextStyles}`}
      >
        {error || helpText || ' '}
      </div>
      {!!field.value && showChecks && (
        <div>
          <PasswordPolicy
            policyName="Must have atleast 6 characters"
            isChecked={validationChecks.length}
          />
          <PasswordPolicy
            policyName="1 Number"
            isChecked={validationChecks.isNumber}
          />
          <PasswordPolicy
            policyName="1 Symbol"
            isChecked={validationChecks.isSymbol}
          />
          <PasswordPolicy
            policyName="1 Upper case letter"
            isChecked={validationChecks.isUppercase}
          />
          <PasswordPolicy
            policyName="1 Lower case letter"
            isChecked={validationChecks.isLowercase}
          />
        </div>
      )}
    </div>
  );
};

export default Password;
