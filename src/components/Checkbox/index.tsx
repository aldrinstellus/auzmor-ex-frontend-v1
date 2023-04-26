import React from 'react';
import { UseFormGetValues, useController } from 'react-hook-form';

export type CheckboxProps = {
  name: string;
  label?: string;
  className?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
  control?: any;
  defaultValue?: boolean;
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
  ...rest
}) => {
  const { field } = useController({ name, control });
  return (
    <label className={className} data-testid={dataTestId}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded-xl cursor-pointer accent-primary-500"
        name={field.name}
        ref={field.ref}
        disabled={loading || disabled}
        defaultChecked={defaultValue}
        onChange={field.onChange}
        {...rest}
      />
      {label && (
        <div className="text-text-medium text-sm ml-1 relative bottom-[2px]">
          {label}
        </div>
      )}
    </label>
  );
};

export default Checkbox;
