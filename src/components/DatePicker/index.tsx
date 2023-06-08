import React, { useMemo } from 'react';
import { Control, Controller, useController } from 'react-hook-form';
// import DatePicker from 'react-date-picker';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './index.css';

import Icon from 'components/Icon';
import clsx from 'clsx';
// import { Value as DateValue } from 'react-date-picker/dist/cjs/shared/types';

export interface IDatePickerInputProps {
  name: string;
  label?: string;
  className?: string;
  control?: Control<Record<string, any>>;
  minDate?: Date;
  placeholder?: string;
  error?: string;
  defaultValue?: string;
  portalContainer?: HTMLElement | null;
  calendarClassName?: string;
  dataTestId?: string;
  onDateChange?: (date: Date) => void;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  control,
  name,
  label = '',
  minDate,
  placeholder = 'MM/DD/YYYY',
  defaultValue,
  portalContainer = null,
  className,
  calendarClassName,
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
        selected={field.value}
        onChange={field.onChange}
        calendarClassName={calendarClassName}
        data-testid={dataTestId}
        className={`flex border relative rounded-19xl w-full px-5 py-2.5 focus:!border-primary-500 hover:border-primary-500 ${className}`}
        minDate={minDate}
        portalId="root"
        placeholderText={placeholder}
        popperProps={{
          positionFixed: true,
          strategy: 'fixed',
        }}
      />
      <div className="absolute right-4 top-[calc(50%-8px)]">
        <Icon name="calendarTwo" size={16} />
      </div>
      {!!error && (
        <div className={`absolute -bottom-4 text-xs truncate leading-tight`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
