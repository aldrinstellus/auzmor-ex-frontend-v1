import React, { useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { DatePicker } from 'antd';
import './index.css';
import Icon from 'components/Icon';
import clsx from 'clsx';

export interface IDatePickerInputProps {
  name: string;
  label?: string;
  className?: string;
  control?: Control<Record<string, any>>;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  defaultValue?: string;
  dataTestId?: string;
  onDateChange?: (date: any) => void;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  control,
  name,
  label = '',
  minDate,
  maxDate,
  className,
  onDateChange,
  dataTestId,
  error,
}) => {
  const { field } = useController({
    name,
    control,
  });

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

  return (
    <div data-testid={dataTestId} className="relative">
      {!!label && <div className={labelStyle}>{label}</div>}
      <DatePicker
        aria-label="Toggle Calendar"
        allowClear={false}
        format="MM/DD/YYYY"
        data-testid={dataTestId}
        placeholder="MM/DD/YYYY"
        value={field.value}
        suffixIcon={<Icon name="calendarTwo" size={16} />}
        className={`flex border relative rounded-19xl w-full px-5 py-2.5 focus:!border-primary-500 hover:border-primary-500 ${className}`}
        onChange={(date) => {
          // Set all time components to 0
          date?.set('hour', 0);
          date?.set('minute', 0);
          date?.set('second', 0);
          date?.set('millisecond', 0);

          // Call onChange functions
          field.onChange(date);
          if (date) onDateChange?.(date);
        }}
        disabledDate={(d) =>
          !d || d.isAfter(maxDate) || d.isSame(minDate) || d.isBefore(minDate)
        }
        id="react-date-picker-calendar"
      />
      {!!error && (
        <div className={`absolute -bottom-4 text-xs truncate leading-tight`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
