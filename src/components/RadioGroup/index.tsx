import clsx from 'clsx';
import { ChangeEvent, FC, ReactNode, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

export interface IRadioListOptionData {
  value: string;
  [key: string]: any;
}
export interface IRadioListOption {
  data: IRadioListOptionData;
  dataTestId: string;
}

type RadioButtonProps = {
  name: string;
  control: Control<Record<string, any>>;
  radioList: IRadioListOption[];
  labelRenderer: (option: IRadioListOption) => ReactNode;
  className?: string;
  rowClassName?: string;
  transform?: {
    input: (value: any) => boolean;
    output: (e: ChangeEvent<HTMLInputElement>) => any;
  };
  disabled?: boolean;
};

const RadioGroup: FC<RadioButtonProps> = ({
  name,
  control,
  radioList = [],
  labelRenderer,
  className = '',
  rowClassName = '',
  transform,
  disabled = false,
}) => {
  const { field } = useController({
    name,
    control,
  });

  const style = useMemo(
    () => clsx({ 'flex flex-col': true, [className]: true }),
    [],
  );
  const rowStyle = useMemo(
    () =>
      clsx({
        'flex items-center': true,
        [rowClassName]: true,
      }),
    [],
  );
  return (
    <div className={style}>
      {radioList?.map((option, index) => (
        <div key={index} className={rowStyle}>
          <input
            data-testid={option.dataTestId}
            className="w-5 h-5 accent-primary-600"
            {...field}
            id={option.data.value}
            value={option.data?.value}
            onChange={(e) => {
              // field.onChange(transform?.output ? transform?.output(e) : e)
              const value = transform?.output
                ? transform?.output(e)
                : e.target.value;
              field.onChange(value);
              option.data.onChange && option.data.onChange(value);
            }}
            checked={
              transform?.input
                ? transform?.input(field.value)
                : field.value === option.data.value
            }
            disabled={disabled}
            type="radio"
          />
          <label htmlFor={option.data.value}>{labelRenderer(option)}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
