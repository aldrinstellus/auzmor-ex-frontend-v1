import clsx from 'clsx';
import Divider from 'components/Divider';
import React, { useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

type RadioButtonProps = {
  name: string;
  id?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  options?: Record<string, any>;
  radioList?: Array<Record<string, any>>;
};

const RadioGroup: React.FC<RadioButtonProps> = ({
  name,
  id,
  disabled = false,
  dataTestId = '',
  error,
  control,
  options,
  radioList,
}) => {
  const { field } = useController({
    name,
    control,
  });

  const radioStyles = useMemo(
    () =>
      clsx({
        'border-1 border-neutral-200 focus:outline-none cursor-pointer': true,
      }),
    [error],
  );

  return (
    <>
      <div className="pt-3">
        <div className="flex flex-col">
          {radioList?.map((item, index) => (
            <>
              <div key={index} className=" space-x-4 pb-2 pt-2 pl-6">
                <input
                  id={id}
                  name={name}
                  type="radio"
                  className={radioStyles}
                  disabled={disabled}
                  data-testid={`${name}-${item?.name}`}
                  ref={field.ref}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={item?.options?.value}
                  checked={item?.isChecked}
                />
                <label htmlFor={item?.options?.label}>
                  {item?.options?.label}
                </label>
              </div>
              <Divider />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default RadioGroup;
