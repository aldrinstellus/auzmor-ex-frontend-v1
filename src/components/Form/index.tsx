import React from 'react';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import Password from 'components/Password';
import SingleSelect from 'components/Select';

export enum FieldType {
  Input = 'INPUT',
  Password = 'PASSWORD',
  Select = 'SELECT',
  MultiSelect = 'MULTISELECT',
  Checkbox = 'CHECKBOX',
  Radio = 'RADIO',
}

const fieldMap: Record<string, any> = {
  [FieldType.Input]: Input,
  [FieldType.Select]: SingleSelect,
  //  [FieldType.Radio]: RadioButtonGroup,
  [FieldType.Checkbox]: Checkbox,
  [FieldType.Password]: Password,
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
