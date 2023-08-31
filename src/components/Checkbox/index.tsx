import clsx from 'clsx';
import React, { ReactElement } from 'react';
import { useController } from 'react-hook-form';

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
  transform?: {
    input: (value: any) => boolean;
    output: (e: React.ChangeEvent<HTMLInputElement>) => any;
  };
  defaultChecked?: boolean;
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
  transform,
  defaultChecked,
  ...rest
}) => {
  const { field } = useController({ name, control });

  const styles = clsx(
    { 'flex items-start justify-between': true },
    { [className]: true },
  );

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="h-5 w-5 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600"
        name={field.name}
        ref={field.ref}
        disabled={loading || disabled}
        onChange={(e) =>
          field.onChange(transform?.output ? transform?.output(e) : e)
        }
        checked={
          transform?.input
            ? transform?.input(field.value || defaultChecked)
            : field.value || defaultChecked
        }
        {...rest}
      />
      <label className={styles} data-testid={dataTestId}>
        {label && (
          <div className="pl-2">
            <div className="font-semibold text-sm cursor-pointer">{label}</div>
            {labelDescription && (
              <div className="font-normal text-xs text-neutral-500">
                {labelDescription}
              </div>
            )}
          </div>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
