import React from 'react';
import timezones from 'utils/timezones.json';
import Layout, { FieldType } from 'components/Form';
import { getTimezoneNameFromIANA } from 'utils/time';

export type OptionType = {
  label: string;
  value: string;
};

export type SelectTimeZoneProps = {
  control: any;
  className?: string;
  defaultTimezone: OptionType;
  placeholder?: string;
  dataTestId?: string;
  label?: string;
  name?: string;
};

const SelectTimeZone: React.FC<SelectTimeZoneProps> = ({
  control,
  className,
  defaultTimezone,
  placeholder,
  dataTestId,
  label = '',
  name = 'timeZone',
}) => {
  const fields = [
    {
      type: FieldType.SingleSelect,
      label,
      name: name,
      control: control,
      options: timezones.map((timeZone) => ({
        label: getTimezoneNameFromIANA(timeZone.iana),
        value: timeZone.iana,
      })),
      defaultValue: defaultTimezone || '',
      placeholder: placeholder,
      dataTestId: dataTestId,
    },
  ];

  return (
    <div className="w-full">
      <form>
        <Layout className={className} fields={fields} />
      </form>
    </div>
  );
};

export default SelectTimeZone;
