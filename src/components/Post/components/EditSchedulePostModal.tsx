import { useMutation } from '@tanstack/react-query';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import FailureToast from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import moment from 'moment';
import { IPost, IPostPayload, updatePost } from 'queries/post';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useFeedStore } from 'stores/feedStore';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
import {
  afterXUnit,
  beforeXUnit,
  getTimeInScheduleFormat,
  getTimezoneNameFromIANA,
} from 'utils/time';
import timezones from 'utils/timezones.json';

interface EditSchedulePostModalProp {
  closeModal?: () => void;
  schedule: {
    timeZone: string;
    dateTime: string;
  };
  post: IPost;
}

export interface IForm {
  timezone: { value: string; label: string };
  date: Date;
  time: string;
}

const EditSchedulePostModal: FC<EditSchedulePostModalProp> = ({
  closeModal,
  schedule,
  post,
}) => {
  const [timezoneFieldVisible, setTimezoneFieldVisible] = useState(false);
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPostPayload) =>
      updatePost(payload.id || '', payload as IPostPayload),
    onMutate: (variables) => {
      if (variables?.id) {
        const previousData = getPost(variables.id);
        updateFeed(variables.id, {
          ...getPost(variables.id),
          ...variables,
        } as IPost);
        closeModal && closeModal();
        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousData && variables?.id) {
        updateFeed(variables.id, context?.previousData);
      }
      toast(
        <FailureToast
          content="Error updating post"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: async () =>
      successToastConfig({
        message: 'Post updated successfully',
        dataTestId: 'post-update-toaster',
      }),
  });
  const userTimezone = getTimezoneNameFromIANA(schedule.timeZone);
  const { currentTimezone } = useCurrentTimezone();
  const onSubmit = (_data: IForm) => {
    // console.log(data);
  };
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    defaultValues: {
      timezone: {
        value: schedule.timeZone,
        label: userTimezone,
      },
      date: new Date(schedule.dateTime),
      time: moment(new Date(schedule.dateTime)).format('hh:mm a'),
    },
  });

  const { date, time, timezone } = watch();
  let fields = [
    {
      type: FieldType.SingleSelect,
      label: 'Timezone',
      name: 'timezone',
      control,
      options: timezones.map((timeZone) => ({
        label: getTimezoneNameFromIANA(timeZone.iana),
        value: timeZone.iana,
        dataTestId: `professional-detail-timezone-${timeZone.iana}`,
      })),
      defaultValue: {
        value: schedule.timeZone,
        label: userTimezone,
      },
      placeholder: 'Select your timezone',
      dataTestId: 'schedule-post-timezone',
    },
    {
      type: FieldType.DatePicker,
      label: 'Date',
      name: 'date',
      control,
      minDate: new Date(beforeXUnit(1, 'day').toISOString()),
      maxDate: new Date(afterXUnit(3, 'month').toISOString()),
      dataTestId: 'schedule-post-date',
    },
    {
      type: FieldType.TimePicker,
      setValue, //required
      setError, //required
      clearErrors, //required
      getValues, //required
      minTime: 'now', // required  "now" | Date
      control, //required
      dateFieldName: 'date', //require string | Date
      name: 'time',
      label: 'Time',
      placeholder: 'Select time',
      dataTestId: 'schedule-post-time',
      rightIcon: 'clock',
      error: errors.time?.message,
    },
  ];

  if (!timezoneFieldVisible) {
    fields = fields.filter((field) => field.name != 'timezone');
  }

  return (
    <Modal open={true} className="max-w-2xl">
      <Header title="Schedule a post" onClose={closeModal} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col">
          <div className="px-3 py-2 bg-primary-50 mb-4">
            {getTimeInScheduleFormat(
              date,
              time,
              timezone.value,
              currentTimezone,
            )}{' '}
            based on your profile timezone.
          </div>
          {!timezoneFieldVisible ? (
            <div className="flex flex-row space-x-2 text-sm items-end leading-5 pb-4">
              <div>{userTimezone}</div>
              <Button
                label="Edit"
                variant={ButtonVariant.Tertiary}
                size={Size.Small}
                rightIcon="edit"
                onClick={() => setTimezoneFieldVisible(true)}
                className="px-0 !py-0 mx-1"
                labelClassName="text-primary-500 text-xs leading-normal"
                rightIconClassName="mx-0.5 text-primary-500"
              />
            </div>
          ) : null}
          <Layout fields={fields} />
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
          <div className="flex">
            <Button
              variant={ButtonVariant.Secondary}
              label="Cancel"
              className="mr-3"
              dataTestId="schedule-post-backcta"
              onClick={closeModal}
            />
            <Button
              label={'Save'}
              dataTestId="schedule-post-next-cta"
              onClick={() => {
                const hours = parseInt(time.split(' ')[0].split(':')[0]);
                const min = parseInt(time.split(' ')[0].split(':')[1]);
                updatePostMutation.mutate({
                  ...post,
                  schedule: {
                    dateTime: new Date(
                      new Date(date).setHours(hours, min),
                    ).toISOString(),
                    timeZone: timezone.value,
                  },
                });
              }}
              disabled={!(isValid && !!!errors.time)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSchedulePostModal;
