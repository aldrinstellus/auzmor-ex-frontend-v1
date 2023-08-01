import Layout from 'components/Form';
import React from 'react';
import OptionRow from './Option';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { PollForm } from '.';
import Button, { Variant } from 'components/Button';

type PollBodyProps = {
  questionField: Record<string, any>[];
  fields: FieldArrayWithId<PollForm, 'options', 'id'>[];
  errors: FieldErrors<PollForm>;
  control: Control<PollForm, any>;
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<PollForm, 'options'>;
  durationFields: any;
  selectedDuration: any;
  datePickerField: any;
};

const Body: React.FC<PollBodyProps> = ({
  questionField,
  fields,
  errors,
  control,
  remove,
  append,
  durationFields,
  selectedDuration,
  datePickerField,
}) => {
  return (
    <div className="px-4 py-6 max-h-[510px] overflow-y-auto">
      <Layout fields={questionField} className="mb-5" />
      {fields.map((field, index) => (
        <OptionRow
          key={field.id}
          field={field}
          errors={errors}
          index={index}
          control={control}
          remove={remove}
          className="mb-6"
        />
      ))}
      <Button
        variant={Variant.Secondary}
        disabled={fields.length >= 10}
        label="+ Add another option"
        onClick={() => {
          if (fields.length < 10) {
            append({
              value: '',
            });
          } else {
            // Show error message
          }
        }}
      />
      <Layout fields={durationFields} className="pt-4" />
      {selectedDuration && selectedDuration.label === 'Custom Date' && (
        <Layout fields={datePickerField} className="pt-4" />
      )}
    </div>
  );
};

export default Body;
