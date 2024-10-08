import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import { IPoll } from 'interfaces';
import { FC } from 'react';
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
const OptionRow: FC<OptionRowProps> = ({
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
            control,
            dataTestId: `createpoll-option${index + 1}`,
            errorDataTestId: `createpoll-option${index + 1}-error`,
            label: `Option ${index + 1}`,
            error: errors.options
              ? errors.options?.[index]?.text?.message
              : undefined,
            inputClassName: 'py-3 text-sm font-medium',
            customLabelRightElement:
              index > 1 ? (
                <button
                  className="font-normal text-neutral-500 text-sm"
                  onClick={() => remove(index)}
                  data-testid={`createpoll-option${index + 1}-remove`}
                >
                  remove
                </button>
              ) : undefined,
          },
        ]}
      />
    </div>
  );
};

export default OptionRow;
