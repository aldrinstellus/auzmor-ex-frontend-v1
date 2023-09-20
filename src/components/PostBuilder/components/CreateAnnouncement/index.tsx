import { FieldType } from 'components/Form';
import { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreatePostContext,
  CreatePostFlow,
  IAnnouncement,
} from 'contexts/CreatePostContext';
import { afterXUnit } from 'utils/time';
import Header from 'components/ModalHeader';
import Footer from './Footer';
import Body from './Body';
import { IPost } from 'queries/post';

interface IAnnouncementForm {
  date?: Date;
  expiryOption:
    | {
        label: string;
        value: string;
        dataTestId: string;
      }
    | IAnnouncement;
}

export enum CreateAnnouncementMode {
  POST_BUILDER,
  DIRECT,
}

export interface ICreateAnnouncementProps {
  closeModal: () => void;
  mode?: CreateAnnouncementMode;
  data?: IPost;
}

const CreateAnnouncement: FC<ICreateAnnouncementProps> = ({
  closeModal,
  mode,
  data,
}) => {
  const { setActiveFlow, announcement, clearPostContext } =
    useContext(CreatePostContext);

  const { control, handleSubmit, watch, getValues } =
    useForm<IAnnouncementForm>({
      mode: 'onChange',
      defaultValues: {
        date: announcement?.value
          ? new Date(announcement?.value)
          : new Date(afterXUnit(1, 'day').toISOString()),
        expiryOption: announcement || {
          label: '1 Week',
          value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'announcement-expiry-1week',
        },
      },
    });

  const selecetedExpiry = watch('expiryOption');

  const expiryFields = [
    {
      type: FieldType.SingleSelect,
      label: 'Announcement Expiry',
      name: 'expiryOption',
      control,
      options: [
        {
          label: '1 Day',
          value: afterXUnit(1, 'days').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'announcement-expiry-1day',
        },
        {
          label: '1 Week',
          value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'announcement-expiry-1week',
        },
        {
          label: '2 Weeks',
          value: afterXUnit(2, 'weeks').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'announcement-expiry-2weeks',
        },
        {
          label: '1 Month',
          value: afterXUnit(1, 'months').toISOString().substring(0, 19) + 'Z',
          dataTestId: 'announcement-expiry-1month',
        },
        {
          label: 'Custom Date',
          value: '',
          dataTestId: 'announcement-expiry-customdate',
        },
      ],
      placeholder: 'Select Announcement Expiry',
      dataTestId: 'announcement-expiry-dropdown',
    },
  ];

  const datepickerFields = [
    {
      type: FieldType.DatePicker,
      name: 'date',
      control,
      minDate: new Date(),
      dataTestId: 'custom-date-calendar',
    },
  ];

  return (
    <>
      <Header
        title={'Create an announcement'}
        onBackIconClick={
          mode === CreateAnnouncementMode.POST_BUILDER
            ? () => setActiveFlow(CreatePostFlow.CreatePost)
            : undefined
        }
        onClose={() => {
          clearPostContext();
          closeModal();
        }}
        closeBtnDataTestId={
          mode === CreateAnnouncementMode.POST_BUILDER
            ? 'announcement-modal-close'
            : 'promote-to-announcement-closemodal'
        }
      />
      <Body
        selecetedExpiry={selecetedExpiry}
        expiryFields={expiryFields}
        datepickerFields={datepickerFields}
      />
      <Footer
        handleSubmit={handleSubmit}
        isValid={true}
        mode={mode}
        closeModal={closeModal}
        data={data}
        getFormValues={getValues}
      />
    </>
  );
};

export default CreateAnnouncement;
