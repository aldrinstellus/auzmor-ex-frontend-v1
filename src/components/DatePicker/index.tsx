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
  placeholder,
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
    <div data-testid={dataTestId}>
      {!!label && <div className={labelStyle}>{label}</div>}
      <DatePicker
        selected={field.value}
        onChange={field.onChange}
        calendarClassName={calendarClassName}
        data-testid={dataTestId}
        className={`flex border relative z-[99999] rounded-19xl w-full px-5 py-2.5 ${className}`}
        // calendarIcon={<Icon name="calendarTwo" size={16} />}
        // format="dd/MM/yyyy"
        // dayPlaceholder="DD"
        // monthPlaceholder="MM"
        // yearPlaceholder="YYYY"
        // clearIcon={null}
        // dateFormat="MM/DD/YYYY"
        minDate={minDate}
        // portalContainer={portalContainer}
        portalId="root"
        placeholderText={placeholder}
        popperProps={{
          positionFixed: true,
          strategy: 'fixed',
        }}
      />
      {!!error && (
        <div className={`absolute -bottom-4 text-xs truncate leading-tight`}>
          {error}
        </div>
      )}
    </div>
  );

  // return (
  //   <Controller
  //     control={control}
  //     name={name}
  //     defaultValue={defaultValue}
  //     render={({
  //       field: { onChange, name, value },
  //       fieldState: { invalid, isDirty }, //optional
  //       formState: { errors }, //optional, but necessary if you want to show an error message
  //     }) => (
  //       <>
  //         <DatePicker
  //           value={value}
  //           onChange={(date) => {
  //             console.log('>>>>', date);
  //             // onChange(date);
  //             // onDateChange && onDateChange(date);
  //           }}
  //           wrapperClassName="relative z-[9999]"
  //           calendarClassName={calendarClassName}
  //           className={`flex border relative z-[99999] rounded-19xl w-full px-5 py-2.5 ${className}`}
  //           // calendarIcon={<Icon name="calendarTwo" size={16} />}
  //           // format="dd/MM/yyyy"
  //           // dayPlaceholder="DD"
  //           // monthPlaceholder="MM"
  //           // yearPlaceholder="YYYY"
  //           // clearIcon={null}
  //           minDate={minDate}
  //           // portalContainer={portalContainer}
  //           portalId="root"
  //           popperProps={{
  //             positionFixed: true,
  //             strategy: 'fixed',
  //           }}
  //         />
  //         {errors && errors[name] && errors[name]?.message === 'required' && (
  //           <span>your error message !</span>
  //         )}
  //       </>
  //     )}
  //   />
  // );
};

export default DatePickerInput;
