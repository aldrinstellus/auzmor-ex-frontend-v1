import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';
import { afterXUnit, getTimezoneNameFromIANA } from 'utils/time';
import timezones from 'utils/timezones.json';

interface EditSchedulePostModalProp {
  closeModal?: () => void;
  schedule: {
    timeZone: string;
    dateTime: string;
  };
}

export interface IForm {
  timeZone: { value: string; label: string };
  date: Date;
  time: string;
}

const EditSchedulePostModal: React.FC<EditSchedulePostModalProp> = ({
  closeModal,
  schedule,
}) => {
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

  const formData = watch();
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
            {moment(formData.date).format('ddd, MMM DD')} at {formData.time}{' '}
            based on your profile timezone.
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
            />
            <Button label={'Save'} dataTestId="schedule-post-next-cta" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSchedulePostModal;
