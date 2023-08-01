import Header from 'components/ModalHeader';
import React, { useContext } from 'react';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import Body from './Body';
import * as yup from 'yup';
import { FieldType } from 'components/Form';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { afterXUnit } from 'utils/time';
import { Variant } from 'components/Input';
import { Variant as ButtonVariant, Type } from 'components/Button';
import Button from 'components/Button';

type CreatePollProps = {
  closeModal: () => void;
};

export type PollOption = {
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

const CreatePoll: React.FC<CreatePollProps> = ({ closeModal }) => {
  const { setActiveFlow } = useContext(CreatePostContext);

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
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
      variant: Variant.Text,
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Form submitted!');
        console.log(getValues());
        handleSubmit(onSubmit);
      }}
    >
      <Header
        title="Create a poll"
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={closeModal}
      />
      <Body
        control={control}
        questionField={questionField}
        fields={fields}
        errors={errors}
        durationFields={durationFields}
        datePickerField={datePickerField}
        selectedDuration={selectedDuration}
        append={append}
        remove={remove}
      />
      <div className="bg-blue-50 flex items-center justify-end p-3 gap-x-3 rounded-9xl w-full">
        <Button label="Back" variant={ButtonVariant.Secondary} />
        <Button
          label="Next"
          variant={ButtonVariant.Secondary}
          type={Type.Submit}
        />
      </div>
    </form>
  );
};

export default CreatePoll;
