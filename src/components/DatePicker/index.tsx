import React, { useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { DatePicker } from 'antd';
import './index.css';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

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
  disabled?: boolean;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  control,
  name,
  label = '',
  disabled = false,
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
          'text-sm text-neutral-900 font-bold truncate mb-1': true,
        },
      ),
    [error],
  );

  // Custom function that handles the mess of working with Date and Dayjs date formats
  const getDateInMMDDYYYY = (date: Date | Dayjs) => {
    let finalDate: Date;

    if (date instanceof Date) {
      finalDate = new Date(date);
    } else {
      finalDate = new Date(date.toDate());
    }

    const day =
      finalDate.getDate() < 10
        ? '0' + finalDate.getDate()
        : finalDate.getDate();
    const month =
      finalDate.getMonth() + 1 < 10
        ? '0' + (finalDate.getMonth() + 1)
        : finalDate.getMonth() + 1;
    const year = finalDate.getFullYear();

    return `${month}/${day}/${year}`;
  };

  return (
    <div data-testid={dataTestId} className="relative">
      {!!label && <div className={labelStyle}>{label}</div>}
      <DatePicker
        aria-label="Toggle Calendar"
        format="MM/DD/YYYY"
        data-testid={dataTestId}
        placeholder="MM/DD/YYYY"
        value={
          field.value
            ? dayjs(getDateInMMDDYYYY(field.value), 'MM/DD/YYYY')
            : minDate
            ? dayjs(getDateInMMDDYYYY(minDate), 'MM/DD/YYYY')
            : undefined
        }
        className={clsx(
          `flex border relative rounded-19xl w-full px-5 py-2.5 focus:!border-primary-500 hover:border-primary-500`,
          { 'cursor-not-allowed': disabled },
          {
            [`${className}`]: true,
          },
        )}
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
          !d ||
          (minDate ? d.isSame(minDate) : false) ||
          (minDate ? d.isBefore(minDate) : false) ||
          (maxDate ? d.isAfter(maxDate) : false)
        }
        disabled={disabled}
        showToday={
          minDate
            ? dayjs(minDate).isBefore(new Date().setHours(0, 0, 0, 0))
            : false
        }
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
