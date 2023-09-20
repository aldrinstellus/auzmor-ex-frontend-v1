import clsx from 'clsx';
import { FC, ReactNode, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

export interface IRadioListOption {
  data: Record<string, any>;
  dataTestId: string;
}

type RadioButtonProps = {
  name: string;
  control: Control<Record<string, any>>;
  radioList: IRadioListOption[];
  labelRenderer: (option: IRadioListOption) => ReactNode;
  className?: string;
  rowClassName?: string;
};

const RadioGroup: FC<RadioButtonProps> = ({
  name,
  control,
  radioList = [],
  labelRenderer,
  className = '',
  rowClassName = '',
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
        <>
          <div key={index} className={rowStyle}>
            <input
              id={option.data.id}
              type="radio"
              data-testid={option.dataTestId}
              className="w-5 h-5 accent-primary-600"
              onChange={(_e) => {
                field.onChange(option);
              }}
              name={name}
              value={field?.value?.data?.id}
              checked={option.data.id === field?.value?.data?.id}
            />
            <label htmlFor={option.data.id}>{labelRenderer(option)}</label>
          </div>
        </>
      ))}
    </div>
  );
};

export default RadioGroup;
