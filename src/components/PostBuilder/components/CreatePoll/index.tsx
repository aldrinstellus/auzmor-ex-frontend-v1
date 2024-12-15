import Header from 'components/ModalHeader';
import { FC, useContext, useEffect } from 'react';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import Body from './Body';
import * as yup from 'yup';
import { FieldType } from 'components/Form';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { afterXUnit } from 'utils/time';
import { Variant } from 'components/Input';
import {
  Variant as ButtonVariant,
  Size as ButtonSize,
  Type,
} from 'components/Button';
import Button from 'components/Button';
import { PostType, IPoll } from 'interfaces';
import { useTranslation } from 'react-i18next';

type CreatePollProps = {
  closeModal: () => void;
};

const CreatePoll: FC<CreatePollProps> = ({ closeModal }) => {
  const { t } = useTranslation('postBuilder', { keyPrefix: 'createPoll' });
  const schema = yup.object({
    question: yup
      .string()
      .trim()
      .required(t('questionRequired'))
      .min(3, t('questionMinLength'))
      .max(140, t('questionMaxLength')),

    options: yup.array().of(
      yup.object().shape({
        text: yup
          .string()
          .trim()
          .required(t('optionRequired'))
          .max(30, t('optionMaxLength')),
      }),
    ),
  });

  const { poll, setActiveFlow, setPoll, setPostType } =
    useContext(CreatePostContext);

  useEffect(() => {
    const nodes = document.querySelectorAll('[aria-activedescendant]');
    if (nodes.length) {
      for (const each of nodes) {
        each.removeAttribute('aria-activedescendant');
      }
    }
  });

  // Form
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<IPoll>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      question: poll?.question || '',
      options: poll?.options || [
        {
          text: '',
        },
        {
          text: '',
        },
      ],
      closedAt: poll?.closedAt
        ? {
            label: 'Custom Date',
            value: '',
          }
        : {
            label: '1 Week',
            value:
              afterXUnit(1, 'weeks')
                .endOf('day')
                .toISOString()
                .substring(0, 19) + 'Z',
          },
      datepickerValue: poll?.closedAt
        ? new Date(poll?.closedAt)
        : new Date(afterXUnit(1, 'day').endOf('day').toISOString()),
    },
  });

  // Poll options form
  const { fields, append, remove } = useFieldArray({
    name: 'options',
    control,
  });

  const selectedDuration: any = watch('closedAt');

  const questionField = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: t('questionPlaceholder'),
      name: 'question',
      label: t('questionLabel'),
      error: errors.question?.message,
      dataTestId: 'createpoll-que',
      errorDataTestId: 'createpoll-que-error',
      control,
    },
  ];

  const durationFields = [
    {
      type: FieldType.SingleSelect,
      label: t('durationLabel'),
      name: 'closedAt',
      control,
      options: [
        {
          label: t('1Day'),
          value:
            afterXUnit(1, 'days').endOf('day').toISOString().substring(0, 19) +
            'Z',
          dataTestId: 'createpoll-duration-{1day}',
        },
        {
          label: t('3Days'),
          value:
            afterXUnit(3, 'days').endOf('day').toISOString().substring(0, 19) +
            'Z',
          dataTestId: 'createpoll-duration-{3day}',
        },
        {
          label: t('1Week'),
          value:
            afterXUnit(1, 'weeks').endOf('day').toISOString().substring(0, 19) +
            'Z',
          dataTestId: 'createpoll-duration-{1week}',
        },
        {
          label: t('2Weeks'),
          value:
            afterXUnit(2, 'weeks').endOf('day').toISOString().substring(0, 19) +
            'Z',
          dataTestId: 'createpoll-duration-{2week}',
        },
        {
          label: t('customDate'),
          value: '',
          dataTestId: 'createpoll-duration-{customdate}',
        },
      ],
      placeholder: t('durationPlaceholder'),
      dataTestId: 'createpoll-duration-dropdown',
      showSearch: false,
    },
  ];

  const datePickerField = [
    {
      type: FieldType.DatePicker,
      label: t('customDateLabel'),
      name: 'datepickerValue',
      control,
      minDate: new Date(afterXUnit(0, 'day').endOf('day').toISOString()),
      dataTestId: 'createpoll-duration-datepicker',
    },
  ];

  function successfulSubmit(data: IPoll) {
    let closedAt: string | undefined =
      data.closedAt.value ||
      afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z';
    if (selectedDuration?.label === 'Custom Date' && data.datepickerValue) {
      const selectedDate = new Date(data.datepickerValue);
      selectedDate.setHours(23, 59, 59, 999);
      closedAt = selectedDate.toISOString().substring(0, 19) + 'Z';
    }
    setPoll({
      question: data.question.trim(),
      options: data.options.map((option) => ({
        ...option,
        text: option.text.trim(),
      })),
      closedAt,
    });
    // After setting poll, switch back to create post mode.
    setActiveFlow(CreatePostFlow.CreatePost);
    setPostType(PostType.Poll);
  }

  return (
    <form onSubmit={handleSubmit(successfulSubmit)}>
      <Header
        title={t('headerTitle')}
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
      <div className="bg-blue-50 flex items-center justify-between px-6 py-4 gap-x-3 rounded-b-9xl w-full border-t-1 border-neutral-200">
        <p className="text-xs text-neutral-900">{t('requiredFieldNote')}</p>
        <div className="flex items-center gap-x-3">
          <Button
            onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
            label={t('backButton')}
            size={ButtonSize.Small}
            variant={ButtonVariant.Secondary}
            dataTestId="createpoll-back"
          />
          <Button
            label={t('nextButton')}
            variant={ButtonVariant.Primary}
            size={ButtonSize.Small}
            type={Type.Submit}
            dataTestId="createpoll-next"
          />
        </div>
      </div>
    </form>
  );
};

export default CreatePoll;
