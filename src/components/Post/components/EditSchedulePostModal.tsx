import { useMutation } from '@tanstack/react-query';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import FailureToast from 'components/Toast/variants/FailureToast';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import moment from 'moment';
import { IPost, IPostPayload, updatePost } from 'queries/post';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useFeedStore } from 'stores/feedStore';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
import { afterXUnit, getTimezoneNameFromIANA } from 'utils/time';
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
  timeZone: { value: string; label: string };
  date: Date;
  time: string;
}

const EditSchedulePostModal: React.FC<EditSchedulePostModalProp> = ({
  closeModal,
  schedule,
  post,
}) => {
  const { feed, updateFeed } = useFeedStore();
  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPostPayload) =>
      updatePost(payload.id || '', payload as IPostPayload),
    onMutate: (variables) => {
      if (variables?.id) {
        const previousData = feed[variables.id];
        updateFeed(variables.id, {
          ...feed[variables.id],
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
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
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
        },
      );
    },
    onSuccess: async () => {
      toast(
        <SuccessToast
          content="Post updated successfully"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
    },
  });
  const userTimezone = getTimezoneNameFromIANA(schedule.timeZone);
  const onSubmit = (data: IForm) => {
    console.log(data);
  };
  const { handleSubmit, control, setValue, watch } = useForm<IForm>({
    defaultValues: {
      timeZone: {
        value: schedule.timeZone,
        label: userTimezone,
      },
      date: new Date(schedule.dateTime),
      time: moment(new Date(schedule.dateTime)).format('h:mm a'),
    },
  });

  const { date, time, timeZone } = watch();
  const fields = [
    {
      type: FieldType.SingleSelect,
      label: 'Timezone',
      name: 'timezone',
      control,
      options: timezones.map((timeZone) => ({
        label: timeZone.timezoneName,
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
      minDate: new Date(),
      maxDate: new Date(afterXUnit(3, 'month').toISOString()),
      dataTestId: 'schedule-post-date',
    },
    {
      type: FieldType.TimePicker,
      setValue,
      control,
      name: 'time',
      label: 'Time',
      placeholder: 'Select time',
      dataTestId: 'schedule-post-time',
      rightIcon: 'clock',
    },
  ];

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Schedule a post" onClose={closeModal} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col">
          <div className="px-3 py-2 bg-primary-50 mb-4">
            {moment(new Date(date)).format('ddd, MMM DD')} at {time} based on
            your profile timezone.
          </div>
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
              onClick={() =>
                updatePostMutation.mutate({
                  ...post,
                  schedule: {
                    dateTime: date.toISOString(),
                    timeZone: timeZone.value,
                  },
                })
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSchedulePostModal;
