import { FieldType } from 'components/Form';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { afterXUnit } from 'utils/time';
import Header from 'components/ModalHeader';
import Footer from './Footer';
import Body from './Body';

export interface ICreateAnnouncementProps {
  closeModal: () => void;
}

const CreateAnnouncement: React.FC<ICreateAnnouncementProps> = ({
  closeModal,
}) => {
  const { setActiveFlow, announcement, clearPostContext } =
    useContext(CreatePostContext);
  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });

  const selecetedExpiry = watch('expityOption');
  const customDate = watch('date');

  useEffect(() => {
    if (customDate) {
      setValue('expityOption', {
        label: 'Custom Date',
        value: customDate.toISOString().substring(0, 19) + 'Z',
      });
    }
  }, [customDate]);

  const expiryFields = [
    {
      type: FieldType.SingleSelect,
      label: 'Announcement Expiry',
      name: 'expityOption',
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
      defaultValue: announcement || {
        label: '1 Week',
        value: afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
        dataTestId: 'announcement-expiry-1week',
      },
      dataTestId: 'announcement-expiry-dropdown',
    },
  ];

  const datepickerFields = [
    {
      type: FieldType.DatePicker,
      name: 'date',
      control,
      minDate: new Date(),
      defaultValue: announcement?.value || '',
      dataTestId: 'custom-date-calendar',
    },
  ];
  return (
    <>
      <Header
        title={'Create an announcement'}
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={() => {
          clearPostContext();
          closeModal();
        }}
        closeBtnDataTestId="announcement-modal-close"
      />
      <Body
        selecetedExpiry={selecetedExpiry}
        expiryFields={expiryFields}
        datepickerFields={datepickerFields}
      />
      <Footer
        handleSubmit={handleSubmit}
        isValid={
          selecetedExpiry?.label === 'Custom Date' &&
          selecetedExpiry?.value === ''
            ? false
            : true
        }
      />
    </>
  );
};

export default CreateAnnouncement;
