import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { PollForm } from './Body';

export type OptionRowProps = {
  field: FieldArrayWithId<PollForm, 'options', 'id'>;
  errors: FieldErrors<PollForm>;
  index: number;
  control: Control<PollForm, any>;
  remove: UseFieldArrayRemove;
  className?: string;
};
const OptionRow: React.FC<OptionRowProps> = ({
  field,
  errors,
  index,
  control,
  remove,
  className,
}) => {
  return (
    <div key={field.id} className={className}>
      <Layout
        key={field.id}
        fields={[
          {
            type: FieldType.Input,
            InputVariant: Variant.Text,
            placeholder: 'Option',
            name: `options.${index}.value`,
            defaultValue: field.value,
            control,
            dataTestId: 'poll-option-value',
            label: `Option ${index + 1}`,
            error: errors.options
              ? errors.options?.[index]?.value?.message
              : undefined,
            customLabelRightElement:
              index > 1 ? (
                <button
                  className="font-medium text-neutral-500 text-sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              ) : undefined,
          },
        ]}
      />
    </div>
  );
};

export default OptionRow;
