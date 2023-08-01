import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';
import React from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { afterXUnit } from 'utils/time';
import Button, { Variant } from 'components/Button';
import OptionRow from './Option';

type PollOption = {
  value: string;
};

export type PollForm = {
  question: string;
  options: PollOption[];
  duration: any;
};

const schema = yup.object({
  question: yup
    .string()
    .required('Required field')
    .min(3, 'Question must have minimum 3 characters')
    .max(140, 'Question cannot exceed 140 characters'),

  options: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required('Option cannot be empty')
        .max(30, 'Option cannot exceed 30 characters'),
    }),
  ),
  duration: yup.string().required('Required field'),
});

const Body: React.FC = () => {
  // Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PollForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      question: '',
      options: [
        {
          value: '',
        },
        {
          value: '',
        },
      ],
      duration: {
        label: '1 Week',
        value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
        dataTestId: 'poll-duration-1week',
      },
    },
  });

  // Poll options form
  const { fields, append, remove } = useFieldArray({
    name: 'options',
    control,
    rules: {
      minLength: 2,
      maxLength: 10,
    },
  });

  const onSubmit = (data: PollForm) => console.log(data);

  const selectedDuration: any = watch('duration');

  const questionField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'ex. What is your favourite kind of cookie',
      name: 'question',
      label: 'Question*',
      error: errors.question?.message,
      dataTestId: 'poll-question',
      errorDataTestId: 'poll-invalid-question-msg',
      control,
    },
  ];

  const durationFields = [
    {
      type: FieldType.SingleSelect,
      label: 'Poll duration*',
      name: 'duration',
      control,
      options: [
        {
          label: '1 Day',
          value: afterXUnit(1, 'days').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'poll-duration-1day',
        },
        {
          label: '3 Days',
          value: afterXUnit(3, 'days').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'poll-duration-3days',
        },
        {
          label: '1 Week',
          value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'poll-duration-1week',
        },
        {
          label: '2 Weeks',
          value: afterXUnit(2, 'weeks').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'poll-duration-2weeks',
        },
        {
          label: 'Custom Date',
          value: '',
          dataTestId: 'poll-duration-customdate',
        },
      ],
      placeholder: 'Select Poll Duration',
      dataTestId: 'poll-duration-dropdown',
    },
  ];

  const datePickerField = [
    {
      type: FieldType.DatePicker,
      name: 'duration-date',
      control,
      minDate: new Date(afterXUnit(1, 'day').toISOString()),
      dataTestId: 'custom-date-calendar',
    },
  ];

  return (
    <div className="px-4 py-6 max-h-[510px] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
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
      </form>
    </div>
  );
};

export default Body;
