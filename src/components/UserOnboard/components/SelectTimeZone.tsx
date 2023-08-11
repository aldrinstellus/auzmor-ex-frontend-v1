import React from 'react';
import timezones from 'utils/timezones.json';
import Layout, { FieldType } from 'components/Form';

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
        label: timeZone.timezoneName,
        value: timeZone.iana,
        dataTestId: `professional-detail-timezone-${timeZone.iana}`,
      })),
      defaultValue: defaultTimezone || '',
      menuPlacement: 'top',
      placeholder: placeholder,
      dataTestId: dataTestId,
    },
  ];

  return (
    <form>
      <Layout className={className} fields={fields} />
    </form>
  );
};

export default SelectTimeZone;
