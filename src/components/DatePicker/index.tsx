import React, { memo, useMemo } from 'react';
import { Control, Controller, useController } from 'react-hook-form';

import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { Value as DateValue } from 'react-date-picker/dist/cjs/shared/types';

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
  portalContainer?: HTMLElement | null;
  calendarClassName?: string;
  dataTestId?: string;
  onDateChange?: (date: DateValue) => void;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  control,
  name,
  label = '',
  minDate,
  maxDate,
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
      <Controller
        name={field.name}
        control={control}
        render={({
          field: { onChange, name, value },
          fieldState: { invalid, isDirty },
          formState: { errors },
        }) => (
          <DatePicker
            autoFocus={true}
            calendarAriaLabel="Toggle Calendar"
            clearAriaLabel={'Clear value'}
            calendarClassName={calendarClassName}
            calendarIcon={<Icon name="calendarTwo" size={16} />}
            className={`flex border relative rounded-19xl w-full px-5 py-2.5 focus:!border-primary-500 hover:border-primary-500 ${className}`}
            clearIcon={null}
            data-testid={dataTestId}
            value={value || defaultValue}
            onChange={(date: DateValue) => {
              onChange(date);
              onDateChange && onDateChange(date);
            }}
            format="dd/MM/yyyy"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
            minDate={minDate}
            maxDate={maxDate}
            portalContainer={portalContainer}
            id="react-date-picker-calendar"
          />
        )}
      />
      {!!error && (
        <div className={`absolute -bottom-4 text-xs truncate leading-tight`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(DatePickerInput);
