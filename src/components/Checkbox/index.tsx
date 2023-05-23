import clsx from 'clsx';
import React, { ReactElement } from 'react';
import { UseFormGetValues, useController } from 'react-hook-form';

export type CheckboxProps = {
  name: string;
  label?: ReactElement | string;
  className?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
  control?: any;
  defaultValue?: boolean;
  labelDescription?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  className = '',
  dataTestId = '',
  loading = false,
  disabled = false,
  defaultValue = false,
  label = '',
  control,
  labelDescription,
  ...rest
}) => {
  const { field } = useController({ name, control });

  const styles = clsx(
    { 'flex items-start justify-between': true },
    { [className]: true },
  );

  return (
    <label className={styles} data-testid={dataTestId}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600"
        name={field.name}
        ref={field.ref}
        disabled={loading || disabled}
        defaultChecked={defaultValue}
        onChange={field.onChange}
        {...rest}
      />
      {label && (
        <div className="pl-4 -mt-1">
          <div className="font-medium text-sm cursor-pointer">{label}</div>
          {labelDescription && (
            <div className="font-normal text-xs text-neutral-500">
              {labelDescription}
            </div>
          )}
        </div>
      )}
    </label>
  );
};

export default Checkbox;
