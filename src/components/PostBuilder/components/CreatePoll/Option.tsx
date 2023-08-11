import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import { IPoll } from 'contexts/CreatePostContext';
import React from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
} from 'react-hook-form';

export type OptionRowProps = {
  field: FieldArrayWithId<IPoll, 'options', 'id'>;
  errors: FieldErrors<IPoll>;
  index: number;
  control: Control<IPoll, any>;
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
            name: `options.${index}.text`,
            defaultValue: field.text,
            control,
            dataTestId: 'poll-option-text',
            label: `Option ${index + 1}`,
            error: errors.options
              ? errors.options?.[index]?.text?.message
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
