import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';
import timezones from 'utils/timezones.json';
import Footer from './Footer';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useCurrentUser } from 'queries/users';
import { afterXUnit, getTimezoneNameFromIANA } from 'utils/time';
import moment from 'moment';

interface ISchedulePost {
  closeModal: () => void;
}

export interface IForm {
  timeZone: { value: string; label: string };
  date: Date;
  time: string;
}

const SchedulePost: React.FC<ISchedulePost> = ({ closeModal }) => {
  const { setActiveFlow, clearPostContext, setSchedule, schedule } =
    useContext(CreatePostContext);
  const onSubmit = (data: IForm) => {
    setSchedule({
      timezone: data.timeZone.value,
      date: data.date.toISOString(),
      time: data.time,
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  const { data } = useCurrentUser();
  const userTimezone = getTimezoneNameFromIANA(
    data?.data?.result?.data?.timeZone,
  );
  const { handleSubmit, control, setValue, watch } = useForm<IForm>({
    defaultValues: {
      timeZone: {
        value: data?.data?.result?.data?.timeZone,
        label: userTimezone,
      },
      date:
        (schedule?.date && new Date(schedule?.date)) ||
        new Date(afterXUnit(1, 'day').toISOString()),
      time: schedule?.time || moment(new Date()).format('h:mm a'),
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
      defaultValue:
        {
          value: data?.data?.result?.data?.timeZone,
          label: userTimezone,
        } || '',
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
    <>
      <Header
        title={'Schedule a post'}
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={() => {
          clearPostContext();
          closeModal();
        }}
        closeBtnDataTestId="schedule-post-modal-close"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 flex flex-col">
          <div className="px-3 py-2 bg-primary-50 mb-4">
            {moment(formData.date).format('ddd, MMM DD')} at {formData.time}{' '}
            based on your profile timezone.
          </div>
          <Layout fields={fields} />
        </div>
        <Footer />
      </form>
    </>
  );
};

export default SchedulePost;
