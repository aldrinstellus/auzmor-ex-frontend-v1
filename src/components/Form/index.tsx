import React from 'react';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import Password from 'components/Password';
import SingleSelect from 'components/SingleSelect';
import DatePickerInput from 'components/DatePicker';
import TextArea from 'components/TextArea';

export enum FieldType {
  Input = 'INPUT',
  Password = 'PASSWORD',
  SingleSelect = 'SELECT',
  MultiSelect = 'MULTISELECT',
  Checkbox = 'CHECKBOX',
  Radio = 'RADIO',
  DatePicker = 'DATEPICKER',
  TextArea = 'TEXTAREA',
}

const fieldMap: Record<string, any> = {
  [FieldType.Input]: Input,
  [FieldType.SingleSelect]: SingleSelect,
  // [FieldType.Radio]: RadioButtonGroup,
  [FieldType.Checkbox]: Checkbox,
  [FieldType.Password]: Password,
  [FieldType.DatePicker]: DatePickerInput,
  [FieldType.TextArea]: TextArea,
};

export type LayoutProps = {
  fields: Array<Record<string, any>>;
  className?: string;
};

const Layout: React.FC<LayoutProps> = ({ fields, className = 'space-y-8' }) => {
  return (
    <div className={className}>
      {fields.map((field, index) => {
        const Component = fieldMap[field.type];
        return <Component key={index} {...field} />;
      })}
    </div>
  );
};

export default Layout;
