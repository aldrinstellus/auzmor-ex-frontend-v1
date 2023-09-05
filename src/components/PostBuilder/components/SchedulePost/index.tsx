import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useState } from 'react';
import timezones from 'utils/timezones.json';
import Footer from './Footer';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useCurrentUser } from 'queries/users';
import {
  afterXUnit,
  beforeXUnit,
  getTimeInScheduleFormat,
  getTimezoneNameFromIANA,
} from 'utils/time';
import moment from 'moment';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';

interface ISchedulePost {
  closeModal: () => void;
}

export interface IForm {
  timezone: { value: string; label: string };
  date: Date;
  time: string;
}

const SchedulePost: React.FC<ISchedulePost> = ({ closeModal }) => {
  const [timezoneFieldVisible, setTimezoneFieldVisible] = useState(false);
  const { setActiveFlow, clearPostContext, setSchedule, schedule } =
    useContext(CreatePostContext);
  const onSubmit = (data: IForm) => {
    setSchedule({
      timezone: data.timezone.value,
      date: getDate(data.date, data.time),
      time: data.time,
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = getTimezoneNameFromIANA(
    schedule?.timezone || currentTimezone,
  );
  const getDate = (date: Date, time: string) => {
    let hours = parseInt(time.split(' ')[0].split(':')[0]);
    const min = parseInt(time.split(' ')[0].split(':')[1]);
    if (time.indexOf('pm') > -1) {
      hours += 12;
    }
    return new Date(new Date(date).setHours(hours, min)).toISOString();
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
        value: schedule?.timezone || currentTimezone,
        label: userTimezone,
      },
      date:
        (schedule?.date && new Date(schedule?.date)) ||
        new Date(afterXUnit(1, 'day').toISOString()),
      time: schedule?.time || moment(new Date()).format('hh:mm a'),
    },
  });

  const formData = watch();
  let fields = [
    {
      type: FieldType.SingleSelect,
      label: 'Timezone',
      name: 'timezone',
      control,
      options: timezones.map((timeZone) => ({
        label: getTimezoneNameFromIANA(timeZone.iana),
        value: timeZone.iana,
        dataTestId: `scheduledpost-timezone-${timeZone.iana}`,
      })),
      defaultValue:
        {
          value: currentTimezone,
          label: userTimezone,
        } || '',
      placeholder: 'Select your timezone',
      dataTestId: 'scheduledpost-timezone',
    },
    {
      type: FieldType.DatePicker,
      label: 'Date',
      name: 'date',
      control,
      minDate: new Date(beforeXUnit(1, 'day').toISOString()),
      maxDate: new Date(afterXUnit(3, 'month').toISOString()),
      dataTestId: 'scheduledpost-date-calendar',
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
      dataTestId: 'scheduledpost-time',
      rightIcon: 'clock',
      error: errors.time?.message,
    },
  ];

  if (!timezoneFieldVisible) {
    fields = fields.filter((field) => field.name != 'timezone');
  }

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
            {getTimeInScheduleFormat(
              formData.date,
              formData.time,
              formData.timezone.value,
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
        <Footer isValid={isValid && !!!errors.time} />
      </form>
    </>
  );
};

export default SchedulePost;
