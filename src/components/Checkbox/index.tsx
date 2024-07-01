/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import { ChangeEvent, FC, ReactElement, useMemo } from 'react';
import { useController } from 'react-hook-form';

export type CheckboxProps = {
  name: string;
  label?: ReactElement | string;
  className?: string;
  inputClassName?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
  control?: any;
  defaultValue?: boolean;
  labelDescription?: string;
  transform?: {
    input: (value: any) => boolean;
    output: (e: ChangeEvent<HTMLInputElement>) => any;
  };
  defaultChecked?: boolean;
  labelClassName?: string;
  labelContainerClassName?: string;
};

const Checkbox: FC<CheckboxProps> = ({
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
  inputClassName,
  labelClassName = '',
  labelContainerClassName = '',
  ...rest
}) => {
  const { field } = useController({ name, control });

  const styles = clsx(
    { 'flex items-center justify-between': true },
    { [className]: true },
  );

  const lableContainerStyles = useMemo(
    () => clsx({ 'pl-2': true }, { [labelContainerClassName]: true }),
    [labelContainerClassName],
  );

  const id = `checkbox-id-${Math.random().toString(16).slice(2)}`;

  const lableStyle = useMemo(
    () =>
      clsx({
        'font-semibold text-sm cursor-pointer': true,
        [labelClassName]: true,
      }),
    [labelClassName],
  );

  return (
    <div className="flex items-center">
      <label className={styles} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className={`h-5 w-5 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600 ${inputClassName}`}
          name={field.name}
          ref={field.ref}
          disabled={loading || disabled}
          data-testid={dataTestId}
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
        {label && (
          <div className={lableContainerStyles}>
            <div className={lableStyle}>{label}</div>
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
