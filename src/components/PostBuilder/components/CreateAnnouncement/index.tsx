import { FieldType } from 'components/Form';
import React, { useContext } from 'react';
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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const selecetedExpiry = watch('expityOption');
  return (
    <>
      <Header
        title={'Create an announcement'}
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={() => {
          clearPostContext();
          closeModal();
        }}
      />
      <Body
        selecetedExpiry={selecetedExpiry}
        fields={[
          {
            type: FieldType.SingleSelect,
            name: 'expityOption',
            control,
            options: [
              {
                label: '1 Day',
                value:
                  afterXUnit(1, 'days').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '1 Week',
                value:
                  afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '2 Weeks',
                value:
                  afterXUnit(2, 'weeks').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '1 Month',
                value:
                  afterXUnit(1, 'months').toISOString().substring(0, 19) + 'Z',
              },
              { label: 'Custom Date', value: '' },
            ],
            defaultValue: announcement,
          },
        ]}
      />
      <Footer handleSubmit={handleSubmit} />
    </>
  );
};

export default CreateAnnouncement;
