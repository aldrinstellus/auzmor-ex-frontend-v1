import Layout from 'components/Form';
import React from 'react';
import OptionRow from './Option';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import Button, { Size, Variant } from 'components/Button';
import { IPoll } from 'contexts/CreatePostContext';

type PollBodyProps = {
  questionField: Record<string, any>[];
  fields: FieldArrayWithId<IPoll, 'options', 'id'>[];
  errors: FieldErrors<IPoll>;
  control: Control<IPoll, any>;
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<IPoll, 'options'>;
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
    <div className="p-6 max-h-[510px] overflow-y-auto text-neutral-900 text-sm font-medium flex flex-col gap-6">
      <Layout fields={questionField} />
      {fields.map((field, index) => (
        <OptionRow
          key={field.id}
          field={field}
          errors={errors}
          index={index}
          control={control}
          remove={remove}
        />
      ))}
      <Button
        variant={Variant.Secondary}
        size={Size.Small}
        disabled={fields.length >= 10}
        leftIcon="addOutline"
        iconColor="text-neutral-900"
        label="Add another option"
        dataTestId="createpoll-add-option"
        onClick={() => {
          if (fields.length < 10) {
            append({
              text: '',
            });
          } else {
            // Show error message
          }
        }}
      />
      <Layout fields={durationFields} />
      {selectedDuration && selectedDuration.label === 'Custom Date' && (
        <Layout fields={datePickerField} />
      )}
    </div>
  );
};

export default Body;
