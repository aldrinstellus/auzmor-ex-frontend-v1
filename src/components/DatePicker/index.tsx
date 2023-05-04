import React from 'react';
import { Control, Controller } from 'react-hook-form';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import Icon from 'components/Icon';
import { Value as DateValue } from 'react-date-picker/dist/cjs/shared/types';

export interface IDatePickerInputProps {
  name: string;
  className?: string;
  control?: Control<Record<string, any>>;
  minDate?: Date;
  defaultValue?: string;
  portalContainer?: HTMLElement | null;
  onDateChange?: (date: DateValue) => void;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  control,
  name,
  minDate,
  defaultValue,
  portalContainer = null,
  onDateChange,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({
        field: { onChange, name, value },
        fieldState: { invalid, isDirty }, //optional
        formState: { errors }, //optional, but necessary if you want to show an error message
      }) => (
        <>
          <DatePicker
            value={value}
            onChange={(date: DateValue) => {
              onChange(date);
              onDateChange && onDateChange(date);
            }}
            className="flex border rounded-19xl w-full px-5 py-2.5"
            calendarIcon={<Icon name="calendarTwo" size={16} />}
            format="dd/MM/yyyy"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
            clearIcon={null}
            minDate={minDate}
            portalContainer={portalContainer}
          />
          {errors && errors[name] && errors[name]?.message === 'required' && (
            <span>your error message !</span>
          )}
        </>
      )}
    />
  );
};

export default DatePickerInput;
