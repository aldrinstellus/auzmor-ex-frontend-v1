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
  onChange?: (data: UseFormGetValues<any>, e: React.ChangeEvent) => void;
  getValues?: UseFormGetValues<any>;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  onChange,
  className = '',
  dataTestId = '',
  loading = false,
  disabled = false,
  defaultValue = false,
  label = '',
  control,
  getValues,
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
        onChange={(e) => {
          field.onChange(e);
          onChange?.(getValues?.(field.name), e);
        }}
        {...rest}
      />
      {label && <div className="text-text-medium text-sm">{label}</div>}
    </label>
  );
};

export default Checkbox;
